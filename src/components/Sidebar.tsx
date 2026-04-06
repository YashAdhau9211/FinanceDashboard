import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, TrendingUp } from 'lucide-react';

export function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/transactions', label: 'Transactions', icon: Receipt },
    { path: '/insights', label: 'Insights', icon: TrendingUp },
  ];

  return (
    <aside className="hidden lg:block w-16 md:w-16 lg:w-64 bg-navy-900 dark:bg-gray-900 fixed h-full">
      <div className="p-6">
        {/* Logo + Brand */}
        <Link
          to="/dashboard"
          className="flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity"
          aria-label="Go to Dashboard"
        >
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">Z</span>
          </div>
          <span className="hidden lg:block text-xl font-bold text-white">Zorvyn</span>
        </Link>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-teal-500/10 text-teal-400'
                    : 'text-gray-400 hover:bg-navy-800 hover:text-white'
                }`}
                aria-label={item.label}
              >
                <Icon size={20} />
                <span className="hidden lg:block text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
