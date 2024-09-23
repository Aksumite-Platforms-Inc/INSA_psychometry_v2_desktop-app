import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  ClipboardIcon,
  UserIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const Sidebar: React.FC = function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <aside
      className={`bg-gray-800 text-white ${
        isExpanded ? 'w-64' : 'w-20'
      } transition-all duration-300 h-screen shadow-lg`}
    >
      <div
        className={`flex justify-between items-center p-4 border-b border-gray-700  ${
          isExpanded ? '' : 'justify-center'
        }`}
      >
        <h2 className="text-xl font-semibold">
          {isExpanded ? (
            'Admin Panel'
          ) : (
            <img
              src="../../assets/images/logo-light.png"
              alt="INSA Logo"
              className="w-8 h-8"
            />
          )}
        </h2>
        <button
          type="button"
          onClick={toggleExpand}
          className="text-gray-400 hover:text-white"
        >
          {isExpanded ? (
            <ChevronLeftIcon className="w-6 h-6" />
          ) : (
            <ChevronRightIcon className="w-6 h-6" />
          )}
        </button>
      </div>
      <nav className="mt-4">
        <ul className="space-y-4">
          <li>
            <Link
              to="/dashboard"
              className={`flex items-center text-gray-300 hover:bg-gray-700 hover:text-white p-2 rounded ${
                isExpanded ? '' : 'justify-center'
              }`}
            >
              <HomeIcon className="w-6 h-6" />
              {isExpanded && <span className="ml-4">Dashboard</span>}
            </Link>
          </li>
          <li>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(!openDropdown)}
                className={`flex items-center text-gray-300 hover:bg-gray-700 hover:text-white p-2 rounded w-full ${
                  isExpanded ? '' : 'justify-center'
                }`}
              >
                <ClipboardIcon className="w-6 h-6" />
                {isExpanded && <span className="ml-4">Tests</span>}
              </button>
              {openDropdown && (
                <ul
                  className={`mt-2 ${isExpanded ? 'block' : 'hidden'} space-y-2 pl-8`}
                >
                  <li>
                    <Link
                      to="/tests"
                      className="text-gray-400 hover:text-white"
                    >
                      Personality Test
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/testTabs"
                      className="text-gray-400 hover:text-white"
                    >
                      Aptitude Test
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </li>
          <li>
            <Link
              to="/users"
              className={`flex items-center text-gray-300 hover:bg-gray-700 hover:text-white p-2 rounded ${
                isExpanded ? '' : 'justify-center'
              }`}
            >
              <UserIcon className="w-6 h-6" />
              {isExpanded && <span className="ml-4">Users</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/reports"
              className={`flex items-center text-gray-300 hover:bg-gray-700 hover:text-white p-2 rounded ${
                isExpanded ? '' : 'justify-center'
              }`}
            >
              <ChartBarIcon className="w-6 h-6" />
              {isExpanded && <span className="ml-4">Reports</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
