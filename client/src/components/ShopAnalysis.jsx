import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

export default function ShopAnalysis({ shopId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shopData, setShopData] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('inventory');
  const [timeRange, setTimeRange] = useState('30');
  const [productTrends, setProductTrends] = useState([]);

  useEffect(() => {
    if (shopId) {
      loadShopAnalysis();
    }
  }, [shopId, timeRange]);

  const loadShopAnalysis = async () => {
    try {
      setLoading(true);
      const [shopResponse, trendsResponse] = await Promise.all([
        axios.get(`http://localhost:5001/api/forecasting/shop-summary?shopId=${shopId}`),
        axios.get(`http://localhost:5001/api/forecasting/product-trends`)
      ]);

      setShopData(shopResponse.data);
      setProductTrends(trendsResponse.data.products);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load shop analysis');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!shopData) return null;

  const getStockStatus = (product) => {
    const stockLevel = product.current_stock;
    if (stockLevel <= 0) return { status: 'Out of Stock', color: 'text-red-600' };
    if (stockLevel < 5) return { status: 'Low Stock', color: 'text-yellow-600' };
    if (stockLevel < 10) return { status: 'Moderate', color: 'text-blue-600' };
    return { status: 'Good', color: 'text-green-600' };
  };

  return (
    <div className="space-y-6">
      {/* Analysis Controls */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
          >
            <option value="inventory">Inventory Levels</option>
            <option value="movements">Product Movements</option>
            <option value="value">Inventory Value</option>
          </select>
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
            <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
          </div>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {shopData.shop.statistics.total_products}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">In Stock</h3>
            <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
          </div>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {shopData.shop.statistics.products_in_stock}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Total Stock</h3>
            <ArrowTrendingDownIcon className="h-5 w-5 text-red-500" />
          </div>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {shopData.shop.statistics.total_stock}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Last Update</h3>
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          </div>
          <p className="mt-1 text-sm font-medium text-gray-900">
            {new Date(shopData.shop.statistics.last_inventory_update).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Inventory Trends Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory Trends</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={shopData.top_products}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="current_stock"
                name="Current Stock"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Movement Analysis */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Movement Analysis</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={shopData.top_products}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="movement_count"
                name="Movement Count"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products Analysis */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Moving Products</h3>
        <div className="overflow-hidden">
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {shopData.top_products.map((product) => {
                const stockStatus = getStockStatus(product);
                return (
                  <li key={product.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Price: ${product.price} | Movements: {product.movement_count}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className={`text-sm font-medium ${stockStatus.color}`}>
                            {stockStatus.status}
                          </p>
                          <p className="text-sm text-gray-500">
                            Stock: {product.current_stock}
                          </p>
                        </div>
                        <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 