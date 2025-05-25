import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  PageHeader, 
  SearchBox, 
  FilterBar, 
  Pagination 
} from '../components/Layout';
import { PlusIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';

// Separate AddProductModal component
const AddProductModal = ({ show, onClose, onSubmit, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({ name: '', categoryId: '', price: '' });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Add New Product</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter product name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="pl-7 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
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
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Product Modal Component
const EditProductModal = ({ show, onClose, onSubmit, product, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        categoryId: product.cat_id || '',
        price: product.price
      });
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Edit Product</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter product name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="pl-7 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
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

// View Product Modal Component
const ViewProductModal = ({ show, onClose, product }) => {
  if (!show || !product) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Product Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Product Name</h4>
            <p className="mt-1 text-sm text-gray-900">{product.name}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Category</h4>
            <p className="mt-1 text-sm text-gray-900">{product.category?.name || 'Uncategorized'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Price</h4>
            <p className="mt-1 text-sm text-gray-900">${Number(product.price).toFixed(2)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Product ID</h4>
            <p className="mt-1 text-sm text-gray-900">#{product.id}</p>
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

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('desc');
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const fetchProducts = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/products', {
          params: {
            page,
            limit,
            search,
            sortBy,
            sortOrder,
            category: selectedCategory
          }
        }),
        axios.get('http://localhost:5000/api/categories')
      ]);

      setProducts(productsRes.data.data);
      setTotal(productsRes.data.pagination.total);
      setTotalPages(productsRes.data.pagination.totalPages);
      setCategories(categoriesRes.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, limit, search, sortBy, sortOrder, selectedCategory]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleAddProduct = async (formData) => {
    try {
      await axios.post('http://localhost:5000/api/products', {
        name: formData.name,
        cat_id: formData.categoryId ? parseInt(formData.categoryId) : null,
        price: formData.price ? parseFloat(formData.price) : 0
      });
      setShowAddModal(false);
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditProduct = async (formData) => {
    try {
      await axios.put(`http://localhost:5000/api/products/${selectedProduct.id}`, {
        name: formData.name,
        cat_id: formData.categoryId ? parseInt(formData.categoryId) : null,
        price: formData.price ? parseFloat(formData.price) : 0
      });
      setShowEditModal(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const ProductGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium text-gray-900 truncate">{product.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {product.category?.name || 'Uncategorized'}
              </span>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-2xl font-bold text-gray-900">${Number(product.price).toFixed(2)}</span>
              <span className="text-xs text-gray-500">ID: #{product.id}</span>
            </div>
            <div className="mt-4 flex space-x-2">
              <button 
                onClick={() => handleEdit(product)}
                className="flex-1 px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700 border border-indigo-600 rounded-md hover:bg-indigo-50"
              >
                Edit
              </button>
              <button 
                onClick={() => handleView(product)}
                className="flex-1 px-3 py-1 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ProductList = () => (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th onClick={() => handleSort('name')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
              Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('category')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
              Category {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('price')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
              Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">ID: #{product.id}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {product.category?.name || 'Uncategorized'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${Number(product.price).toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  onClick={() => handleEdit(product)} 
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleView(product)}
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
  );

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">Error: {error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Products" 
        description="Manage your product catalog" 
      />

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex-1 max-w-lg">
            <SearchBox
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search products..."
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="flex items-center space-x-2 border rounded-md p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <Squares2X2Icon className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <ListBulletIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {viewMode === 'grid' ? <ProductGrid /> : <ProductList />}
      </div>

      <div className="mt-6">
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(e) => {
            setLimit(parseInt(e.target.value));
            setPage(1);
          }}
        />
      </div>

      <AddProductModal 
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddProduct}
        categories={categories}
      />

      <EditProductModal 
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleEditProduct}
        product={selectedProduct}
        categories={categories}
      />

      <ViewProductModal 
        show={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />
    </div>
  );
} 