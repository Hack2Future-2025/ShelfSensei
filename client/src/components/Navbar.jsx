import { Fragment } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Categories', href: '/categories' },
  { name: 'Vendors', href: '/vendors' },
  { name: 'Inventory', href: '/inventory' },
  { name: 'Forecasting', href: '/forecasting' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <Disclosure as="nav" className="bg-gray-800 z-50">
      {({ open }) => (
        <>
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link to="/" className="text-white text-xl font-bold">
                    Inventory Manager
                  </Link>
                </div>
                
                {/* Desktop navigation */}
                <div className="hidden md:ml-6 md:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => {
                      const current = location.pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`${
                            current
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          } px-3 py-2 rounded-md text-sm font-medium`}
                          aria-current={current ? 'page' : undefined}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* User menu */}
              <div className="hidden md:block">
                <div className="flex items-center space-x-4">
                  {user && (
                    <>
                      <div className="text-sm text-gray-300">
                        <span>User ID:</span>
                        <span className="ml-1 font-medium text-white">{user.id}</span>
                      </div>
                      
                      {user.shops && (
                        <div className="text-sm text-gray-300">
                          <span>Shops:</span>
                          <span className="ml-1 font-medium text-white">
                            {user.shops.length}
                          </span>
                        </div>
                      )}

                      <button
                        onClick={logout}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-colors duration-150"
                      >
                        Sign Out
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="-mr-2 flex md:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile menu panel */}
          <Disclosure.Panel className="md:hidden fixed w-full bg-gray-800 shadow-lg">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => {
                const current = location.pathname === item.href;
                return (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={`${
                      current
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    } block px-3 py-2 rounded-md text-base font-medium`}
                    aria-current={current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                );
              })}
            </div>
            
            {/* Mobile user menu */}
            {user && (
              <div className="border-t border-gray-700 pb-3 pt-4">
                <div className="space-y-1 px-2">
                  <div className="text-sm text-gray-300 px-3 py-2">
                    <span>User ID:</span>
                    <span className="ml-1 font-medium text-white">{user.id}</span>
                  </div>
                  
                  {user.shops && (
                    <div className="text-sm text-gray-300 px-3 py-2">
                      <span>Shops:</span>
                      <span className="ml-1 font-medium text-white">
                        {user.shops.length}
                      </span>
                    </div>
                  )}

                  <div className="px-3">
                    <button
                      onClick={logout}
                      className="w-full inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-colors duration-150"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
} 