import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getToken, getOrgId } from '../../utils/validationUtils';
import DefaultLayout from '../../components/layout/defaultlayout';
import BranchUserTable from '../../components/Tables/BranchUserTable';
import AssignAdminModal from '../../components/common/AssignAdminModal'; // Assuming this exists

interface BranchDetails {
  id: number;
  name: string;
  location: string;
  created_at: string;
}

interface BranchMember {
  id: number;
  name: string;
  email: string;
  role: string; // Role added to member structure
}

interface GetBranchResponse {
  success: boolean;
  message?: string;
  data?: BranchDetails;
}

function BranchDetailsPage() {
  const { branchId } = useParams(); // Get branchId from the URL
  const orgId = getOrgId();
  const [branchDetails, setBranchDetails] = useState<BranchDetails | null>(
    null,
  );
  const [branchAdmin, setBranchAdmin] = useState<BranchMember | null>(null); // To store the branch admin details
  const [branchMembers, setBranchMembers] = useState<BranchMember[]>([]); // To store all members
  const [assignAdminModalOpen, setAssignAdminModalOpen] = useState(false); // Modal state
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const token = getToken();

  useEffect(() => {
    if (!token) {
      setError('Token is missing.');
      setLoading(false);
      return undefined;
    }

    if (!window.electron || !window.electron.ipcRenderer) {
      setError('Electron IPC is not available.');
      setLoading(false);
      return undefined;
    }

    // Fetch Branch Details
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

    // Fetch Branch Members
    window.electron.ipcRenderer.sendMessage('get-branch-members', {
      orgId,
      branchId,
      token,
    });

    const handleBranchMembersFetched = (_event: any, response: any) => {
      if (response.success && response.data) {
        const members = response.data as BranchMember[];
        setBranchMembers(members);
        const admin = members.find((member) => member.role === 'branch_admin');
        setBranchAdmin(admin || null);
      } else {
        setError(response.message || 'Failed to fetch branch members.');
      }
    };

    // Set up listeners
    window.electron.ipcRenderer.on(
      'branch-details-fetched',
      handleBranchDetailsFetched,
    );

    window.electron.ipcRenderer.on(
      'branch-members-listed',
      handleBranchMembersFetched,
    );

    // Cleanup listeners
    return () => {
      window.electron.ipcRenderer.removeListener(
        'branch-details-fetched',
        handleBranchDetailsFetched,
      );
      window.electron.ipcRenderer.removeListener(
        'branch-members-listed',
        handleBranchMembersFetched,
      );
    };
  }, [branchId, token, orgId]);

  const openAssignAdminModal = () => setAssignAdminModalOpen(true);
  const closeAssignAdminModal = () => setAssignAdminModalOpen(false);

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

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && branchDetails && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-2">Branch Details</h1>
            <p>
              <strong>Branch Name:</strong> {branchDetails.name}
            </p>
            <p>
              <strong>Created At:</strong>{' '}
              {new Date(branchDetails.created_at).toLocaleDateString()}
            </p>
            {branchAdmin ? (
              <p>
                <strong>Branch Admin:</strong> {branchAdmin.name} (
                {branchAdmin.email})
              </p>
            ) : (
              <p className="text-gray-500">No branch admin assigned.</p>
            )}

            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
              onClick={openAssignAdminModal}
            >
              {branchAdmin ? 'Change Branch Admin' : 'Assign Branch Admin'}
            </button>
          </div>
        )}

        <BranchUserTable branchId={Number(branchId)} orgId={Number(orgId)} />

        {/* Modal for assigning admin */}
        {orgId && (
          <AssignAdminModal
            isOpen={assignAdminModalOpen}
            onClose={closeAssignAdminModal}
            branchMembers={branchMembers}
            orgId={orgId}
            branchId={Number(branchId)}
            hasAdmin={!!branchAdmin}
            onAdminAssigned={(newAdmin: BranchMember) =>
              setBranchAdmin(newAdmin)
            }
          />
        )}
      </div>
    </DefaultLayout>
  );
}

export default BranchDetailsPage;
