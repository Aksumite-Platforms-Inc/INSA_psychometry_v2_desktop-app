import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserName, getUserRole } from '../../utils/validationUtils';

interface HeaderProps {
  toggleSidebar: () => void;
}

function Header({ toggleSidebar }: HeaderProps) {
  const [panel, setPanel] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const userName = getUserName();
  const userRole = getUserRole();

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setPanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center h-20 px-6 sm:px-10 bg-white relative">
      {/* Sidebar Toggle */}
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

      {/* User Profile Section */}
      <div className="flex flex-shrink-0 items-center ml-auto relative">
        <button
          type="button"
          className="relative inline-flex items-center p-2 hover:bg-gray-100 focus:bg-gray-100 rounded-lg"
          onClick={() => setPanel((prev) => !prev)}
          aria-expanded={panel}
          aria-controls="user-menu"
        >
          <span className="sr-only">User Menu</span>
          <div className="hidden md:flex md:flex-col md:items-end md:leading-tight">
            <span className="font-semibold">{userName}</span>
            <span className="text-sm text-gray-600">{userRole}</span>
          </div>
          {/* <span className="h-12 w-12 ml-2 sm:ml-3 mr-2 bg-gray-100 rounded-full overflow-hidden">
            <img
              src={profilePicture}
              alt="profile_picture"
              className="h-full w-full object-cover"
            />
          </span> */}
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="hidden sm:block h-6 w-6 text-gray-400"
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
          <div
            id="user-menu"
            className="absolute top-full mt-2 right-0 bg-white border rounded-md shadow-lg w-48 z-50"
            ref={dropdownRef}
          >
            <div
              className="p-2 hover:bg-gray-100 cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={() => {
                setPanel(false);
                navigate('/profile');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setPanel(false);
                  navigate('/profile');
                }
              }}
            >
              Profile
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className="border-l pl-3 ml-3 space-x-1">
          <button
            type="button"
            className="relative p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:bg-gray-100 focus:text-gray-600 rounded-full"
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
