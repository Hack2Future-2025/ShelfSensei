import { Fragment } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <Disclosure as="nav" className="bg-primary-900 shadow-lg border-b border-primary-800">
      {({ open }) => (
        <>
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link to="/" className="text-white text-xl font-bold tracking-tight hover:text-primary-200 transition-colors duration-200">
                    ShelfSensei
                  </Link>
                </div>
              </div>

              {/* User Menu */}
              <div className="hidden md:block">
                <div className="flex items-center space-x-4">
                  {user && (
                    <>
                      <div className="text-sm text-primary-200">
                        <span>User ID:</span>
                        <span className="ml-1.5 font-medium text-white">{user.id}</span>
                      </div>
                      
                      {user.shops && (
                        <div className="text-sm text-primary-200">
                          <span>Shops:</span>
                          <span className="ml-1.5 font-medium text-white">
                            {user.shops.length}
                          </span>
                        </div>
                      )}

                      <button
                        onClick={logout}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-900 focus:ring-accent-500 transition-all duration-200 shadow-sm hover:shadow"
                      >
                        Sign Out
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-primary-200 hover:bg-primary-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200">
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
          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 bg-primary-800 shadow-lg">
              {user && (
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <div className="text-sm text-primary-200 px-3 py-2">
                    <span>User ID:</span>
                    <span className="ml-1.5 font-medium text-white">{user.id}</span>
                  </div>
                  
                  {user.shops && (
                    <div className="text-sm text-primary-200 px-3 py-2">
                      <span>Shops:</span>
                      <span className="ml-1.5 font-medium text-white">
                        {user.shops.length}
                      </span>
                    </div>
                  )}

                  <div className="mt-3 px-3">
                    <button
                      onClick={logout}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-900 focus:ring-accent-500 transition-all duration-200 shadow-sm hover:shadow"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
} 