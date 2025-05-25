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
  { name: 'Categories', href: '/categories', icon: TagIcon },
  { name: 'Products', href: '/products', icon: CubeIcon },
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
        'hidden md:block bg-secondary-900/95 backdrop-blur-sm h-full transition-all duration-400 ease-bounce border-r border-secondary-800/50',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-end px-4 py-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-md text-secondary-200 hover:bg-secondary-800/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary-400 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-5 w-5 transform transition-transform duration-300" aria-hidden="true" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5 transform transition-transform duration-300" aria-hidden="true" />
            )}
          </button>
        </div>
        <nav className="flex-1 px-2 pb-4 overflow-y-auto space-y-1">
          {navigation.map((item, index) => {
            const current = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  current
                    ? 'bg-secondary-800 text-white shadow-lg'
                    : 'text-secondary-100 hover:bg-secondary-800/50 hover:text-white',
                  'group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-300',
                  !isCollapsed && 'backdrop-blur-sm',
                  'transform hover:translate-x-1 hover:shadow-md',
                  'animate-slide-in-left',
                  'style-delay-' + (index * 100)
                )}
                title={isCollapsed ? item.name : undefined}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <item.icon
                  className={classNames(
                    current ? 'text-white' : 'text-secondary-300 group-hover:text-white',
                    'flex-shrink-0 h-5 w-5 transition-all duration-300',
                    isCollapsed ? 'transform group-hover:scale-110' : 'mr-3 group-hover:rotate-6'
                  )}
                  aria-hidden="true"
                />
                {!isCollapsed && (
                  <span className={classNames(
                    current ? 'text-white' : 'text-secondary-100',
                    'transition-all duration-300 transform group-hover:translate-x-1'
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