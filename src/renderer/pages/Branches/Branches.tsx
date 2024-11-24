// create a page that will be used to list branchs create branches, assign admin to branch and delete branches
import React, { useState, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { getToken, getOrgId } from '../../utils/validationUtils';
import DefaultLayout from '../../components/layout/defaultlayout';

interface Branch {
  id: number;
  name: string;
  org_id: string; // Assuming this field indicates active status
}

interface GetResponse {
  success: boolean;
  message?: string;
  data?: Branch[];
}

function Branches() {
  const [branches, setBranches] = useState<Branch[]>([]);
  // const [newBranch, setNewBranch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // const [admin, setAdmin] = useState('');

  const orgId = getOrgId();
  const token = getToken();
  // const branchId = getBranchId();

  useEffect(() => {
    if (!orgId || !token) {
      setError('Organization ID or token is missing.');
      setLoading(false);
      return;
    }
    const fetchBranches = () => {
      if (window.electron && window.electron.ipcRenderer) {
        console.log('Fetching users with token:', token); // Debugging token

        // Send request to fetch users
        window.electron.ipcRenderer.sendMessage('get-branches', {
          orgId,
          token,
        });

        const handleBranchesListed = (_event: any, response: any) => {
          console.log('Received branches-listed response:', response); // Debugging response

          const typedResponse = response as GetResponse;
          setLoading(false);

          if (typedResponse.success && typedResponse.data) {
            setBranches(typedResponse.data);
          } else {
            setError(typedResponse.message || 'Failed to fetch Branches.');
          }
        };

        window.electron.ipcRenderer.on('branches-listed', handleBranchesListed);

        // Cleanup listener
        return () => {
          window.electron.ipcRenderer.removeListener(
            'branches-listed',
            handleBranchesListed,
          );
        };
      }
      setError('Electron IPC is not available.');
      setLoading(false);
    };

    fetchBranches();
  }, [orgId, token]);

  // const handleTogglebranch = (branchId: number) => {
  //   // Add logic to update the user's active state (API call or state update)
  //   setBranches((prevBranches) =>
  //     prevBranches.map((branch) =>
  //       branch.id === branchId
  //         ? { ...branch, isActive: !branch.isActive }
  //         : branch,
  //     ),
  //   );
  // };
  return (
    <DefaultLayout>
      <div className="flex-1 p-5 h-screen overflow-y-auto">
        {loading ? (
          <div className="text-center py-5 text-gray-500">Loading users...</div>
        ) : (
          <>
            <h3 className="text-lg font-bold mb-3">Active Users:</h3>
            <table className="w-full text-left border-collapse bg-white shadow-lg">
              <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
                <tr>
                  <th className="py-3 px-6">ID</th>
                  <th className="py-3 px-6">Organization ID</th>
                  <th className="py-3 px-6">Branch Name</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {branches.length > 0 ? (
                  branches.map((branch) => (
                    <tr
                      key={branch.id}
                      className="border-t hover:bg-gray-100 transition duration-150"
                    >
                      <td className="py-3 px-6">{branch.id}</td>
                      <td className="py-3 px-6">{branch.org_id || 'N/A'}</td>
                      <td className="py-3 px-6">{branch.name}</td>
                      <td className="py-3 px-6 text-center flex justify-center space-x-4">
                        {/* <label
                        className="relative inline-flex items-center cursor-pointer"
                        aria-label={`Toggle branch ${branch.name}`}
                        htmlFor={`toggle-branch-${branch.id}`}
                      >
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          id={`toggle-branch-${branch.id}`}
                          checked={branch.isActive} // Replace `branch.isActive` with the correct field for active status
                          onChange={() => handleTogglebranch(branch.id)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600" />
                      </label>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        title="Delete User"
                        onClick={() => handleDeleteBranch(branch.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button> */}
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

            {/* {invitedUsers.length > 0 && (
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
          )} */}
          </>
        )}
      </div>
    </DefaultLayout>
  );
}

export default Branches;
