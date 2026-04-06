import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, TrendingUp } from 'lucide-react';

export function BottomTabBar() {
  const location = useLocation();

  const tabs = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/transactions', icon: Receipt, label: 'Transactions' },
    { path: '/insights', icon: TrendingUp, label: 'Insights' },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40"
      aria-label="Mobile navigation"
    >
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center gap-1 py-3 px-4 min-w-[44px] min-h-[44px] transition-colors ${
                isActive ? 'text-teal-800 dark:text-teal-400' : 'text-gray-600 dark:text-gray-400'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={24} />
              <span className="text-xs">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
