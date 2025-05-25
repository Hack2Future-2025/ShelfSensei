import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusIcon } from '@heroicons/react/24/outline';

// Separate AddVendorModal component
const AddVendorModal = ({ show, onClose, onSubmit }) => {
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
          <h3 className="text-lg font-medium">Add New Vendor</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter vendor name"
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
              Add Vendor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Vendor Modal Component
const EditVendorModal = ({ show, onClose, onSubmit, vendor }) => {
  const [formData, setFormData] = useState({
    name: ''
  });

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name
      });
    }
  }, [vendor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Edit Vendor</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter vendor name"
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

// View Vendor Modal Component
const ViewVendorModal = ({ show, onClose, vendor }) => {
  if (!show || !vendor) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Vendor Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Vendor Name</h4>
            <p className="mt-1 text-sm text-gray-900">{vendor.name}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Vendor ID</h4>
            <p className="mt-1 text-sm text-gray-900">#{vendor.id}</p>
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

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/vendors', {
        params: {
          page,
          limit,
          search,
          sortBy,
          sortOrder
        }
      });

      const { data, pagination } = response.data;
      
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid data received from server');
      }

      setVendors(data);
      setTotal(pagination?.total || 0);
      setTotalPages(pagination?.totalPages || 0);
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError(err.message || 'Failed to fetch vendors');
      setVendors([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [page, limit, search, sortBy, sortOrder]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1);
  };

  const handleAddVendor = async (formData) => {
    try {
      setError(null);
      const response = await axios.post('http://localhost:5000/api/vendors', {
        name: formData.name
      });
      
      if (response.data && response.data.id) {
        setShowAddModal(false);
        fetchVendors();
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error creating vendor:', err);
      setError(err.response?.data?.error || err.message || 'Failed to create vendor');
    }
  };

  const handleEditVendor = async (formData) => {
    try {
      setError(null);
      const response = await axios.put(`http://localhost:5000/api/vendors/${selectedVendor.id}`, {
        name: formData.name
      });
      
      if (response.data && response.data.id) {
        setShowEditModal(false);
        setSelectedVendor(null);
        fetchVendors();
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error updating vendor:', err);
      setError(err.response?.data?.error || err.message || 'Failed to update vendor');
    }
  };

  const handleEdit = (vendor) => {
    setSelectedVendor(vendor);
    setShowEditModal(true);
  };

  const handleView = (vendor) => {
    setSelectedVendor(vendor);
    setShowViewModal(true);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Vendors</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your vendor relationships
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Vendor
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex-1 max-w-lg">
            <input
              type="text"
              placeholder="Search vendors..."
              value={search}
              onChange={handleSearch}
              className="block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <select
              value={limit}
              onChange={handleLimitChange}
              className="block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vendors List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                  <div className="text-sm text-gray-500">ID: #{vendor.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleEdit(vendor)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleView(vendor)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddVendorModal 
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddVendor}
      />

      <EditVendorModal 
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedVendor(null);
        }}
        onSubmit={handleEditVendor}
        vendor={selectedVendor}
      />

      <ViewVendorModal 
        show={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedVendor(null);
        }}
        vendor={selectedVendor}
      />
    </div>
  );
} 