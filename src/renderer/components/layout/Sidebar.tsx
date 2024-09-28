import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faFileAlt,
  faChartBar,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
// import Header from './Header';

function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="w-64 p-5 flex flex-col bg-gray-800 text-white h-screen overflow-hidden justify-between">
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
            <li className="py-3 hover:bg-gray-700 rounded-md transition duration-150 ease-in-out">
              <a href="/dashboard" className="flex items-center space-x-3 px-3">
                <FontAwesomeIcon
                  icon={faChartBar}
                  className="h-5 w-5 text-gray-400"
                />
                <span className="text-base ">Dashboard</span>
              </a>
            </li>
            <li className="py-3 hover:bg-gray-700 rounded-md transition duration-150 ease-in-out">
              <a href="/users" className="flex items-center space-x-3 px-3 ">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="h-5 w-5 text-gray-400"
                />
                <span className="text-base">Users</span>
              </a>
            </li>
            <li className="py-3 hover:bg-gray-700 rounded-md transition duration-150 ease-in-out">
              <a href="/tests" className="flex items-center space-x-3 px-3">
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className="h-5 w-5 text-gray-400"
                />
                <span className="text-base">Tests</span>
              </a>
            </li>
            <li className="py-3 hover:bg-gray-700 rounded-md transition duration-150 ease-in-out">
              <a href="/reports" className="flex items-center space-x-3 px-3">
                <FontAwesomeIcon
                  icon={faChartBar}
                  className="h-5 w-5 text-gray-400"
                />
                <span className="text-base">Reports</span>
              </a>
            </li>
            <li className="py-3 hover:bg-gray-700 rounded-md transition duration-150 ease-in-out">
              <a href="/profile" className="flex items-center space-x-3 px-3">
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className="h-5 w-5 text-gray-400"
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
          className="bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded-md transition duration-150 ease-in-out"
          onClick={() => navigate('/login')}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
