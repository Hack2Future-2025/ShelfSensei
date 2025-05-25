import { Fragment } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <Disclosure as="nav" className="bg-primary-700 shadow-soft z-40 flex-none">
      {({ open }) => (
        <>
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link to="/" className="text-white text-xl font-bold tracking-tight hover:text-primary-100 transition-colors duration-200">
                    ShelfSensei
                  </Link>
                </div>
              </div>

              {/* User menu */}
              <div className="hidden md:block">
                <div className="flex items-center space-x-4">
                  {user && (
                    <>
                      <div className="text-sm text-primary-100">
                        <span>User ID:</span>
                        <span className="ml-1.5 font-medium text-white">{user.id}</span>
                      </div>
                      
                      {user.shops && (
                        <div className="text-sm text-primary-100">
                          <span>Shops:</span>
                          <span className="ml-1.5 font-medium text-white">
                            {user.shops.length}
                          </span>
                        </div>
                      )}

                      <button
                        onClick={logout}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-700 focus:ring-accent-500 transition-all duration-200 shadow-sm hover:shadow"
                      >
                        Sign Out
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="-mr-2 flex md:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-primary-600 p-2 text-primary-100 hover:bg-primary-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700 transition-colors duration-200">
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
          <Disclosure.Panel className="md:hidden absolute top-16 left-0 right-0 bg-primary-700 shadow-lg animate-fade-in">
            <div className="px-3 pb-3 pt-4 border-t border-primary-600">
              <div className="space-y-2">
                {user && (
                  <>
                    <div className="text-sm text-primary-100 px-4 py-2">
                      <span>User ID:</span>
                      <span className="ml-1.5 font-medium text-white">{user.id}</span>
                    </div>
                    
                    {user.shops && (
                      <div className="text-sm text-primary-100 px-4 py-2">
                        <span>Shops:</span>
                        <span className="ml-1.5 font-medium text-white">
                          {user.shops.length}
                        </span>
                      </div>
                    )}

                    <div className="px-4 pt-2">
                      <button
                        onClick={logout}
                        className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-700 focus:ring-accent-500 transition-all duration-200 shadow-sm hover:shadow"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
} 