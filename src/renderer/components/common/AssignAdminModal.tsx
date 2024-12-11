/* eslint-disable react/function-component-definition */
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { getToken } from '../../utils/validationUtils';

interface BranchMember {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AssignAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  branchMembers: BranchMember[];
  branchId: number;
  orgId: number;
  hasAdmin: boolean; // Indicates if the branch currently has an admin
  onAdminAssigned: () => void; // Callback to refresh the parent component
}

const AssignAdminModal: React.FC<AssignAdminModalProps> = ({
  isOpen,
  onClose,
  branchMembers,
  branchId,
  orgId,
  hasAdmin,
  onAdminAssigned,
}) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null); // Selected email for user-based flow
  const [manualEmail, setManualEmail] = useState<string>(''); // Manual email input
  const [loading, setLoading] = useState(false);
  const token = getToken();

  const assignBranchAdmin = () => {
    let emailToAssign: string | null = null;

    // Validation for the appropriate flow
    if (!hasAdmin && manualEmail.trim() === '') {
      toast.error('Please enter an email address.');
      return;
    }
    if (hasAdmin && !selectedUser) {
      toast.error('Please select a user to assign as admin.');
      return;
    }

    emailToAssign = hasAdmin ? selectedUser : manualEmail.trim();

    if (window.electron?.ipcRenderer) {
      setLoading(true);

      // Send IPC message to assign admin
      window.electron.ipcRenderer.sendMessage('assign-branch-admin', {
        orgId,
        branchId,
        email: emailToAssign,
        token,
      });

      const handleBranchAdminAssigned = (_event: any, response: any) => {
        setLoading(false);

        if (response.success) {
          toast.success('Branch admin assigned successfully!');
          onAdminAssigned(); // Trigger parent refresh
          onClose(); // Close the modal
        } else {
          toast.error(response.message || 'Failed to assign branch admin.');
        }
      };

      window.electron.ipcRenderer.once(
        'branch-admin-assigned',
        handleBranchAdminAssigned,
      );

      // Cleanup to prevent duplicate listeners
      return () => {
        window.electron.ipcRenderer.removeListener(
          'branch-admin-assigned',
          handleBranchAdminAssigned,
        );
      };
    } else {
      toast.error('Electron IPC Renderer is not available.');
    }
  };

  // Reset state when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setSelectedUser(null);
      setManualEmail('');
      setLoading(false);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Assign Branch Admin"
      className="w-full max-w-lg bg-white rounded-lg shadow-lg p-5 relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      {/* Close Button */}
      <button
        type="button"
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>

      <h2 className="text-xl font-semibold mb-4">Assign Branch Admin</h2>
      {hasAdmin ? (
        <>
          <p className="text-gray-600 mb-4">
            Select a user to assign as the branch admin:
          </p>
          <div className="space-y-2 max-h-[50vh] overflow-y-auto border rounded-md p-2 scroll-smooth">
            {branchMembers.length === 0 ? (
              <p className="text-gray-500 text-center">
                No members available to assign.
              </p>
            ) : (
              branchMembers
                // Display all members except the current admin
                .filter(
                  (member) =>
                    member.role !== 'branch_admin' ||
                    selectedUser === member.email,
                )
                .map((member) => (
                  <div
                    key={member.email}
                    className={`flex items-center justify-between p-3 rounded cursor-pointer border ${
                      selectedUser === member.email
                        ? 'border-blue-500 bg-blue-100'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedUser(member.email)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedUser(member.email);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div>
                      <p className="font-medium text-gray-800">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                    {selectedUser === member.email && (
                      <span className="text-blue-500 font-semibold">
                        Selected
                      </span>
                    )}
                  </div>
                ))
            )}
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-600 mb-4">
            Enter the email address of the user to assign as the branch admin:
          </p>
          <input
            type="email"
            value={manualEmail}
            onChange={(e) => setManualEmail(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Enter email address"
          />
        </>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="button"
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
          onClick={assignBranchAdmin}
          disabled={loading}
        >
          {loading ? 'Assigning...' : 'Assign Admin'}
        </button>
      </div>
    </Modal>
  );
};

export default AssignAdminModal;
