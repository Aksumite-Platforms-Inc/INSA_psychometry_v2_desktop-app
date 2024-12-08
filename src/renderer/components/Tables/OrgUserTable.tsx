/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { getToken, getOrgId, getUserId } from '../../utils/validationUtils';

interface User {
  id: number;
  name: string;
  email: string;
  activation_code: string;
  isActive: boolean; // Assuming this field indicates active status
}

interface GetResponse {
  success: boolean;
  message?: string;
  data?: User[];
}

function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const orgId = getOrgId();
  const token = getToken();
  const currentUserId = getUserId();

  useEffect(() => {
    if (!orgId || !token) {
      setError('Organization ID or token is missing.');
      setLoading(false);
      return;
    }

    const fetchUsers = () => {
      if (window.electron && window.electron.ipcRenderer) {
        // Send request to fetch users
        window.electron.ipcRenderer.sendMessage('get-members', {
          orgId,
          token,
        });

        const handleMembersListed = (_event: any, response: any) => {
          const typedResponse = response as GetResponse;
          setLoading(false);

          if (typedResponse.success && typedResponse.data) {
            setUsers(typedResponse.data);
          } else {
            setError(typedResponse.message || 'Failed to fetch users.');
          }
        };

        window.electron.ipcRenderer.on('members-listed', handleMembersListed);

        // Cleanup listener
        return () => {
          window.electron.ipcRenderer.removeListener(
            'members-listed',
            handleMembersListed,
          );
        };
      }
      setError('Electron IPC is not available.');
      setLoading(false);
    };

    fetchUsers();
  }, [orgId, token]);

  const handleDeleteUser = (userId: number) => {
    setError(null);

    if (!orgId || !token) {
      setError('Organization ID or token is missing.');
      return;
    }

    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.sendMessage('delete-member', {
        orgId,
        userId,
        token,
      });

      const handleMemberDeleted = (_event: any, response: any) => {
        const typedResponse = response as GetResponse;

        if (typedResponse.success) {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== userId),
          );
        } else {
          setError(typedResponse.message || 'Failed to delete user.');
        }
      };

      window.electron.ipcRenderer.on('member-deleted', handleMemberDeleted);

      // Cleanup listener
      // eslint-disable-next-line consistent-return
      return () => {
        window.electron.ipcRenderer.removeListener(
          'member-deleted',
          handleMemberDeleted,
        );
      };
    }
    setError('Electron IPC is not available.');
  };

  // const handleToggleUser = (userId: number) => {
  //   // Add logic to update the user's active state (API call or state update)
  //   setUsers((prevUsers) =>
  //     prevUsers.map((user) =>
  //       user.id === userId ? { ...user, isActive: !user.isActive } : user,
  //     ),
  //   );
  // };

  const activeUsers = users.filter(
    (user) => user.activation_code !== '' && user.id !== currentUserId,
  );
  const invitedUsers = users.filter(
    (user) => user.activation_code === '' && user.id !== currentUserId,
  );

  return (
    <div className="mt-5 overflow-x-auto">
      {loading ? (
        <div className="text-center py-5 text-gray-500">Loading users...</div>
      ) : (
        <>
          <h3 className="text-lg font-bold mb-3">Active Users:</h3>
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
              {activeUsers.length > 0 ? (
                activeUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t hover:bg-gray-100 transition duration-150"
                  >
                    <td className="py-3 px-6">{user.id}</td>
                    <td className="py-3 px-6">{user.name || 'N/A'}</td>
                    <td className="py-3 px-6">{user.email}</td>
                    <td className="py-3 px-6 text-center flex justify-center space-x-4">
                      {/* <label
                        className="relative inline-flex items-center cursor-pointer"
                        aria-label={`Toggle user ${user.name}`}
                        htmlFor={`toggle-user-${user.id}`}
                      >
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          id={`toggle-user-${user.id}`}
                          checked={user.isActive} // Replace `user.isActive` with the correct field for active status
                          onChange={() => handleToggleUser(user.id)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600" />
                      </label> */}
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
                  <td
                    colSpan={4}
                    className="text-center py-3 px-6 text-gray-500"
                  >
                    {error || 'No users found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {invitedUsers.length > 0 && (
            <div className="mt-5">
              <h3 className="text-lg font-bold mb-3">Invited Users:</h3>
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
                  <tr>
                    <th className="py-3 px-4">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {invitedUsers.map((user) => (
                    <tr key={user.email} className="border-t">
                      <td className="py-2 px-4">{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UserTable;
