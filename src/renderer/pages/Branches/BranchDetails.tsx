// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { getToken } from '../../utils/validationUtils';
// import DefaultLayout from '../../components/layout/defaultlayout';

// interface BranchDetails {
//   id: number;
//   name: string;
//   location?: string;
//   createdAt?: string;
// }

// interface GetBranchResponse {
//   success: boolean;
//   message?: string;
//   data?: BranchDetails;
// }

// function BranchDetailsPage() {
//   const { branchId } = useParams(); // Get branchId from the URL
//   const [branchDetails, setBranchDetails] = useState<BranchDetails | null>(
//     null,
//   );
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   const token = getToken();

//   useEffect(() => {
//     if (!token) {
//       setError('Token is missing.');
//       setLoading(false);
//       return;
//     }

//     if (!window.electron || !window.electron.ipcRenderer) {
//       setError('Electron IPC is not available.');
//       setLoading(false);
//       return;
//     }

//     // Send IPC request to fetch branch details
//     window.electron.ipcRenderer.sendMessage('get-branch-details', {
//       branchId,
//       token,
//     });

//     const handleBranchDetailsFetched = (_event: any, response: any) => {
//       const typedResponse = response as GetBranchResponse;
//       setLoading(false);

//       if (typedResponse.success && typedResponse.data) {
//         setBranchDetails(typedResponse.data);
//       } else {
//         setError(typedResponse.message || 'Failed to fetch branch details.');
//       }
//     };

//     // Listen for the response from the main process
//     window.electron.ipcRenderer.on(
//       'branch-details-fetched',
//       handleBranchDetailsFetched,
//     );

//     // Cleanup listener
//     return () => {
//       window.electron.ipcRenderer.removeListener(
//         'branch-details-fetched',
//         handleBranchDetailsFetched,
//       );
//     };
//   }, [branchId, token]);

//   return (
//     <DefaultLayout>
//       <div className="flex-1 p-5 h-screen overflow-y-auto">
//         {loading && (
//           <div className="text-center py-5 text-gray-500">
//             Loading branch details...
//           </div>
//         )}
//         {!loading && error && (
//           <div className="text-center py-5 text-red-500">{error}</div>
//         )}
//         {!loading && !error && branchDetails && (
//           <div className="bg-white shadow rounded p-5">
//             <h1 className="text-xl font-bold mb-3">Branch Details</h1>
//             <p>
//               <strong>ID:</strong> {branchDetails.id}
//             </p>
//             <p>
//               <strong>Name:</strong> {branchDetails.name}
//             </p>
//             <p>
//               <strong>Location:</strong>{' '}
//               {branchDetails.location || 'Not specified'}
//             </p>
//             <p>
//               <strong>Created At:</strong>{' '}
//               {branchDetails.createdAt || 'Unknown'}
//             </p>
//           </div>
//         )}
//       </div>
//     </DefaultLayout>
//   );
// }

// export default BranchDetailsPage;
