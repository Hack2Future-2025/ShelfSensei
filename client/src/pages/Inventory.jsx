import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import { PlusIcon } from '@heroicons/react/24/outline';

// Add Movement Modal Component
const AddMovementModal = ({ show, onClose, onSubmit, vendors, products, selectedShop }) => {
  const [formData, setFormData] = useState({
    vendorId: '',
    productId: '',
    type: 'IN',
    quantity: '',
    price: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({
      vendorId: '',
      productId: '',
      type: 'IN',
      quantity: '',
      price: ''
    });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 overflow-y-auto h-full w-full z-50">
      <div 
        className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div 
          className="relative bg-white/90 backdrop-blur-sm w-[600px] rounded-xl shadow-card p-8 transform transition-all duration-300 animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 animate-slide-in-left">Add New Movement</h3>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-500 transition-colors duration-300 hover:rotate-90 transform"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product and Vendor Selection */}
            <div className="grid grid-cols-2 gap-6 animate-slide-in-up" style={{ animationDelay: '100ms' }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 transition-all duration-300 hover:border-indigo-400"
                  required
                >
                  <option value="">Select a product</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vendor
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={formData.vendorId}
                  onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 transition-all duration-300 hover:border-indigo-400"
                  required
                >
                  <option value="">Select a vendor</option>
                  {vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Movement Details */}
            <div className="grid grid-cols-3 gap-6 animate-slide-in-up" style={{ animationDelay: '200ms' }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Movement Type
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex gap-4">
                  {['IN', 'OUT'].map((type) => (
                    <label key={type} className="inline-flex items-center">
                      <input
                        type="radio"
                        value={type}
                        checked={formData.type === type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 transition-all duration-300 hover:border-indigo-400"
                    placeholder="0"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="block w-full rounded-md border-gray-300 pl-7 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 transition-all duration-300 hover:border-indigo-400"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 animate-slide-in-up" style={{ animationDelay: '300ms' }}>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:shadow-md active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:shadow-md active:scale-95"
              >
                Add Movement
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

function Inventory() {
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
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Debounce search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

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
        search: debouncedSearch,
        sortBy,
        sortOrder,
        userId: user.id,
        shopId: selectedShop
      };

      const response = await api.get('/api/inventory', { params });
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      setInventory(response.data.data || []);
      setPagination({
        page: response.data.pagination?.page || 1,
        limit: response.data.pagination?.limit || 10,
        total: response.data.pagination?.total || 0,
        totalPages: response.data.pagination?.totalPages || 0
      });
      setVendors(response.data.vendors || []);
      setProducts(response.data.products || []);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError(err.response?.data?.error || err.message || 'Failed to fetch inventory');
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
    if (user?.id) {
      fetchInventory();
    }
  }, [pagination.page, pagination.limit, debouncedSearch, sortBy, sortOrder, selectedShop, user?.id]);

  const handleShopChange = (e) => {
    setSelectedShop(parseInt(e.target.value));
    setPagination(prev => ({ ...prev, page: 1 }));
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
    const value = e.target.value;
    setSearch(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Add separate functions to fetch vendors and products
  const fetchVendorsAndProducts = async () => {
    try {
      const [vendorsResponse, productsResponse] = await Promise.all([
        api.get('/api/vendors'),
        api.get('/api/products')
      ]);

      if (vendorsResponse?.data) {
        setVendors(vendorsResponse.data.data || []);
      }
      if (productsResponse?.data) {
        setProducts(productsResponse.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching vendors and products:', err);
      setError('Failed to load vendors and products');
    }
  };

  // Add effect to fetch vendors and products on mount
  useEffect(() => {
    fetchVendorsAndProducts();
  }, []);

  const handleAddMovement = async (formData) => {
    if (!selectedShop) {
      setError('Please select a shop first');
      return;
    }

    try {
      setError(null);
      const payload = {
        shopId: selectedShop,
        vendorId: parseInt(formData.vendorId),
        productId: parseInt(formData.productId),
        type: formData.type,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price)
      };

      const response = await api.post('/api/inventory', payload);
      
      if (!response?.data) {
        throw new Error('Invalid response from server');
      }

      const newItem = {
        ...response.data,
        price: Number(response.data.price),
        productName: products.find(p => p.id === payload.productId)?.name,
        vendorName: vendors.find(v => v.id === payload.vendorId)?.name,
        shopName: user.shops.find(s => s.id === payload.shopId)?.name
      };
      
      setInventory(prev => [newItem, ...prev]);
      setShowAddModal(false);
      fetchInventory(); // Refresh the list
    } catch (err) {
      console.error('Error adding inventory movement:', err);
      setError(err.response?.data?.error || err.message || 'Failed to add inventory movement');
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
      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Shop Selection */}
            <select
              id="shop"
              value={selectedShop || ''}
              onChange={handleShopChange}
              className="block w-[180px] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              required
            >
              {user?.shops?.map(shop => (
                <option key={shop.id} value={shop.id}>
                  {shop.name}
                </option>
              ))}
            </select>

            {/* Search Box */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                value={search}
                onChange={handleSearch}
                className="block w-[200px] rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Search inventory..."
              />
            </div>

            {/* Add Movement Button */}
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              Add Movement
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
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
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              {[
                { label: 'Product', key: 'productName' },
                { label: 'Shop', key: 'shopName' },
                { label: 'Vendor', key: 'vendorName' },
                { label: 'Type', key: 'type' },
                { label: 'Quantity', key: 'quantity' },
                { label: 'Price', key: 'price' }
              ].map(({ label, key }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150 group"
                >
                  <div className="flex items-center space-x-1">
                    <span>{label}</span>
                    <span className="text-gray-400">
                      {sortBy === key ? (
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
            {search ? 'No results found' : 'No inventory items found'}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
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
        <div className="flex flex-wrap justify-center gap-2">
          {[...Array(pagination.totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => setPagination(prev => ({ ...prev, page: index + 1 }))}
              className={`inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded-md ${
                pagination.page === index + 1
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150`}
            >
              {index + 1}
            </button>
          ))}
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

      {/* Add Movement Modal */}
      <AddMovementModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddMovement}
        vendors={vendors}
        products={products}
        selectedShop={selectedShop}
      />
    </div>
  );
}

export default Inventory; 