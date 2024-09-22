import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white h-full flex flex-col">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Sidebar</h1>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2 p-4">
          <li>
            <Link
              to="/dashboard"
              className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors"
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/tests"
              className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors"
            >
              Tests
            </Link>
          </li>
          <li>
            <Link
              to="/report"
              className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors"
            >
              Report
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
