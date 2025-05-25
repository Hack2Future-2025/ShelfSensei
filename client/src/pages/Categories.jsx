import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import api from '../utils/axios';

// Add Category Modal Component
const AddCategoryModal = ({ show, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({ name: '' });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Add New Category</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter category name"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Category Modal Component
const EditCategoryModal = ({ show, onClose, onSubmit, category }) => {
  const [formData, setFormData] = useState({
    name: ''
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name
      });
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Edit Category</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter category name"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// View Category Modal Component
const ViewCategoryModal = ({ show, onClose, category }) => {
  if (!show || !category) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Category Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Category Name</h4>
            <p className="mt-1 text-sm text-gray-900">{category.name}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Category ID</h4>
            <p className="mt-1 text-sm text-gray-900">#{category.id}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Products Count</h4>
            <p className="mt-1 text-sm text-gray-900">{category.products_count || 0} products</p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
          sortBy,
          sortOrder
      };

      const response = await api.get('/api/categories', { params });
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      setCategories(response.data.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination?.total || 0,
        totalPages: response.data.pagination?.totalPages || 0
      }));
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.response?.data?.error || err.message || 'Failed to fetch categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [pagination.page, pagination.limit, debouncedSearch, sortBy, sortOrder]);

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
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleAddCategory = async (name) => {
    try {
      setError(null);
      const response = await api.post('/api/categories', { name });
      
      if (response.data && response.data.id) {
        setShowAddModal(false);
        fetchCategories();
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error creating category:', err);
      setError(err.response?.data?.error || err.message || 'Failed to create category');
    }
  };

  const handleEditCategory = async (id, name) => {
    try {
      setError(null);
      const response = await api.put(`/api/categories/${id}`, { name });
      
      if (response.data && response.data.id) {
        setSelectedCategory(null);
        fetchCategories();
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error updating category:', err);
      setError(err.response?.data?.error || err.message || 'Failed to update category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      setError(null);
      await api.delete(`/api/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err.response?.data?.error || err.message || 'Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          
          <div className="flex flex-col sm:flex-row gap-4">
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
                className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Search categories..."
          />
        </div>

            {/* Add Category Button */}
          <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
              <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              Add Category
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
              <th
                onClick={() => handleSort('name')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  <span className="text-gray-400">
                    {sortBy === 'name' ? (
                      sortOrder === 'asc' ? '↑' : '↓'
                    ) : (
                      <span className="opacity-0 group-hover:opacity-50">↕</span>
                    )}
                  </span>
                </div>
              </th>
              <th
                onClick={() => handleSort('products_count')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
              >
                <div className="flex items-center space-x-1">
                  <span>Products Count</span>
                  <span className="text-gray-400">
                    {sortBy === 'products_count' ? (
                      sortOrder === 'asc' ? '↑' : '↓'
                    ) : (
                      <span className="opacity-0 group-hover:opacity-50">↕</span>
                    )}
                  </span>
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
          </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
          {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{category.name}</span>
                    <span className="text-xs text-gray-500">ID: {category.id}</span>
                  </div>
              </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {category.products?.length || 0}
              </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowViewModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    View
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowEditModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                  {search ? 'No results found' : 'No categories found'}
                </td>
            </tr>
            )}
          </tbody>
        </table>
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

      {/* Add Category Modal */}
      {showAddModal && (
        <AddCategoryModal
          show={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddCategory}
        />
      )}

      {/* Edit Category Modal */}
      {showEditModal && (
        <EditCategoryModal
          show={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedCategory(null);
          }}
          onSubmit={handleEditCategory}
          category={selectedCategory}
        />
      )}

      {/* View Category Modal */}
      {showViewModal && (
        <ViewCategoryModal
          show={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedCategory(null);
          }}
          category={selectedCategory}
        />
      )}
    </div>
  );
} 