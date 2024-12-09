/* eslint-disable consistent-return */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { getToken, getOrgId } from '../../utils/validationUtils';
import DefaultLayout from '../../components/layout/defaultlayout';
import BranchUserTable from '../../components/Tables/BranchUserTable';

interface BranchDetails {
  id: number;
  name: string;
  location: string;
  created_at: Date;
}

interface BranchMember {
  id: number;
  name: string;
  email: string;
}

interface GetBranchResponse {
  success: boolean;
  message?: string;
  data?: BranchDetails;
}

interface GetMembersResponse {
  success: boolean;
  message?: string;
  data?: BranchMember[];
}

function BranchDetailsPage() {
  const { branchId } = useParams();
  const orgId = getOrgId();
  const token = getToken();

  const [branchDetails, setBranchDetails] = useState<BranchDetails | null>(
    null,
  );
  const [members, setMembers] = useState<BranchMember[]>([]);
  const [selectedAdminEmail, setSelectedAdminEmail] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Fetch Branch Details
  useEffect(() => {
    if (!token) {
      setError('Token is missing.');
      setLoading(false);
      return;
    }

    if (!window.electron?.ipcRenderer) {
      setError('Electron IPC is not available.');
      setLoading(false);
      return;
    }

    window.electron.ipcRenderer.sendMessage('get-branch-details', {
      orgId,
      branchId,
      token,
    });

    const handleBranchDetailsFetched = (_event: any, response: any) => {
      const typedResponse = response as GetBranchResponse;
      setLoading(false);

      if (typedResponse.success && typedResponse.data) {
        setBranchDetails(typedResponse.data);
      } else {
        setError(typedResponse.message || 'Failed to fetch branch details.');
      }
    };

    window.electron.ipcRenderer.on(
      'branch-details-fetched',
      handleBranchDetailsFetched,
    );

    return () => {
      window.electron.ipcRenderer.removeListener(
        'branch-details-fetched',
        handleBranchDetailsFetched,
      );
    };
  }, [branchId, token, orgId]);

  // Fetch Branch Members
  useEffect(() => {
    if (!branchId || !token) return;

    window.electron.ipcRenderer.sendMessage('get-branch-members', {
      orgId,
      branchId,
      token,
    });

    const handleMembersListed = (_event: any, response: any) => {
      const typedResponse = response as GetMembersResponse;
      if (typedResponse.success && typedResponse.data) {
        setMembers(typedResponse.data);
      } else {
        toast.error(typedResponse.message || 'Failed to fetch branch members.');
      }
    };

    window.electron.ipcRenderer.on(
      'branch-members-listed',
      handleMembersListed,
    );

    return () => {
      window.electron.ipcRenderer.removeListener(
        'branch-members-listed',
        handleMembersListed,
      );
    };
  }, [branchId, token, orgId]);

  // Assign Admin
  const handleAssignAdmin = () => {
    if (!selectedAdminEmail || !token) return;

    window.electron.ipcRenderer.sendMessage('assign-branch-admin', {
      orgId,
      branchId,
      email: selectedAdminEmail,
      token,
    });

    const handleAdminAssigned = (_event: any, response: any) => {
      if (response.success) {
        toast.success('Admin assigned successfully!');
        setIsModalOpen(false);
      } else {
        toast.error(response.message || 'Failed to assign admin.');
      }
    };

    window.electron.ipcRenderer.on(
      'branch-admin-assigned',
      handleAdminAssigned,
    );

    return () => {
      window.electron.ipcRenderer.removeListener(
        'branch-admin-assigned',
        handleAdminAssigned,
      );
    };
  };

  // Render Skeleton While Loading
  const renderSkeleton = () => (
    <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  );

  return (
    <DefaultLayout>
      <div className="p-5">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="bg-white text-gray-500 p-2 shadow-lg rounded-md mb-4 flex items-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        {loading && renderSkeleton()}
        {!loading && error && (
          <div className="text-center py-5 text-red-500">{error}</div>
        )}
        {!loading && !error && branchDetails && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-2">Branch Details</h1>
            <hr />
            <div className="mt-4">
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Branch ID:</span>{' '}
                {branchDetails.id}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Branch Name:</span>{' '}
                {branchDetails.name}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Created At:</span>{' '}
                {new Date(branchDetails.created_at).toLocaleDateString()}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Assign Admin
            </button>
          </div>
        )}

        {/* Branch Members Table */}
        {branchId && (
          <BranchUserTable branchId={Number(branchId)} orgId={Number(orgId)} />
        )}

        {/* Assign Admin Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          className="w-96 bg-white rounded-lg p-6 mx-auto mt-20 shadow-lg"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <h2 className="text-lg font-semibold mb-4">Assign Branch Admin</h2>
          <select
            className="border rounded w-full p-2 mb-4"
            onChange={(e) => setSelectedAdminEmail(e.target.value)}
          >
            <option value="">Select a Member</option>
            {members.map((member) => (
              <option key={member.id} value={member.email}>
                {member.name} ({member.email})
              </option>
            ))}
          </select>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAssignAdmin}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              disabled={!selectedAdminEmail}
            >
              Assign
            </button>
          </div>
        </Modal>
      </div>
    </DefaultLayout>
  );
}

export default BranchDetailsPage;
