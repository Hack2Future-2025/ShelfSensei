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
  ChartPieIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Products', href: '/products', icon: CubeIcon },
  { name: 'Categories', href: '/categories', icon: TagIcon },
  { name: 'Vendors', href: '/vendors', icon: UserGroupIcon },
  { name: 'Inventory', href: '/inventory', icon: ClipboardDocumentListIcon },
  { name: 'Forecasting', href: '/forecasting', icon: ChartBarIcon },
  { name: 'Observations', href: '/observations', icon: ChartPieIcon },
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
        'hidden md:block bg-primary-800 h-full transition-all duration-300 ease-in-out border-r border-primary-700/50',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-end px-4 py-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-md text-primary-200 hover:bg-primary-700/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-400 transition-all duration-200"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
        <nav className="flex-1 px-2 pb-4 overflow-y-auto space-y-1">
          {navigation.map((item) => {
            const current = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  current
                    ? 'bg-primary-900/60 text-white shadow-sm'
                    : 'text-primary-100 hover:bg-primary-700/50 hover:text-white',
                  'group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200',
                  !isCollapsed && 'backdrop-blur-sm'
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon
                  className={classNames(
                    current ? 'text-primary-200' : 'text-primary-300 group-hover:text-primary-100',
                    'flex-shrink-0 h-5 w-5 transition-colors duration-200',
                    isCollapsed ? '' : 'mr-3'
                  )}
                  aria-hidden="true"
                />
                {!isCollapsed && (
                  <span className={classNames(
                    current ? 'text-white' : 'text-primary-100',
                    'transition-colors duration-200'
                  )}>
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
} 