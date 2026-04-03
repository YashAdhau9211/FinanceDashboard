import { useEffect } from 'react';
import { Sun, Moon, User } from 'lucide-react';
import { useRoleStore } from '../stores/roleStore';
import { useUIStore } from '../stores/uiStore';

interface TopNavProps {
  pageTitle: string;
}

export function TopNav({ pageTitle }: TopNavProps) {
  const role = useRoleStore((state) => state.role);
  const toggleRole = useRoleStore((state) => state.toggleRole);
  const darkMode = useUIStore((state) => state.darkMode);
  const toggleDarkMode = useUIStore((state) => state.toggleDarkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-navy-800">
      <div className="flex items-center justify-between px-6 h-full">
        {/* Left: Logo + Page Title */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">Z</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {pageTitle}
          </h1>
        </div>

        {/* Right: Role Switcher + Dark Mode + User */}
        <div className="flex items-center gap-4">
          {/* Role Switcher */}
          <button
            onClick={toggleRole}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors"
            title="Switch role"
          >
            {role === 'ADMIN' ? (
              <span className="px-2 py-1 text-xs font-semibold bg-teal-500 text-white rounded">
                ADMIN
              </span>
            ) : (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {role}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors"
            aria-label="Toggle dark mode"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <Sun size={20} className="text-gray-700 dark:text-gray-300" />
            ) : (
              <Moon size={20} className="text-gray-700 dark:text-gray-300" />
            )}
          </button>

          {/* User Avatar */}
          <div 
            className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center cursor-pointer"
            title="Profile"
          >
            <User size={16} className="text-gray-600 dark:text-gray-300" />
          </div>
        </div>
      </div>
    </header>
  );
}
