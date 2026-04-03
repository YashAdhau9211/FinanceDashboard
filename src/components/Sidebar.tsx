import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, TrendingUp, Settings } from 'lucide-react';
import { useUIStore } from '../stores/uiStore';

export function Sidebar() {
  const location = useLocation();
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/transactions', label: 'Transactions', icon: Receipt },
    { path: '/insights', label: 'Insights', icon: TrendingUp },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-60 bg-navy-900 fixed h-full">
      <div className="p-6">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">Z</span>
          </div>
          {!sidebarCollapsed && (
            <span className="text-xl font-bold text-white">Zorvyn</span>
          )}
        </div>

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
              >
                <Icon size={20} />
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
