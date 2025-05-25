-- Clean up existing data
DROP TABLE IF EXISTS product_in;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS shop;

-- Create tables
CREATE TABLE IF NOT EXISTS shop (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS product_in (
    id SERIAL PRIMARY KEY,
    shop_id INTEGER NOT NULL REFERENCES shop(id),
    prod_id INTEGER NOT NULL REFERENCES product(id),
    quantity INTEGER NOT NULL,
    type VARCHAR(3) NOT NULL CHECK (type IN ('IN', 'OUT')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed shops
INSERT INTO shop (name) VALUES
    ('Main Street Store'),
    ('Downtown Branch'),
    ('Shopping Mall Outlet'),
    ('Express Corner'),
    ('Wholesale Center');

-- Seed products
INSERT INTO product (name, price) VALUES
    ('Laptop Pro X', 1299.99),
    ('Smartphone Y20', 699.99),
    ('Wireless Earbuds', 129.99),
    ('Smart Watch Elite', 249.99),
    ('Tablet Air', 449.99),
    ('Gaming Console X', 499.99),
    ('4K Monitor', 399.99),
    ('Wireless Keyboard', 79.99),
    ('Bluetooth Speaker', 89.99),
    ('Power Bank 20000mAh', 49.99);

-- Seed inventory movements with realistic patterns
-- Last 90 days of data with multiple movements per day
WITH dates AS (
    SELECT generate_series(
        CURRENT_DATE - INTERVAL '90 days',
        CURRENT_DATE,
        '1 day'::interval
    ) AS movement_date
)
INSERT INTO product_in (shop_id, prod_id, quantity, type, created_at)
SELECT 
    -- Distribute across all shops
    1 + (random() * 4)::int as shop_id,
    -- Distribute across all products
    1 + (random() * 9)::int as prod_id,
    -- Quantity between 1 and 20
    1 + (random() * 19)::int as quantity,
    -- Mix of IN and OUT with more INs than OUTs
    CASE WHEN random() < 0.6 THEN 'IN' ELSE 'OUT' END as type,
    -- Timestamp within the day
    movement_date + (random() * INTERVAL '24 hours') as created_at
FROM dates
-- Multiple movements per day (3-7 movements)
CROSS JOIN generate_series(1, 5) AS movements
WHERE random() < 0.8; -- 80% chance of movement on any day

-- Add specific test cases for forecasting
-- Ensure each shop has at least 10 movements for each product
INSERT INTO product_in (shop_id, prod_id, quantity, type, created_at)
SELECT 
    s.id as shop_id,
    p.id as prod_id,
    (random() * 10 + 1)::int as quantity,
    CASE WHEN random() < 0.6 THEN 'IN' ELSE 'OUT' END as type,
    CURRENT_DATE - (random() * 90)::int * INTERVAL '1 day' as created_at
FROM shop s
CROSS JOIN product p
CROSS JOIN generate_series(1, 10) AS num
ORDER BY created_at;

-- Add consistent movement patterns for testing
-- Regular weekly stock replenishment for popular items
INSERT INTO product_in (shop_id, prod_id, quantity, type, created_at)
SELECT 
    s.id as shop_id,
    p.id as prod_id,
    10 as quantity,
    'IN' as type,
    (CURRENT_DATE - (n * 7) * INTERVAL '1 day') as created_at
FROM shop s
CROSS JOIN (SELECT id FROM product WHERE id <= 3) p -- Top 3 products
CROSS JOIN generate_series(1, 12) AS n -- 12 weeks of regular replenishment
WHERE random() < 0.9; -- 90% consistency in weekly replenishment

-- Add daily sales patterns
INSERT INTO product_in (shop_id, prod_id, quantity, type, created_at)
SELECT 
    s.id as shop_id,
    p.id as prod_id,
    (random() * 3 + 1)::int as quantity,
    'OUT' as type,
    (CURRENT_DATE - n * INTERVAL '1 day' + random() * INTERVAL '12 hours') as created_at
FROM shop s
CROSS JOIN (SELECT id FROM product WHERE id <= 5) p -- Top 5 products
CROSS JOIN generate_series(1, 90) AS n -- Last 90 days
WHERE random() < 0.7; -- 70% chance of daily sales

-- Add seasonal peaks (end of month restocking)
INSERT INTO product_in (shop_id, prod_id, quantity, type, created_at)
SELECT 
    s.id as shop_id,
    p.id as prod_id,
    20 as quantity,
    'IN' as type,
    date_trunc('month', CURRENT_DATE - (n || ' months')::interval) + interval '28 days' as created_at
FROM shop s
CROSS JOIN product p
CROSS JOIN generate_series(0, 2) AS n -- Last 3 months
WHERE random() < 0.95; -- 95% consistency in monthly restocking

-- Add some high-volume movements for specific products
INSERT INTO product_in (shop_id, prod_id, quantity, type, created_at)
SELECT 
    s.id as shop_id,
    p.id as prod_id,
    (random() * 30 + 20)::int as quantity,
    CASE WHEN random() < 0.7 THEN 'IN' ELSE 'OUT' END as type,
    CURRENT_DATE - (random() * 90)::int * INTERVAL '1 day' as created_at
FROM shop s
CROSS JOIN (SELECT id FROM product WHERE id <= 3) p -- Top 3 products
CROSS JOIN generate_series(1, 5) AS n -- 5 high-volume movements per product
WHERE random() < 0.8;

-- Ensure minimum data points for forecasting
-- Add at least 3 movements for each shop-product combination
INSERT INTO product_in (shop_id, prod_id, quantity, type, created_at)
SELECT 
    s.id as shop_id,
    p.id as prod_id,
    (random() * 10 + 1)::int as quantity,
    CASE WHEN n = 1 THEN 'IN' ELSE 'OUT' END as type,
    CURRENT_DATE - (90 - n * 30)::int * INTERVAL '1 day' as created_at
FROM shop s
CROSS JOIN product p
CROSS JOIN generate_series(1, 3) AS n
WHERE NOT EXISTS (
    SELECT 1 
    FROM product_in pi 
    WHERE pi.shop_id = s.id 
    AND pi.prod_id = p.id 
    GROUP BY pi.shop_id, pi.prod_id 
    HAVING COUNT(*) >= 3
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_product_in_shop_id ON product_in(shop_id);
CREATE INDEX IF NOT EXISTS idx_product_in_prod_id ON product_in(prod_id);
CREATE INDEX IF NOT EXISTS idx_product_in_created_at ON product_in(created_at);
CREATE INDEX IF NOT EXISTS idx_product_in_type ON product_in(type); 