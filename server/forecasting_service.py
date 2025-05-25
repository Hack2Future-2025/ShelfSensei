from quart import Quart, jsonify, request
from quart_cors import cors
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from datetime import datetime, timedelta
import asyncpg
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

app = Quart(__name__)
app = cors(app)

# Database connection pool
pool = None

async def init_db_pool():
    """Initialize the database pool."""
    global pool
    if pool is None:
        pool = await asyncpg.create_pool(
            host="database-1.cfcoiu6cowe0.ap-south-1.rds.amazonaws.com",
            port=5432,
            database="postgres",
            user="Scott",
            password="Tiger12345",
            min_size=1,
            max_size=10
        )
    return pool

async def get_db_pool():
    """Get the database pool, creating it if necessary."""
    if pool is None:
        await init_db_pool()
    return pool

@app.before_serving
async def startup():
    """Initialize resources before serving."""
    await init_db_pool()

@app.after_serving
async def shutdown():
    """Cleanup resources after serving."""
    global pool
    if pool:
        await pool.close()

@app.route('/api/forecasting/inventory-trends', methods=['GET'])
async def get_inventory_trends():
    try:
        shop_id = request.args.get('shopId')
        product_id = request.args.get('productId')

        print(f"Received request for shopId={shop_id}, productId={product_id}")

        # First, let's check if the product exists
        db_pool = await get_db_pool()
        async with db_pool.acquire() as conn:
            # Check if product exists
            if product_id:
                product = await conn.fetchrow(
                    "SELECT id, name FROM product WHERE id = $1",
                    int(product_id)
                )
                if not product:
                    return jsonify({
                        'error': 'Product not found',
                        'details': f'No product found with ID {product_id}'
                    }), 404

            # Check if shop exists
            if shop_id:
                shop = await conn.fetchrow(
                    "SELECT id FROM shop WHERE id = $1",
                    int(shop_id)
                )
                if not shop:
                    return jsonify({
                        'error': 'Shop not found',
                        'details': f'No shop found with ID {shop_id}'
                    }), 404

            # Get a sample of data to verify table structure
            sample = await conn.fetch("""
                SELECT COUNT(*) as total_records,
                       COUNT(DISTINCT prod_id) as unique_products,
                       COUNT(DISTINCT shop_id) as unique_shops,
                       MIN(created_at) as earliest_date,
                       MAX(created_at) as latest_date
                FROM product_in
            """)
            
            print("Database statistics:")
            print(f"Total records: {sample[0]['total_records']}")
            print(f"Unique products: {sample[0]['unique_products']}")
            print(f"Unique shops: {sample[0]['unique_shops']}")
            print(f"Date range: {sample[0]['earliest_date']} to {sample[0]['latest_date']}")

            # Convert parameters to integers if they exist
            try:
                shop_id = int(shop_id) if shop_id else None
                product_id = int(product_id) if product_id else None
            except ValueError as e:
                return jsonify({
                    'error': 'Invalid parameter format',
                    'details': 'Shop ID and Product ID must be valid integers'
                }), 400

            # Get historical inventory movements with more detailed logging
            query = """
                SELECT 
                    created_at as ds,
                    CASE 
                        WHEN type = 'IN' THEN quantity
                        ELSE -quantity
                    END as y,
                    type,
                    quantity,
                    prod_id,
                    shop_id
                FROM product_in
                WHERE 1=1
            """
            params = []

            if shop_id is not None:
                query += " AND shop_id = $1"
                params.append(shop_id)
            if product_id is not None:
                query += f" AND prod_id = ${len(params) + 1}"
                params.append(product_id)

            query += " ORDER BY created_at"
            
            print(f"Executing query: {query}")
            print(f"With parameters: {params}")
            
            # Execute the main query
            rows = await conn.fetch(query, *params)
            
            print(f"Query returned {len(rows)} rows")
            if len(rows) == 0:
                # If no rows found, let's check if there are any records for this product/shop combination
                check_query = "SELECT COUNT(*) FROM product_in WHERE "
                check_conditions = []
                check_params = []
                
                if shop_id:
                    check_conditions.append("shop_id = $1")
                    check_params.append(shop_id)
                if product_id:
                    param_num = len(check_params) + 1
                    check_conditions.append(f"prod_id = ${param_num}")
                    check_params.append(product_id)
                
                check_query += " AND ".join(check_conditions) if check_conditions else "1=1"
                count = await conn.fetchval(check_query, *check_params)
                
                return jsonify({
                    'error': 'No data available for forecasting',
                    'details': {
                        'message': f'No inventory movements found for the specified criteria',
                        'shop_id': shop_id,
                        'product_id': product_id,
                        'total_matching_records': count,
                        'database_stats': {
                            'total_records': sample[0]['total_records'],
                            'unique_products': sample[0]['unique_products'],
                            'unique_shops': sample[0]['unique_shops'],
                            'date_range': {
                                'start': sample[0]['earliest_date'].isoformat() if sample[0]['earliest_date'] else None,
                                'end': sample[0]['latest_date'].isoformat() if sample[0]['latest_date'] else None
                            }
                        }
                    }
                }), 400

        # Convert to DataFrame
        df = pd.DataFrame([dict(row) for row in rows])
        
        if df.empty:
            return jsonify({
                'error': 'No data available for forecasting',
                'details': f'No inventory movements found for shop_id={shop_id} and product_id={product_id}'
            }), 400

        # Calculate cumulative inventory
        df['y'] = df['y'].cumsum()
        
        # Convert dates to numeric values for modeling
        df['days_from_start'] = (pd.to_datetime(df['ds']) - pd.to_datetime(df['ds']).min()).dt.days
        
        # Prepare data for regression
        X = df['days_from_start'].values.reshape(-1, 1)
        y = df['y'].values

        # Choose regression type based on number of data points
        if len(df) < 2:
            return jsonify({
                'error': 'Insufficient data for forecasting',
                'details': f'Found only {len(df)} data point. Minimum 2 required for trend analysis.',
                'available_data': {
                    'points': len(df),
                    'dates': df['ds'].dt.strftime('%Y-%m-%d').tolist(),
                    'values': df['y'].tolist()
                }
            }), 400
        
        try:
            if len(df) == 2:
                # Use simple linear regression for 2 points
                model = LinearRegression()
                X_model = X
            else:
                # Use polynomial regression for 3 or more points
                poly_features = PolynomialFeatures(degree=2)
                X_model = poly_features.fit_transform(X)
                model = LinearRegression()
            
            # Fit model
            model.fit(X_model, y)
            
            # Generate future dates
            last_date = pd.to_datetime(df['ds'].max())
            future_dates = pd.date_range(start=last_date, periods=91, freq='D')  # 90 days forecast
            future_days = (future_dates - pd.to_datetime(df['ds']).min()).days.values.reshape(-1, 1)
            
            # Make predictions
            if len(df) == 2:
                future_X = future_days
            else:
                future_X = poly_features.transform(future_days)
            predictions = model.predict(future_X)
            
            # Calculate confidence intervals
            y_pred = model.predict(X_model)
            residuals = y - y_pred
            residual_std = np.std(residuals) if len(df) > 2 else abs(residuals[0])  # Use absolute difference for 2 points
            confidence_interval = 1.96 * residual_std

            # Calculate confidence level based on R-squared score
            confidence_level = max(0, min(100, model.score(X_model, y) * 100))
            if len(df) == 2:
                # Adjust confidence level for linear regression with 2 points
                confidence_level = min(confidence_level, 50)  # Cap at 50% for 2 points

            # Prepare response data
            historical_dates = pd.to_datetime(df['ds']).dt.strftime('%Y-%m-%d').tolist()
            historical_values = df['y'].round(2).tolist()
            
            predicted_dates = future_dates.strftime('%Y-%m-%d').tolist()
            predicted_values = predictions.round(2).tolist()
            predicted_lower = (predictions - confidence_interval).round(2).tolist()
            predicted_upper = (predictions + confidence_interval).round(2).tolist()
            
            # Calculate metrics
            current_value = historical_values[-1]
            predicted_end_value = predicted_values[-1]
            growth_rate = ((predicted_end_value - current_value) / current_value * 100) if current_value != 0 else 0
            
            # Calculate recommended stock level
            recommended_stock = int(np.percentile(predicted_upper, 95))

            print("Successfully generated forecast")
            return jsonify({
                'historical': {
                    'dates': historical_dates,
                    'values': historical_values
                },
                'forecast': {
                    'dates': predicted_dates,
                    'values': predicted_values,
                    'lower_bound': predicted_lower,
                    'upper_bound': predicted_upper
                },
                'metrics': {
                    'growth_rate': round(growth_rate, 1),
                    'confidence_level': round(confidence_level, 1),
                    'recommended_stock': recommended_stock,
                    'data_points': len(df)
                }
            })

        except Exception as model_error:
            print(f"Error in model fitting/prediction: {str(model_error)}")
            return jsonify({
                'error': 'Failed to generate forecast model',
                'details': str(model_error)
            }), 500

    except Exception as e:
        print(f"Error in forecasting: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'Failed to generate forecast',
            'details': str(e)
        }), 500

