/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { getToken, getOrgId } from '../../utils/validationUtils';
import DefaultLayout from '../../components/layout/defaultlayout';
import useSortableTable from '../../components/common/useSortableTable';
import Pagination from '../../components/common/Pagination';

interface Branch {
  id: number;
  name: string;
  org_id: string;
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

  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5; // Items per page

  const navigate = useNavigate();
  const orgId = getOrgId();
  const token = getToken();

  const { sortedData, requestSort, sortConfig } = useSortableTable(branches);

  const fetchBranches = () => {
    if (!token || !orgId) {
      setError('Organization ID or token is missing.');
      setLoading(false);
      return;
    }

    setLoading(true);

    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.sendMessage('get-branches', { token });

      const handleBranchesListed = (_event: any, response: any) => {
        const typedResponse = response as GetResponse;
        setLoading(false);

        if (typedResponse.success && typedResponse.data) {
          setBranches(typedResponse.data);
        } else {
          setError(typedResponse.message || 'Failed to fetch branches.');
        }
      };

      window.electron.ipcRenderer.on('branches-listed', handleBranchesListed);

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

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleDeleteBranch = (branchId: number) => {
    setError(null);

    if (!token) return;

    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.sendMessage('delete-branch', {
        branchId,
        token,
      });

      const handleBranchDeleted = (_event: any, response: any) => {
        const typedResponse = response as GetResponse;

        if (typedResponse.success) {
          fetchBranches(); // Refresh branches after deletion
        } else {
          setError(typedResponse.message || 'Failed to delete branch.');
        }
      };

      window.electron.ipcRenderer.on('branch-deleted', handleBranchDeleted);

      return () => {
        window.electron.ipcRenderer.removeListener(
          'branch-deleted',
          handleBranchDeleted,
        );
      };
    }
    setError('Electron IPC is not available.');
  };

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token || !newBranch.trim()) {
      toast.error('Please provide both branch name and admin email.');
      return;
    }

    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.sendMessage('create-branch', {
        name: newBranch.trim(),
        // adminEmail: newBranchAdminEmail.trim(),
        token,
        orgId,
      });

      const handleBranchCreated = (_event: any, response: any) => {
        const typedResponse = response as GetResponse;

        if (typedResponse.success) {
          setNewBranch('');
          toast.success('Branch created successfully!');
          fetchBranches(); // Refresh branches after creation
        } else {
          setError(typedResponse.message || 'Failed to create branch.');
          toast.error(typedResponse.message || 'Failed to create branch.');
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

  const handleRowClick = (clickedBranchId: number) => {
    navigate(`/branches/${clickedBranchId}`, { state: { orgId } });
  };

  const totalRecords = sortedData.length;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const paginatedBranches = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <DefaultLayout>
      <div className="flex-1 p-5 h-screen overflow-y-auto">
        {loading ? (
          <div className="text-center py-5 text-gray-500">
            Loading branches...
          </div>
        ) : (
          <>
            <nav className="w-full bg-gray-50 py-3 px-6 shadow-sm">
              <div className="flex items-center space-x-4 text-sm text-gray-800">
                <div className="flex items-center space-x-2">
                  <div className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                    Home
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {/* <span className="bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-full shadow-md" /> */}
                  <div className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                    Branches
                  </div>
                </div>
              </div>
            </nav>
            <div className="mt-5 bg-white p-5">
              <form className="space-y-4" onSubmit={handleAddBranch}>
                <h2 className="font-bold">Create New Branch</h2>
                <input
                  type="text"
                  value={newBranch}
                  onChange={(e) => setNewBranch(e.target.value)}
                  placeholder="New Branch Name"
                  className="border p-2 rounded-md mx-2"
                />

                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Add New Branch
                </button>
              </form>
            </div>
            <br />
            <hr />
            <br />
            <table className="w-full text-left border-collapse bg-white shadow-lg">
              <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
                <tr>
                  <th
                    className="py-3 px-6 cursor-pointer"
                    onClick={() => requestSort('id')}
                  >
                    <div className="flex items-center">
                      ID
                      {sortConfig.key === 'id' &&
                        (sortConfig.direction === 'ascending' ? (
                          <span>&uarr;</span>
                        ) : (
                          <span>&darr;</span>
                        ))}
                    </div>
                  </th>
                  <th
                    className="py-3 px-6 cursor-pointer"
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center">
                      Branch Name
                      {sortConfig.key === 'name' &&
                        (sortConfig.direction === 'ascending' ? (
                          <span>&uarr;</span>
                        ) : (
                          <span>&darr;</span>
                        ))}
                    </div>
                  </th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {paginatedBranches.length > 0 ? (
                  paginatedBranches.map((branch) => (
                    <tr
                      key={branch.id}
                      className="border-t hover:bg-gray-100 transition duration-150 cursor-pointer"
                      onClick={() => handleRowClick(branch.id)}
                    >
                      <td className="py-3 px-6">{branch.id}</td>
                      <td className="py-3 px-6">{branch.name}</td>
                      <td
                        className="py-3 px-6 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
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
                      colSpan={3}
                      className="text-center py-3 px-6 text-gray-500"
                    >
                      {error || 'No branches found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </DefaultLayout>
  );
}

export default Branches;
