import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getToken, getOrgId } from '../../utils/validationUtils';
import DefaultLayout from '../../components/layout/defaultlayout';

interface BranchDetails {
  id: number;
  name: string;
  location?: string;
  createdAt?: string;
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

    // Send IPC request to fetch branch details
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

    // Listen for the response from the main process
    window.electron.ipcRenderer.on(
      'branch-details-fetched',
      handleBranchDetailsFetched,
    );

    // Cleanup listener
    return () => {
      window.electron.ipcRenderer.removeListener(
        'branch-details-fetched',
        handleBranchDetailsFetched,
      );
    };
  }, [branchId, token, orgId]);

  // Render skeleton while loading
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
              {/* <p className="text-gray-700 mb-1">
                <span className="font-semibold">Location:</span>{' '}
                {branchDetails.location || 'Unknown'}
              </p> */}
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Created At:</span>{' '}
                {branchDetails.createdAt || 'Unknown'}
              </p>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}

export default BranchDetailsPage;
