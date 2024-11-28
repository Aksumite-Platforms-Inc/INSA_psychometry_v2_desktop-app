import React, { useState } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faCodeBranch,
  faFileAlt,
  faChartBar,
  faUserCircle,
  faQuestionCircle,
  // faC,
} from '@fortawesome/free-solid-svg-icons';
import { useLocation, Link } from 'react-router-dom';
import { getUserName, getUserRole } from '../../utils/validationUtils';

Modal.setAppElement('#root'); // Set the root element for accessibility

function Sidebar() {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const userName = getUserName();
  const userRole = getUserRole();

  const isActive = (path: string) => location.pathname === path;

  // Define the navigation links with role-based access
  const links = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: faChartBar,
      roles: ['Organization Admin', 'Branch Admin'],
    },
    {
      path: '/users',
      label: 'Users',
      icon: faUsers,
      roles: ['Branch Admin', 'Organization Admin'],
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
      icon: faChartBar,
      roles: ['Organization Admin', 'Branch Admin'],
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
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Profile Section */}
        <div className="text-center mb-5">
          <div className="rounded-full bg-gray-700 w-20 h-20 mx-auto flex justify-center items-center">
            <FontAwesomeIcon
              icon={faUserCircle}
              className="text-white text-3xl"
            />
          </div>
          <h1 className="mt-4 font-semibold text-lg">Welcome </h1>
          <p className="font-semibold text-lg">
            {userRole} | {userName}
          </p>
        </div>

        {/* Navigation Menu */}
        <nav>
          <ul className="flex flex-col justify-center items">
            <hr />
            <br />
            {links
              .filter((link) => userRole && link.roles.includes(userRole)) // Filter links based on role
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
                    className="py-3 flex items-center space-x-3 px-3"
                  >
                    <FontAwesomeIcon
                      icon={link.icon}
                      className={`h-5 w-5 ${
                        isActive(link.path) ? 'text-gray-800' : 'text-gray-400'
                      }`}
                    />
                    <span className="text-base">{link.label}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      </div>

      <div className="mt-10">
        <button
          type="button"
          className="hover:bg-gray-800 bg-gray-700 text-white py-2 rounded-md transition duration-150 ease-in-out flex items-center space-x-3 px-3"
          onClick={() => setIsModalOpen(true)}
        >
          <FontAwesomeIcon icon={faQuestionCircle} />
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
}

export default Sidebar;
