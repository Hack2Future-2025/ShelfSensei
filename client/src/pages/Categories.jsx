import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  PageHeader, 
  SearchBox, 
  FilterBar, 
  Table, 
  TableHead, 
  TableBody, 
  SortableHeader,
  Pagination 
} from '../components/Layout';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('desc');
  const [newCategory, setNewCategory] = useState({ name: '' });

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories', {
        params: {
          page,
          limit,
          search,
          sortBy,
          sortOrder
        }
      });
      setCategories(response.data.data);
      setTotal(response.data.pagination.total);
      setTotalPages(response.data.pagination.totalPages);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, limit, search, sortBy, sortOrder]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/categories', newCategory);
      setNewCategory({ name: '' });
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-4">
      <PageHeader 
        title="Categories" 
        description="Manage your product categories" 
      />

      <FilterBar>
        <div className="flex-1">
          <SearchBox
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search categories..."
          />
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ name: e.target.value })}
            placeholder="New category name"
            className="rounded-md border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
          <button
            type="submit"
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add
          </button>
        </form>
      </FilterBar>

      <Table>
        <TableHead>
          <SortableHeader
            title="Name"
            sortKey="name"
            currentSort={sortBy}
            currentOrder={sortOrder}
            onSort={handleSort}
          />
          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Products
          </th>
        </TableHead>
        <TableBody>
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                {category.name}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                {category.products?.length || 0}
              </td>
            </tr>
          ))}
        </TableBody>
      </Table>

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
  );
} 