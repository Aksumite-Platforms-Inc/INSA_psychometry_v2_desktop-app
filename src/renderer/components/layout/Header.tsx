import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profielPicture from '../../assets/Images/habesha.jpg';
import { getUserName, getUserRole } from '../../utils/validationUtils';

interface HeaderProps {
  toggleSidebar: () => void;
}

function Header({ toggleSidebar }: HeaderProps) {
  const [panel, setPanel] = useState(false);

  const userName = getUserName();
  const userRole = getUserRole();
  const navigate = useNavigate();
  return (
    <header className="flex items-center h-20 px-6 sm:px-10 bg-white">
      <div
        className="mr-8 cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label="Toggle menu"
        onClick={toggleSidebar}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggleSidebar();
          }
        }}
      >
        <svg
          className="w-8 h-8"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </div>

      <div className="flex flex-shrink-0 items-center ml-auto">
        <button
          type="button"
          className="relative inline-flex items-center p-2 hover:bg-gray-100 focus:bg-gray-100 rounded-lg"
          onClick={() => setPanel(!panel)}
          onBlur={() => setPanel(false)} // Close when clicking outside
        >
          <span className="sr-only">User Menu</span>
          <div className="hidden md:flex md:flex-col md:items-end md:leading-tight">
            <span className="font-semibold">{userName}</span>
            <span className="text-sm text-gray-600">{userRole}</span>
          </div>
          <span className="h-12 w-12 ml-2 sm:ml-3 mr-2 bg-gray-100 rounded-full overflow-hidden">
            <img
              src={profielPicture}
              alt="profile_picture"
              className="h-full w-full object-cover"
            />
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="hidden sm:block h-6 w-6 text-gray-300"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Dropdown Panel */}
        {panel && (
          <div className="absolute top-20 bg-white border rounded-md p-2 w-56">
            <div
              className="p-2 hover:bg-blue-100 cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={() => navigate('/profile')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate('/profile');
                }
              }}
            >
              Profile
            </div>

            <div
              className="p-2 hover:bg-blue-100 cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={() => {
                localStorage.removeItem('authToken');

                navigate('/login');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate('/login');
                }
              }}
            >
              Logout
            </div>
          </div>
        )}

        {/* Notifications & Logout */}
        <div className="border-l pl-3 ml-3 space-x-1">
          {/* <button
            type="button"
            className="relative p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:bg-gray-100 focus:text-gray-600 rounded-full"
          >
            <span className="sr-only">Notifications</span>
            <span className="absolute top-0 right-0 h-2 w-2 mt-1 mr-2 bg-red-500 rounded-full" />
            <span className="absolute top-0 right-0 h-2 w-2 mt-1 mr-2 bg-red-500 rounded-full animate-ping" />
            <svg
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button> */}

          <button
            type="button"
            className="relative p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:bg-gray-100 focus:text-gray-600 rounded-full"
            // onclick delete locally stored token
            onClick={() => {
              localStorage.removeItem('authToken');
              navigate('/login');
            }}
          >
            <span className="sr-only">Log out</span>
            <svg
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
