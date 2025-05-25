import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CubeIcon,
  TagIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Products', href: '/products', icon: CubeIcon },
  { name: 'Categories', href: '/categories', icon: TagIcon },
  { name: 'Vendors', href: '/vendors', icon: UserGroupIcon },
  { name: 'Inventory', href: '/inventory', icon: ClipboardDocumentListIcon },
  { name: 'Forecasting', href: '/forecasting', icon: ChartBarIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div 
      className={classNames(
        'hidden md:flex md:flex-col bg-gray-800 transition-all duration-300 ease-in-out',
        isCollapsed ? 'md:w-16' : 'md:w-64'
      )}
    >
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <div className="flex items-center justify-end px-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <ChevronLeftIcon className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
        <nav className="mt-5 flex-1 space-y-1 px-2">
          {navigation.map((item) => {
            const current = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  current
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon
                  className={classNames(
                    current ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
                    'flex-shrink-0 h-6 w-6',
                    isCollapsed ? '' : 'mr-3'
                  )}
                  aria-hidden="true"
                />
                {!isCollapsed && <span className="text-gray-300">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
} 