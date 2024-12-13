/* eslint-disable react/function-component-definition */
/* eslint-disable react/button-has-type */
import React, { useState } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faCodeBranch,
  faFileAlt,
  faTachometerAlt,
  faUserCircle,
  faFolderOpen,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useLocation, Link } from 'react-router-dom';
import { getUserName, getUserRole } from '../../utils/validationUtils';

Modal.setAppElement('#root'); // Set the root element for accessibility

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const userName = getUserName();
  const userRole = getUserRole();

  const isActive = (path: string) => location.pathname === path;

  const links = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: faTachometerAlt,
      roles: ['Organization Admin', 'Branch Admin'],
    },
    {
      path: '/BranchUsers',
      label: 'Members',
      icon: faUsers,
      roles: ['Branch Admin'],
    },
    {
      path: '/orgUsers',
      label: 'Users',
      icon: faUsers,
      roles: ['Organization Admin'],
    },
    {
      path: '/branches',
      label: 'Branches',
      icon: faCodeBranch,
      roles: ['Organization Admin'],
    },
    {
      path: '/tests',
      label: 'Tests',
      icon: faFileAlt,
      roles: ['Employee', 'Branch Admin', 'Organization Admin'],
    },
    {
      path: '/reports',
      label: 'Reports',
      icon: faFolderOpen,
      roles: ['Organization Admin'],
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: faUserCircle,
      roles: ['Organization Admin', 'Branch Admin', 'Employee'],
    },
  ];

  const steps = [
    'Step 1: Introduction',
    'Step 2: How to use the dashboard',
    'Step 3: Managing users',
    'Step 4: Creating tests',
    'Step 5: Viewing reports',
    'Step 6: Profile settings',
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div
      className={`flex flex-col bg-gradient-to-br from-blue-500 to-gray-800 text-white h-full transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-55'
      }`}
    >
      {/* Profile Section */}
      <div
        className={`px-4 pt-6 flex ${
          isCollapsed ? 'justify-center' : 'items-center space-x-4'
        }`}
      >
        <div className="rounded-full bg-white-700 flex justify-center items-center h-12 w-12">
          <FontAwesomeIcon
            icon={faUserCircle}
            className="text-white text-3xl"
          />
        </div>
        {!isCollapsed && (
          <div>
            <p className="text-white font-semibold">{userName}</p>
            <p className="text-sm text-gray-400">{userRole}</p>
          </div>
        )}
      </div>

      <br />
      <hr className="border-gray-600" />

      {/* Navigation Menu */}
      <nav className="flex-grow mt-6 px-4">
        <ul className="flex flex-col justify-center h-full space-y-2">
          {links
            .filter((link) => userRole && link.roles.includes(userRole))
            .map((link) => (
              <li
                key={link.path}
                className={`rounded-md transition duration-150 ease-in-out ${
                  isActive(link.path)
                    ? 'bg-white text-gray-800'
                    : 'hover:bg-gray-700'
                }`}
              >
                <Link
                  to={link.path}
                  className={`flex items-center px-3 py-3 ${
                    isCollapsed ? 'justify-center' : 'space-x-3'
                  }`}
                >
                  <FontAwesomeIcon
                    icon={link.icon}
                    className={`h-5 w-5 ${
                      isActive(link.path) ? 'text-white-800' : 'text-white-400'
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="text-base">{link.label}</span>
                  )}
                </Link>
              </li>
            ))}
        </ul>
      </nav>

      {/* Help Button */}
      <div className="px-4 mb-4">
        <button
          type="button"
          className="w-full flex items-center space-x-3 p-4 bg-gray-700 text-white rounded-md py-2 transition duration-150 ease-in-out flex items-center"
          onClick={() => setIsModalOpen(true)}
        >
          <FontAwesomeIcon icon={faQuestionCircle} />
          {!isCollapsed && <span>Help</span>}
        </button>
      </div>

      {/* Help Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Help Modal"
        className="w-320 fixed inset-0 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        shouldCloseOnOverlayClick
      >
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full">
          <h2 className="text-xl font-semibold mb-4">{steps[currentStep]}</h2>
          <div className="flex justify-between">
            <button
              type="button"
              className="bg-gray-700 text-white py-2 px-4 rounded-md"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </button>
            <button
              type="button"
              className="bg-gray-700 text-white py-2 px-4 rounded-md"
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
            >
              Next
            </button>
          </div>
          <button
            type="button"
            className="mt-4 bg-red-600 text-white py-2 px-4 rounded-md"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;
