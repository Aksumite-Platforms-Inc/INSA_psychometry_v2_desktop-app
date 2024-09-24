import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function UserTable() {
  return (
    <div className="mt-5 overflow-x-auto">
      <table className="w-full text-left border-collapse bg-white shadow-lg">
        <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
          <tr>
            <th className="py-3 px-6">Full Name</th>
            <th className="py-3 px-6">Email Address</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600">
          {/* Example row */}
          <tr className="border-t hover:bg-gray-100 transition duration-150">
            <td className="py-3 px-6">Admin Admin</td>
            <td className="py-3 px-6">Adminadmin@gmail.com</td>
            <td className="py-3 px-6 text-center flex justify-center space-x-4">
              <button
                type="button"
                className="text-blue-500 hover:text-blue-700"
                title="Edit User"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                type="button"
                className="text-red-500 hover:text-red-700"
                title="Delete User"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </td>
          </tr>

          {/* Repeat for more users */}
          <tr className="border-t hover:bg-gray-100 transition duration-150">
            <td className="py-3 px-6">John Doe</td>
            <td className="py-3 px-6">johndoe@example.com</td>
            <td className="py-3 px-6 text-center flex justify-center space-x-4">
              <button
                type="button"
                className="text-blue-500 hover:text-blue-700"
                title="Edit User"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                type="button"
                className="text-red-500 hover:text-red-700"
                title="Delete User"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