@app.route('/api/forecasting/product-trends', methods=['GET'])
async def get_product_trends():
    try:
        # Get top products by movement volume
        query = """
            SELECT 
                p.id,
                p.name,
                p.price,
                COUNT(*) as movement_count,
                SUM(CASE WHEN pi.type = 'IN' THEN pi.quantity ELSE -pi.quantity END) as net_quantity
            FROM product p
            JOIN product_in pi ON p.id = pi.prod_id
            GROUP BY p.id, p.name, p.price
            ORDER BY movement_count DESC
            LIMIT 10
        """
        
        db_pool = await get_db_pool()
        async with db_pool.acquire() as conn:
            rows = await conn.fetch(query)
        
        products = [dict(row) for row in rows]

        return jsonify({
            'products': products
        })

    except Exception as e:
        print(f"Error getting product trends: {str(e)}")
        return jsonify({
            'error': 'Failed to get product trends',
            'details': str(e)
        }), 500

@app.route('/api/forecasting/available-options', methods=['GET'])
async def get_available_options():
    try:
        db_pool = await get_db_pool()
        async with db_pool.acquire() as conn:
            # Get all shops
            shops_query = """
                SELECT DISTINCT 
                    s.id, 
                    s.name
                FROM shop s
                ORDER BY s.name
            """
            shops = await conn.fetch(shops_query)

            # For each shop, get available products
            result = []
            for shop in shops:
                # Get products with inventory in this shop
                products_query = """
                    WITH current_stock AS (
                        SELECT 
                            prod_id,
                            SUM(CASE WHEN type = 'IN' THEN quantity ELSE -quantity END) as stock_level
                        FROM product_in
                        WHERE shop_id = $1
                        GROUP BY prod_id
                    )
                    SELECT DISTINCT 
                        p.id,
                        p.name,
                        p.price,
                        COALESCE(cs.stock_level, 0) as current_stock
                    FROM product p
                    LEFT JOIN current_stock cs ON p.id = cs.prod_id
                    WHERE EXISTS (
                        SELECT 1 
                        FROM product_in pi 
                        WHERE pi.prod_id = p.id 
                        AND pi.shop_id = $1
                    )
                    ORDER BY p.name
                """
                products = await conn.fetch(products_query, shop['id'])

                result.append({
                    'shop': {
                        'id': shop['id'],
                        'name': shop['name']
                    },
                    'products': [
                        {
                            'id': product['id'],
                            'name': product['name'],
                            'price': float(product['price']),
                            'current_stock': int(product['current_stock'])
                        }
                        for product in products
                    ]
                })

            return jsonify({
                'shops': result
            })

    except Exception as e:
        print(f"Error getting available options: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'Failed to get available options',
            'details': str(e)
        }), 500

