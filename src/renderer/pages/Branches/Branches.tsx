/* eslint-disable consistent-return */
// create a page that will be used to list branchs create branches, assign admin to branch and delete branches
import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
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
  const [newBranch, setNewBranch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // const [admin, setAdmin] = useState('');
  // const navigate = useNavigate();
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
        // Send request to fetch Branchs
        window.electron.ipcRenderer.sendMessage('get-branches', {
          token,
        });

        const handleBranchesListed = (_event: any, response: any) => {
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

  const handleDeleteBranch = (branchId: number) => {
    if (window.electron && window.electron.ipcRenderer) {
      // Send request to delete Branch
      window.electron.ipcRenderer.sendMessage('delete-branch', {
        branchId,
        token,
      });
      const handleBranchDeleted = (_event: any, response: any) => {
        const typedResponse = response as GetResponse;
        setLoading(false);

        if (typedResponse.success && typedResponse.data) {
          setBranches(typedResponse.data);
        } else {
          setError(typedResponse.message || 'Failed to delete Branch.');
        }
      };

      window.electron.ipcRenderer.on('branch-deleted', handleBranchDeleted);

      // Cleanup listener
      return () => {
        window.electron.ipcRenderer.removeListener(
          'branch-deleted',
          handleBranchDeleted,
        );
      };
    }
    setError('Electron IPC is not available.');
    setLoading(false);
  };

  const handleAddBranch = () => {
    if (window.electron && window.electron.ipcRenderer) {
      console.log('Sending create-branch request:', { name: newBranch, token });

      window.electron.ipcRenderer.sendMessage('create-branch', {
        name: newBranch,
        token,
        orgId,
      });

      const handleBranchCreated = (_event: any, response: any) => {
        console.log('Received branch-created response:', response);

        const typedResponse = response as GetResponse;
        setLoading(false);

        if (typedResponse.success && typedResponse.data) {
          setBranches(typedResponse.data);
        } else {
          setError(typedResponse.message || 'Failed to create Branch.');
        }
      };

      window.electron.ipcRenderer.on('branch-created', handleBranchCreated);

      return () => {
        window.electron.ipcRenderer.removeListener(
          'branch-created',
          handleBranchCreated,
        );
      };
    }
    setError('Electron IPC is not available.');
  };

  // const handleRowClick = (clickedBranchId: string) => {
  //   // Handle row click logic here
  //   navigate(`/branch/${clickedBranchId}`);
  // };

  return (
    <DefaultLayout>
      <div className="flex-1 p-5 h-screen overflow-y-auto">
        {loading ? (
          <div className="text-center py-5 text-gray-500">
            Loading Branchs...
          </div>
        ) : (
          <>
            <h3 className="text-lg font-bold mb-3">Branchs:</h3>
            <table className="w-full text-left border-collapse bg-white shadow-lg">
              <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
                <tr>
                  <th className="py-3 px-6">ID</th>
                  <th className="py-3 px-6">Branch Name</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {branches.length > 0 ? (
                  branches.map((branch) => (
                    <tr
                      key={branch.id}
                      className="border-t hover:bg-gray-100 transition duration-150 cursor-pointer"
                      // onClick={() => handleRowClick(branch.id.toString())}
                    >
                      <td className="py-3 px-6">{branch.id}</td>
                      <td className="py-3 px-6">{branch.name}</td>
                      <td className="py-3 px-6 text-center flex justify-center space-x-4">
                        {/* add branch admin asign button */}
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          title="Delete User"
                          onClick={() => handleDeleteBranch(branch.id)}
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
                      {error || 'No Branchs found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="mt-5">
              <form className="space-y-4" onSubmit={handleAddBranch}>
                <input
                  type="text"
                  value={newBranch}
                  onChange={(e) => setNewBranch(e.target.value)}
                  placeholder="New Branch Name"
                  className="border p-2 rounded w-full"
                />
                <input
                  type="submit"
                  value="Add Branch"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                />
              </form>
            </div>
          </>
        )}
      </div>
    </DefaultLayout>
  );
}

export default Branches;
