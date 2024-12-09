/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash,
  faSortUp,
  faSortDown,
} from '@fortawesome/free-solid-svg-icons';
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

    if (!token || !newBranch.trim()) return;

    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.sendMessage('create-branch', {
        name: newBranch.trim(),
        token,
        orgId,
      });

      const handleBranchCreated = (_event: any, response: any) => {
        const typedResponse = response as GetResponse;

        if (typedResponse.success) {
          setNewBranch('');
          fetchBranches(); // Refresh branches after creation
        } else {
          setError(typedResponse.message || 'Failed to create branch.');
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
            <h3 className="text-lg font-bold mb-3">Branches:</h3>
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
                          <FontAwesomeIcon icon={faSortUp} className="ml-2" />
                        ) : (
                          <FontAwesomeIcon icon={faSortDown} className="ml-2" />
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
                          <FontAwesomeIcon icon={faSortUp} className="ml-2" />
                        ) : (
                          <FontAwesomeIcon icon={faSortDown} className="ml-2" />
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

            <div className="mt-5">
              <form className="space-y-4" onSubmit={handleAddBranch}>
                <input
                  type="text"
                  value={newBranch}
                  onChange={(e) => setNewBranch(e.target.value)}
                  placeholder="New Branch Name"
                  className="border p-2 rounded w-full"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Add Branch
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </DefaultLayout>
  );
}

export default Branches;
