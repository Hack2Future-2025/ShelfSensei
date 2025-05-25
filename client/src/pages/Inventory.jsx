import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';

export default function Inventory() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [newInventory, setNewInventory] = useState({
    vendorId: '',
    productId: '',
    type: 'IN',
    quantity: '',
    price: ''
  });
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Set default selected shop to first shop in user's shops
    if (user?.shops?.length > 0 && !selectedShop) {
      setSelectedShop(user.shops[0].id);
      // Reset pagination when changing shop
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  }, [user]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);

      // Ensure user exists and a shop is selected before making the request
      if (!user || !selectedShop) {
        setError(!user ? 'User not authenticated' : 'Please select a shop');
        setInventory([]);
        setPagination({
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        });
        return;
      }

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search,
        sortBy,
        sortOrder,
        userId: user.id,
        shopId: selectedShop // Always include shopId since "All Shops" option is removed
      };

      const response = await api.get('/api/inventory', { params });
      
      // Check if response and response.data exist
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      // Set inventory with fallback to empty array
      setInventory(response.data.data || []);
      
      // Set pagination with fallback values
      setPagination({
        page: response.data.pagination?.page || 1,
        limit: response.data.pagination?.limit || 10,
        total: response.data.pagination?.total || 0,
        totalPages: response.data.pagination?.totalPages || 0
      });

      // Set additional data with fallbacks
      setVendors(response.data.vendors || []);
      setProducts(response.data.products || []);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError(err.response?.data?.error || err.message || 'Failed to fetch inventory');
      // Reset data on error
      setInventory([]);
      setPagination({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if user exists
    if (user?.id) {
      fetchInventory();
    }
  }, [pagination.page, pagination.limit, search, sortBy, sortOrder, selectedShop, user?.id]);

  const handleShopChange = (e) => {
    setSelectedShop(parseInt(e.target.value));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when changing shop
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when searching
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedShop) {
      setError('Please select a shop first');
      return;
    }

    try {
      const response = await api.post('/api/inventory', {
        shopId: selectedShop,
        vendorId: parseInt(newInventory.vendorId),
        productId: parseInt(newInventory.productId),
        type: newInventory.type,
        quantity: parseInt(newInventory.quantity),
        price: parseFloat(newInventory.price)
      });
      
      const newItem = {
        ...response.data,
        price: Number(response.data.price)
      };
      
      setInventory([...inventory, newItem]);
      setNewInventory({
        vendorId: '',
        productId: '',
        type: 'IN',
        quantity: '',
        price: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to add inventory');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
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
    <div className="container mx-auto px-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        
        <div className="flex gap-4">
          {/* Shop Selection */}
          <select
            value={selectedShop || ''}
            onChange={handleShopChange}
            className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            {user?.shops?.map(shop => (
              <option key={shop.id} value={shop.id}>
                {shop.name}
              </option>
            ))}
          </select>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search inventory..."
            value={search}
            onChange={handleSearch}
            className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              {['Product', 'Shop', 'Vendor', 'Type', 'Quantity', 'Price'].map(header => (
                <th
                  key={header.toLowerCase()}
                  onClick={() => handleSort(header.toLowerCase())}
                  className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                >
                  <div className="flex items-center space-x-1">
                    <span>{header}</span>
                    <span className="text-gray-400">
                      {sortBy === header.toLowerCase() ? (
                        sortOrder === 'asc' ? '↑' : '↓'
                      ) : (
                        <span className="opacity-0 group-hover:opacity-50">↕</span>
                      )}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {inventory.map((item) => (
              <tr 
                key={item.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{item.productName}</span>
                    <span className="text-xs text-gray-500">ID: {item.prod_id}</span>
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{item.shopName}</span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{item.vendorName}</span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.type === 'IN' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {item.quantity.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    ${typeof item.price === 'number' 
                      ? item.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })
                      : Number(item.price).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })
                    }
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {inventory.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No inventory items found
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center text-sm text-gray-700">
          <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span>
          <span className="mx-1">-</span>
          <span className="font-medium">
            {Math.min(pagination.page * pagination.limit, pagination.total)}
          </span>
          <span className="mx-1">of</span>
          <span className="font-medium">{pagination.total}</span>
          <span className="ml-1">items</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page === 1}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          >
            Previous
          </button>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page === pagination.totalPages}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add Inventory Movement Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow mt-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="vendor" className="block text-sm font-medium text-gray-700">
              Vendor
            </label>
            <select
              id="vendor"
              value={newInventory.vendorId}
              onChange={(e) => setNewInventory({ ...newInventory, vendorId: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            >
              <option value="">Select a vendor</option>
              {Array.isArray(vendors) && vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="product" className="block text-sm font-medium text-gray-700">
              Product
            </label>
            <select
              id="product"
              value={newInventory.productId}
              onChange={(e) => setNewInventory({ ...newInventory, productId: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            >
              <option value="">Select a product</option>
              {Array.isArray(products) && products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Movement Type
            </label>
            <select
              id="type"
              value={newInventory.type}
              onChange={(e) => setNewInventory({ ...newInventory, type: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            >
              <option value="IN">IN</option>
              <option value="OUT">OUT</option>
            </select>
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={newInventory.quantity}
              onChange={(e) => setNewInventory({ ...newInventory, quantity: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              id="price"
              min="0"
              step="0.01"
              value={newInventory.price}
              onChange={(e) => setNewInventory({ ...newInventory, price: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add Movement
        </button>
      </form>
    </div>
  );
} 