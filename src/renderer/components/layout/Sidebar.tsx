import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faFileAlt,
  faChartBar,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="">
      {/* Profile Section */}
      <div>
        <div className="text-center mb-12">
          <div className="rounded-full bg-gray-700 w-20 h-20 mx-auto flex justify-center items-center">
            <FontAwesomeIcon
              icon={faUserCircle}
              className="text-white text-3xl"
            />
          </div>
          <p className="mt-4 font-semibold text-lg">Admin Admin</p>
        </div>

        {/* Navigation Menu */}
        <nav>
          <ul>
            <hr />
            <br />
            <li
              className={`py-3 rounded-md transition duration-150 ease-in-out ${isActive('/dashboard') ? 'bg-white text-gray-800' : 'hover:bg-gray-700'}`}
            >
              <a href="/dashboard" className="flex items-center space-x-3 px-3">
                <FontAwesomeIcon
                  icon={faChartBar}
                  className={`h-5 w-5 ${isActive('/dashboard') ? 'text-gray-800' : 'text-gray-400'}`}
                />
                <span className="text-base">Dashboard</span>
              </a>
            </li>
            <li
              className={`py-3 rounded-md transition duration-150 ease-in-out ${isActive('/users') ? 'bg-white text-gray-800' : 'hover:bg-gray-700'}`}
            >
              <a href="/users" className="flex items-center space-x-3 px-3">
                <FontAwesomeIcon
                  icon={faUsers}
                  className={`h-5 w-5 ${isActive('/users') ? 'text-gray-800' : 'text-gray-400'}`}
                />
                <span className="text-base">Users</span>
              </a>
            </li>
            <li
              className={`py-3 rounded-md transition duration-150 ease-in-out ${isActive('/tests') ? 'bg-white text-gray-800' : 'hover:bg-gray-700'}`}
            >
              <a href="/tests" className="flex items-center space-x-3 px-3">
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className={`h-5 w-5 ${isActive('/tests') ? 'text-gray-800' : 'text-gray-400'}`}
                />
                <span className="text-base">Tests</span>
              </a>
            </li>
            <li
              className={`py-3 rounded-md transition duration-150 ease-in-out ${isActive('/reports') ? 'bg-white text-gray-800' : 'hover:bg-gray-700'}`}
            >
              <a href="/reports" className="flex items-center space-x-3 px-3">
                <FontAwesomeIcon
                  icon={faChartBar}
                  className={`h-5 w-5 ${isActive('/reports') ? 'text-gray-800' : 'text-gray-400'}`}
                />
                <span className="text-base">Reports</span>
              </a>
            </li>
            <li
              className={`py-3 rounded-md transition duration-150 ease-in-out ${isActive('/profile') ? 'bg-white text-gray-800' : 'hover:bg-gray-700'}`}
            >
              <a href="/profile" className="flex items-center space-x-3 px-3">
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className={`h-5 w-5 ${isActive('/profile') ? 'text-gray-800' : 'text-gray-400'}`}
                />
                <span className="text-base">Profile</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Logout Button */}
      <div className="mt-10">
        <button
          type="button"
          className="bg-gray-700 hover:bg-red-400 text-white w-full py-2 rounded-md transition duration-150 ease-in-out"
          onClick={() => navigate('/login')}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
