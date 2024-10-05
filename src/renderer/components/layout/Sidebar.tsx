import React, { useState } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faFileAlt,
  faChartBar,
  faUserCircle,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';

Modal.setAppElement('#root'); // Set the root element for accessibility

function Sidebar() {
  // const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const isActive = (path: string) => location.pathname === path;

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
              className={`rounded-md transition duration-150 ease-in-out ${isActive('/dashboard') ? 'bg-white text-gray-800' : 'hover:bg-gray-700'}`}
            >
              <a
                href="/dashboard"
                className="py-3 flex items-center space-x-3 px-3"
              >
                <FontAwesomeIcon
                  icon={faChartBar}
                  className={`h-5 w-5 ${isActive('/dashboard') ? 'text-gray-800' : 'text-gray-400'}`}
                />
                <span className="text-base">Dashboard</span>
              </a>
            </li>
            <li
              className={`rounded-md transition duration-150 ease-in-out ${isActive('/users') ? 'bg-white text-gray-800' : 'hover:bg-gray-700'}`}
            >
              <a
                href="/users"
                className="py-3 flex items-center space-x-3 px-3"
              >
                <FontAwesomeIcon
                  icon={faUsers}
                  className={`h-5 w-5 ${isActive('/users') ? 'text-gray-800' : 'text-gray-400'}`}
                />
                <span className="text-base">Users</span>
              </a>
            </li>
            <li
              className={`rounded-md transition duration-150 ease-in-out ${isActive('/tests') ? 'bg-white text-gray-800' : 'hover:bg-gray-700'}`}
            >
              <a
                href="/tests"
                className="py-3 flex items-center space-x-3 px-3"
              >
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className={`h-5 w-5 ${isActive('/tests') ? 'text-gray-800' : 'text-gray-400'}`}
                />
                <span className="text-base">Tests</span>
              </a>
            </li>
            <li
              className={`rounded-md transition duration-150 ease-in-out ${isActive('/reports') ? 'bg-white text-gray-800' : 'hover:bg-gray-700'}`}
            >
              <a
                href="/reports"
                className="py-3 flex items-center space-x-3 px-3"
              >
                <FontAwesomeIcon
                  icon={faChartBar}
                  className={`h-5 w-5 ${isActive('/reports') ? 'text-gray-800' : 'text-gray-400'}`}
                />
                <span className="text-base">Reports</span>
              </a>
            </li>
            <li
              className={`rounded-md transition duration-150 ease-in-out ${isActive('/profile') ? 'bg-white text-gray-800' : 'hover:bg-gray-700'}`}
            >
              <a
                href="/profile"
                className="py-3 flex items-center space-x-3 px-3"
              >
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
          className=" hover:bg-gray-800 bg-gray-700 text-white py-2 rounded-md transition duration-150 ease-in-out flex items-center space-x-3 px-3"
          onClick={() => setIsModalOpen(true)}
        >
          <FontAwesomeIcon
            icon={faQuestionCircle}
            className={`h-5 w-5 ${isActive('/profile') ? 'text-gray-800' : 'text-white'}`}
          />
          {/* <span>Help</span> */}
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