@app.route('/api/forecasting/shop-summary', methods=['GET'])
async def get_shop_summary():
    try:
        shop_id = request.args.get('shopId')
        if not shop_id:
            return jsonify({
                'error': 'Missing parameter',
                'details': 'shopId is required'
            }), 400

        try:
            shop_id = int(shop_id)
        except ValueError:
            return jsonify({
                'error': 'Invalid parameter',
                'details': 'shopId must be a valid integer'
            }), 400

        db_pool = await get_db_pool()
        async with db_pool.acquire() as conn:
            # Get shop details and summary statistics
            summary_query = """
                WITH product_stats AS (
                    SELECT 
                        prod_id,
                        SUM(CASE WHEN type = 'IN' THEN quantity ELSE -quantity END) as current_stock,
                        COUNT(*) as movement_count,
                        MAX(created_at) as last_movement
                    FROM product_in
                    WHERE shop_id = $1
                    GROUP BY prod_id
                )
                SELECT 
                    s.name as shop_name,
                    COUNT(DISTINCT ps.prod_id) as total_products,
                    SUM(CASE WHEN ps.current_stock > 0 THEN 1 ELSE 0 END) as products_in_stock,
                    SUM(ps.current_stock) as total_stock,
                    MAX(ps.last_movement) as last_inventory_update
                FROM shop s
                LEFT JOIN product_stats ps ON 1=1
                WHERE s.id = $1
                GROUP BY s.id, s.name
            """
            
            shop_summary = await conn.fetchrow(summary_query, shop_id)
            
            if not shop_summary:
                return jsonify({
                    'error': 'Shop not found',
                    'details': f'No shop found with ID {shop_id}'
                }), 404

            # Get top moving products
            top_products_query = """
                WITH product_movements AS (
                    SELECT 
                        p.id,
                        p.name,
                        p.price,
                        SUM(CASE WHEN pi.type = 'IN' THEN pi.quantity ELSE -pi.quantity END) as current_stock,
                        COUNT(*) as movement_count,
                        MAX(pi.created_at) as last_movement
                    FROM product p
                    JOIN product_in pi ON p.id = pi.prod_id
                    WHERE pi.shop_id = $1
                    GROUP BY p.id, p.name, p.price
                )
                SELECT *
                FROM product_movements
                WHERE current_stock > 0
                ORDER BY movement_count DESC
                LIMIT 5
            """
            
            top_products = await conn.fetch(top_products_query, shop_id)

            return jsonify({
                'shop': {
                    'name': shop_summary['shop_name'],
                    'statistics': {
                        'total_products': shop_summary['total_products'],
                        'products_in_stock': shop_summary['products_in_stock'],
                        'total_stock': shop_summary['total_stock'],
                        'last_inventory_update': shop_summary['last_inventory_update'].isoformat() if shop_summary['last_inventory_update'] else None
                    }
                },
                'top_products': [
                    {
                        'id': product['id'],
                        'name': product['name'],
                        'price': float(product['price']),
                        'current_stock': int(product['current_stock']),
                        'movement_count': product['movement_count'],
                        'last_movement': product['last_movement'].isoformat()
                    }
                    for product in top_products
                ]
            })

    except Exception as e:
        print(f"Error getting shop summary: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'Failed to get shop summary',
            'details': str(e)
        }), 500

if __name__ == '__main__':
    app.run(port=5001) 