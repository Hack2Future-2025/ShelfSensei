import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function ProductCharts() {
  const { user, selectedShop } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    productsByCategory: {},
    monthlyMovements: {},
    inventoryByShop: {},
    recentMovements: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          userId: user.id,
          ...(selectedShop ? { shopId: selectedShop.id } : {})
        };

        const response = await api.get('/api/dashboard', { params });
        setDashboardData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user, selectedShop]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Products by Category */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Products by Category</h2>
        <div className="h-64">
          <Pie
            data={{
              labels: Object.keys(dashboardData.productsByCategory),
              datasets: [
                {
                  data: Object.values(dashboardData.productsByCategory),
                  backgroundColor: [
                    '#4F46E5',
                    '#10B981',
                    '#F59E0B',
                    '#EF4444',
                    '#8B5CF6',
                    '#EC4899',
                    '#6366F1'
                  ]
                }
              ]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }}
          />
        </div>
      </div>

      {/* Monthly Movements */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Inventory Movements</h2>
        <div className="h-64">
          <Bar
            data={{
              labels: Object.keys(dashboardData.monthlyMovements),
              datasets: [
                {
                  label: 'IN',
                  data: Object.values(dashboardData.monthlyMovements).map(m => m.in),
                  backgroundColor: '#10B981'
                },
                {
                  label: 'OUT',
                  data: Object.values(dashboardData.monthlyMovements).map(m => m.out),
                  backgroundColor: '#EF4444'
                }
              ]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              },
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </div>
      </div>

      {/* Inventory by Shop */}
      <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Inventory by Shop</h2>
        <div className="h-64">
          <Bar
            data={{
              labels: Object.keys(dashboardData.inventoryByShop),
              datasets: [
                {
                  label: 'Total Items',
                  data: Object.values(dashboardData.inventoryByShop),
                  backgroundColor: '#6366F1'
                }
              ]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              },
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
} 