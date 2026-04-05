import { useEffect, useState } from 'react';
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
  const prefersReducedMotion = useUIStore((state) => state.prefersReducedMotion);
  const [roleAnimating, setRoleAnimating] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Trigger animation when role changes
  useEffect(() => {
    if (!prefersReducedMotion) {
      setRoleAnimating(true);
      const timer = setTimeout(() => setRoleAnimating(false), 200);
      return () => clearTimeout(timer);
    }
  }, [role, prefersReducedMotion]);

  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-navy-800">
      <div className="flex items-center justify-between px-6 h-full">
        {/* Left: Logo + Page Title */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">Z</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{pageTitle}</h1>
        </div>

        {/* Right: Role Switcher + Dark Mode + User */}
        <div className="flex items-center gap-4">
          {/* Role Switcher */}
          <button
            onClick={toggleRole}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors min-h-[44px]"
            title="Switch role"
            aria-label={`Current role: ${role}. Click to switch role`}
          >
            {role === 'ADMIN' ? (
              <span className={`px-2 py-1 text-xs font-semibold bg-teal-500 text-white rounded ${roleAnimating ? 'animate-pulse-scale' : ''}`}>
                ADMIN
              </span>
            ) : (
              <span className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${roleAnimating ? 'animate-pulse-scale' : ''}`}>{role}</span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
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
          <button
            className="w-10 h-10 min-w-[44px] min-h-[44px] bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center cursor-pointer"
            title="Profile"
            aria-label="User profile"
          >
            <User size={16} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </header>
  );
}
