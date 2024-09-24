import React from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import UserTable from '../../components/layout/UserTable';

function Users() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <Header title="Users" />
        <div className="flex justify-between items-center mt-5 bg-white p-4 rounded-lg shadow-md">
          <input
            type="text"
            placeholder="Search users..."
            className="p-2 border border-gray-300 rounded-md w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out"
          >
            Add User
          </button>
        </div>
        <div className="mt-5 bg-white rounded-lg shadow-lg p-6">
          <UserTable />
        </div>
      </div>
    </div>
  );
}

export default Users;
