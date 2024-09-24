/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCircle,
  faEnvelope,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';

function Profile() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <Header title="Profile" />
        <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
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
              <label htmlFor="fullName" className="text-gray-600 font-semibold">
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
                  className="w-full outline-none text-gray-800"
                  defaultValue="adminadmin@gmail.com"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="text-gray-600 font-semibold">
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
                  className="w-full outline-none text-gray-800"
                  defaultValue="*********"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-150"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
