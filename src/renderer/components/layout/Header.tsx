import React, { useState } from 'react';
import {
  SunIcon,
  MoonIcon,
  UserCircleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

const Header: React.FC = function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-gray-100 dark:bg-gray-800 p-4 shadow-md flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Current Page
        </h1>
        <span className="text-gray-600 dark:text-gray-400">/ Parent Path</span>
      </div>
      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={toggleDarkMode}
          className="text-gray-600 dark:text-gray-400"
        >
          {darkMode ? (
            <SunIcon className="w-6 h-6" />
          ) : (
            <MoonIcon className="w-6 h-6" />
          )}
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400"
          >
            <UserCircleIcon className="w-8 h-8" />
            <span>Username</span>
            <ChevronDownIcon className="w-5 h-5" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 shadow-lg rounded-lg py-2">
              <a
                href="/profile"
                className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Edit Profile
              </a>
              <a
                href="/logout"
                className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
