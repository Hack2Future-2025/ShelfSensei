import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-4 min-h-[calc(100vh-6rem)]">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Shared components that can be used across pages
export const PageHeader = ({ title, description }) => (
  <div className="mb-4">
    <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
    {description && (
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    )}
  </div>
);

export const SearchBox = ({ value, onChange, placeholder }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
);

export const FilterBar = ({ children }) => (
  <div className="bg-white p-3 rounded-lg shadow-sm mb-4 flex flex-wrap gap-3 items-center">
    {children}
  </div>
);

export const Table = ({ children }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        {children}
      </table>
    </div>
  </div>
);

export const TableHead = ({ children }) => (
  <thead className="bg-gray-50">
    <tr>{children}</tr>
  </thead>
);

export const TableBody = ({ children }) => (
  <tbody className="bg-white divide-y divide-gray-200">
    {children}
  </tbody>
);

export const SortableHeader = ({ title, sortKey, currentSort, currentOrder, onSort }) => (
  <th
    onClick={() => onSort(sortKey)}
    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
  >
    <div className="flex items-center space-x-1">
      <span>{title}</span>
      {currentSort === sortKey && (
        <span className="text-gray-400">
          {currentOrder === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </div>
  </th>
);

export const Pagination = ({ page, totalPages, total, limit, onPageChange, onLimitChange }) => (
  <div className="bg-white px-3 py-2 rounded-lg shadow-sm mt-4 flex items-center justify-between">
    <div className="flex-1 text-sm text-gray-500">
      Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} results
    </div>
    <div className="flex items-center space-x-2">
      <select
        value={limit}
        onChange={onLimitChange}
        className="text-sm border-gray-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="5">5 / page</option>
        <option value="10">10 / page</option>
        <option value="20">20 / page</option>
        <option value="50">50 / page</option>
      </select>
      <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          First
        </button>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="relative inline-flex items-center px-2 py-1 border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          Previous
        </button>
        <span className="relative inline-flex items-center px-3 py-1 border border-gray-200 bg-white text-sm font-medium text-gray-700">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="relative inline-flex items-center px-2 py-1 border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          Next
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          className="relative inline-flex items-center px-2 py-1 rounded-r-md border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          Last
        </button>
      </nav>
    </div>
  </div>
); 