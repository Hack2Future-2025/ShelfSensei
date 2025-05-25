import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/Layout';
import { Line } from 'react-chartjs-2';
import ShopAnalysis from '../components/ShopAnalysis';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  ChartBarIcon,
  BuildingStorefrontIcon,
  CubeIcon,
  ArrowTrendingUpIcon,
  ArrowsPointingOutIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Forecasting() {
  const { user, selectedShop, selectShop } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [shops, setShops] = useState([]);
  const [shopSummary, setShopSummary] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);

  useEffect(() => {
    loadAvailableOptions();
  }, []);

  useEffect(() => {
    if (selectedShop) {
      loadShopSummary();
    }
  }, [selectedShop]);

  useEffect(() => {
    if (selectedShop && selectedProduct) {
      loadForecast();
    }
  }, [selectedShop, selectedProduct]);

  // Add body scroll lock effect
  useEffect(() => {
    if (showDetailedAnalysis) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showDetailedAnalysis]);

  const loadAvailableOptions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5001/api/forecasting/available-options`);
      const transformedShops = response.data.shops.map(shopData => ({
        id: shopData.shop.id,
        name: shopData.shop.name,
        products: shopData.products || []
      }));
      setShops(transformedShops);
      if (selectedShop) {
        const contextShop = transformedShops.find(s => s.id === selectedShop.id);
        if (contextShop) {
          selectShop(contextShop);
        }
      }
      setError(null);
    } catch (err) {
      console.error('Error loading options:', err);
      setError(err.response?.data?.error || 'Failed to load shops');
    } finally {
      setLoading(false);
    }
  };

  const fetchForecastData = async () => {
    try {
      setLoading(true);
      const params = {
        ...(selectedShop ? { shopId: selectedShop.id } : {}),
        ...(selectedProduct ? { productId: selectedProduct } : {})
      };

      const response = await axios.get('http://localhost:5001/api/forecasting/inventory-trends', { params });
      setForecastData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching forecast data:', err);
      setError(err.response?.data?.message || 'Failed to fetch forecast data');
    } finally {
      setLoading(false);
    }
  };

  const fetchTopProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/forecasting/product-trends');
      setTopProducts(response.data.products);
    } catch (err) {
      console.error('Error fetching top products:', err);
    }
  };

  const loadShopSummary = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/forecasting/shop-summary?shopId=${selectedShop.id}`);
      setShopSummary(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load shop summary');
    }
  };

  const loadForecast = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/forecasting/inventory-trends?shopId=${selectedShop.id}&productId=${selectedProduct.id}`
      );
      setForecast(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load forecast');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getChartData = () => {
    if (!forecast) return null;

    return {
      labels: [...forecast.historical.dates, ...forecast.forecast.dates],
      datasets: [
        {
          label: 'Historical',
          data: forecast.historical.values,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          pointRadius: 2,
          fill: true,
        },
        {
          label: 'Forecast',
          data: [...Array(forecast.historical.values.length).fill(null), ...forecast.forecast.values],
          borderColor: 'rgb(99, 102, 241)',
          borderDash: [5, 5],
          pointRadius: 0,
        },
        {
          label: 'Upper Bound',
          data: [...Array(forecast.historical.values.length).fill(null), ...forecast.forecast.upper_bound],
          borderColor: 'rgba(99, 102, 241, 0.2)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          pointRadius: 0,
          fill: '+1',
        },
        {
          label: 'Lower Bound',
          data: [...Array(forecast.historical.values.length).fill(null), ...forecast.forecast.lower_bound],
          borderColor: 'rgba(99, 102, 241, 0.2)',
          pointRadius: 0,
          fill: false,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Inventory Forecast',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading && !shops.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className={showDetailedAnalysis ? 'h-screen flex flex-col' : ''}>
      {/* Header */}
      <div className={`${showDetailedAnalysis ? 'shrink-0' : ''} border-b border-gray-200 pb-4 px-6 pt-6 bg-white sticky top-0 z-10`}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">ShelfSensei Forecasting</h1>
            <p className="mt-2 text-sm text-gray-500">
              Let your inventory master guide you through trends and predictions
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                showDetailedAnalysis 
                ? 'text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-50' 
                : 'text-white bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {showDetailedAnalysis ? (
                <>
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  View Forecast
                </>
              ) : (
                <>
                  <ArrowsPointingOutIcon className="h-5 w-5 mr-2" />
                  Detailed Analysis
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {showDetailedAnalysis ? (
        <div className="flex-1 min-h-0">
          <div className="h-full px-6 py-4 overflow-y-auto">
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow">
                {selectedShop ? (
                  <div className="p-6">
                    <div className="space-y-6">
                      <ShopAnalysis shopId={selectedShop.id} />
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    Please select a shop to view detailed analysis
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6 py-4">
          <div className="space-y-6">
            {/* Shop Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Shop</label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={selectedShop?.id || ''}
                  onChange={(e) => {
                    const selectedId = parseInt(e.target.value);
                    const shop = shops.find(s => s.id === selectedId);
                    selectShop(shop || null);
                    setSelectedProduct(null);
                    setForecast(null);
                  }}
                >
                  <option value="">Choose a shop</option>
                  {shops.map((shop) => (
                    <option key={shop.id} value={shop.id}>
                      {shop.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedShop && (
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Product</label>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={selectedProduct?.id || ''}
                    onChange={(e) => {
                      const selectedId = parseInt(e.target.value);
                      const shop = shops.find(s => s.id === selectedShop.id);
                      const product = shop?.products?.find(p => p.id === selectedId);
                      setSelectedProduct(product || null);
                    }}
                  >
                    <option value="">Choose a product</option>
                    {selectedShop?.products?.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} (Stock: {product.current_stock})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Shop Summary */}
            {shopSummary && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Shop Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <BuildingStorefrontIcon className="h-6 w-6 text-indigo-600" />
                      <span className="ml-2 text-sm font-medium text-gray-500">Total Products</span>
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-gray-900">
                      {shopSummary.shop.statistics.total_products}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <CubeIcon className="h-6 w-6 text-green-600" />
                      <span className="ml-2 text-sm font-medium text-gray-500">In Stock</span>
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-gray-900">
                      {shopSummary.shop.statistics.products_in_stock}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <ChartBarIcon className="h-6 w-6 text-blue-600" />
                      <span className="ml-2 text-sm font-medium text-gray-500">Total Stock</span>
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-gray-900">
                      {shopSummary.shop.statistics.total_stock}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600" />
                      <span className="ml-2 text-sm font-medium text-gray-500">Last Update</span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-900">
                      {formatDate(shopSummary.shop.statistics.last_inventory_update)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Forecast Analysis */}
            {forecast && (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium text-gray-900">Forecast Analysis</h2>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      Confidence Level:{' '}
                      <span className="font-medium text-gray-900">
                        {forecast.metrics.confidence_level}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Growth Rate:{' '}
                      <span className={`font-medium ${forecast.metrics.growth_rate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {forecast.metrics.growth_rate}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="h-96">
                  <Line data={getChartData()} options={chartOptions} />
                </div>

                <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Recommended Stock Level
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          Based on the forecast, it is recommended to maintain a stock level of{' '}
                          <span className="font-medium">{forecast.metrics.recommended_stock}</span> units
                          to meet expected demand with 95% confidence.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Top Products */}
            {shopSummary && (
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 mb-3">Top Moving Products</h3>
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {shopSummary.top_products.map((product) => (
                      <li key={product.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-indigo-600 truncate">{product.name}</p>
                            <p className="ml-2 text-sm text-gray-500">
                              (Stock: {product.current_stock})
                            </p>
                          </div>
                          <div className="flex items-center">
                            <p className="text-sm text-gray-500 mr-4">
                              {product.movement_count} movements
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              ${product.price}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 