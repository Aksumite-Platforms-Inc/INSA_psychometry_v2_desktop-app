/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { getToken } from '../../utils/validationUtils';

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

interface BranchUserTableProps {
  branchId: number;
  orgId: number;
}

function BranchUserTable({ branchId, orgId }: BranchUserTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // const orgId = getOrgId();
  const token = getToken();

  useEffect(() => {
    if (!orgId || !token) {
      setError('Organization ID or token is missing.');
      setLoading(false);
      return;
    }

    console.log('hello zed', orgId, branchId, token);

    const fetchUsers = () => {
      if (window.electron && window.electron.ipcRenderer) {
        // Send request to fetch users
        window.electron.ipcRenderer.sendMessage('get-branch-members', {
          orgId,
          branchId,
          token,
        });

        const handleMembersListed = (_event: any, response: any) => {
          const typedResponse = response as GetResponse;
          setLoading(false);

          if (typedResponse.success && typedResponse.data) {
            setUsers(typedResponse.data);
            console.log('zed hello', typedResponse.data);
          } else {
            setError(typedResponse.message || 'Failed to fetch users.');
          }
        };

        window.electron.ipcRenderer.on(
          'branch-members-listed',
          handleMembersListed,
        );

        // Cleanup listener
        return () => {
          window.electron.ipcRenderer.removeListener(
            'branch-members-listed',
            handleMembersListed,
          );
        };
      }
      setError('Electron IPC is not available.');
      setLoading(false);
    };

    fetchUsers();
  }, [branchId, orgId, token]);

  return (
    <div className="mt-5 overflow-x-auto">
      {loading ? (
        <div className="text-center py-5 text-gray-500">Loading users...</div>
      ) : (
        <>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <table className="w-full text-left border-collapse bg-white shadow-lg">
            <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
              <tr>
                <th className="py-3 px-6">ID</th>
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Email</th>
                {/* <th className="py-3 px-6">Status</th> */}
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t hover:bg-gray-100 transition duration-150"
                >
                  <td className="py-3 px-6">{user.id}</td>
                  <td className="py-3 px-6">{user.name}</td>
                  <td className="py-3 px-6">{user.email}</td>
                  {/* <td className="py-3 px-6">
                    {user.isActive ? 'Active' : 'Inactive'}
                  </td> */}
                  <td className="py-3 px-6 text-center">
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default BranchUserTable;
