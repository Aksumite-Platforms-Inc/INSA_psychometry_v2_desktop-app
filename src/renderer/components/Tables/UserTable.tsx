import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface User {
  id: number;
  name: string;
  email: string;
}

interface GetResponse {
  success: boolean;
  message?: string;
  data?: User[]; // Updated to match the backend response format
}

function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const orgId = 23;

  useEffect(() => {
    if (window.electron && window.electron.ipcRenderer) {
      // Send a request to fetch users as soon as the component loads
      window.electron.ipcRenderer.sendMessage('get-members', orgId);

      const unsubscribe = window.electron.ipcRenderer.on(
        'members-listed',
        (_event, response) => {
          const typedResponse = response as GetResponse;
          setLoading(false); // Stop loading when response is received

          if (typedResponse.success && typedResponse.data) {
            setUsers(typedResponse.data); // Populate users in state
          } else {
            setError(typedResponse.message || 'Failed to fetch users.');
          }
        },
      );

      // Cleanup listener on component unmount
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
    setError('Electron IPC is not available.');
    setLoading(false); // Stop loading if IPC is unavailable
  }, []);

  const handleDeleteUser = (userId: number) => {
    setError(null);
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.sendMessage('delete-member', userId);

      const unsubscribe = window.electron.ipcRenderer.on(
        'member-deleted',
        (_event, response) => {
          const typedResponse = response as GetResponse;

          if (typedResponse.success) {
            setUsers((prevUsers) =>
              prevUsers.filter((user) => user.id !== userId),
            ); // Remove deleted user from state
          } else {
            setError(typedResponse.message || 'Failed to delete user.');
          }
        },
      );

      // Cleanup listener after response
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
    setError('Electron IPC is not available.');
  };

  return (
    <div className="mt-5 overflow-x-auto">
      {loading ? (
        <div className="text-center py-5 text-gray-500">Loading users...</div>
      ) : (
        <table className="w-full text-left border-collapse bg-white shadow-lg">
          <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
            <tr>
              <th className="py-3 px-6">ID</th>
              <th className="py-3 px-6">Full Name</th>
              <th className="py-3 px-6">Email Address</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t hover:bg-gray-100 transition duration-150"
                >
                  <td className="py-3 px-6">{user.id}</td>
                  <td className="py-3 px-6">{user.name || 'N/A'}</td>
                  <td className="py-3 px-6">{user.email}</td>
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
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-3 px-6 text-gray-500">
                  {error || 'No users found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserTable;
