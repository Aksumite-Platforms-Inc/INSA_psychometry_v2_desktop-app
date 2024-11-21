/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCircle,
  faEnvelope,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '../../components/layout/defaultlayout';

interface UpdateResponse {
  success: boolean;
  message?: string;
}
function Profile() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.electron && window.electron.ipcRenderer) {
      const unsubscribe = window.electron.ipcRenderer.on(
        'profile-updated',
        (_event, response) => {
          const typedResponse = response as UpdateResponse;
          if (typedResponse.success) {
            console.log('Profile updated successfully:');
            // INFO: This is a temporary navigation
            // need to updated
            // if user is org admin navigate to the org dashboard
            // if user is a normal user navigate to the user test page
            navigate('/dashboard');
          } else {
            console.error('Profile update failed:', typedResponse.message);
            setError(typedResponse.message || 'An unexpected error occurred.');
          }
        },
      );

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
    return undefined;
  }, [navigate]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.sendMessage(
        'update-profile',
        fullName,
        email,
        password,
      );
    } else {
      setError('Electron IPC is not available');
    }
    // INFO: This is a temporary navigation
    // need to updated
    // if user is org admin navigate to the org dashboard
    // if user is a normal user navigate to the user test page
  };
  return (
    <DefaultLayout>
      <div className="flex h-screen">
        <div className="flex-1 p-6 bg-gray-50 h-screen">
          <div className=" bg-white p-10 rounded-lg shadow-lg ">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Profile Settings
            </h2>

            {/* Profile Picture Section */}
            <div className="flex items-center space-x-5 mb-10">
              <div className="rounded-full bg-gray-300 w-24 h-24 flex justify-center items-center">
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className="text-gray-600 h-16 w-16"
                />
              </div>
              <div>
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-150"
                >
                  Change Profile Picture
                </button>
              </div>
            </div>

            {/* User Info Form */}
            <form className="space-y-6">
              <div className="flex flex-col">
                <label
                  htmlFor="fullName"
                  className="text-gray-600 font-semibold"
                >
                  Full Name
                </label>
                <div className="flex items-center border border-gray-300 rounded-md p-2 mt-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  <FontAwesomeIcon
                    icon={faUserCircle}
                    className="text-gray-600 h-5 w-5 mr-3"
                  />
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full outline-none text-gray-800"
                    defaultValue="Admin Admin"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="text-gray-600 font-semibold">
                  Email Address
                </label>
                <div className="flex items-center border border-gray-300 rounded-md p-2 mt-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-gray-600 h-5 w-5 mr-3"
                  />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full outline-none text-gray-800"
                    defaultValue="adminadmin@gmail.com"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="password"
                  className="text-gray-600 font-semibold"
                >
                  Password
                </label>
                <div className="flex items-center border border-gray-300 rounded-md p-2 mt-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="text-gray-600 h-5 w-5 mr-3"
                  />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    hidden
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full outline-none text-gray-800"
                    defaultValue="*********"
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-150"
                  onClick={handleSubmit}
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default Profile;
