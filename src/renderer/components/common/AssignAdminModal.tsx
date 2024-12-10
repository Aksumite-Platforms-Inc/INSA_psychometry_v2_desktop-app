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
}

const AssignAdminModal: React.FC<AssignAdminModalProps> = ({
  isOpen,
  onClose,
  branchMembers,
  branchId,
  orgId,
}) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null); // User's email
  const [loading, setLoading] = useState(false);
  const token = getToken();

  const assignBranchAdmin = () => {
    if (!selectedUser) {
      toast.error('Please select a user to assign as admin.');
      return;
    }

    if (window.electron?.ipcRenderer) {
      setLoading(true);

      // Send the assign admin request
      window.electron.ipcRenderer.sendMessage('assign-branch-admin', {
        orgId,
        branchId,
        email: selectedUser,
        token,
      });
    } else {
      toast.error('Electron IPC Renderer is not available.');
    }
  };

  useEffect(() => {
    const handleBranchAdminAssigned = (_event: any, response: any) => {
      setLoading(false);
      if (response.success) {
        toast.success('Branch admin assigned successfully!');
        onClose(); // Close the modal
      } else {
        toast.error(response.message || 'Failed to assign branch admin.');
      }
    };

    window.electron?.ipcRenderer?.on(
      'branch-admin-assigned',
      handleBranchAdminAssigned,
    );

    // Cleanup to avoid duplicate listeners
    return () => {
      window.electron?.ipcRenderer?.removeListener(
        'branch-admin-assigned',
        handleBranchAdminAssigned,
      );
    };
  }, [onClose]);

  // Reset modal state when it opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedUser(null);
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
      <p className="text-gray-600 mb-4">
        Select a user to assign as the branch admin:
      </p>

      {/* Scrollable List */}
      <div className="space-y-2 max-h-[50vh] overflow-y-auto border rounded-md p-2 scroll-smooth">
        {branchMembers.length === 0 ? (
          <p className="text-gray-500 text-center">
            No members available to assign.
          </p>
        ) : (
          branchMembers
            .filter((member) => member.role !== 'branch_admin') // Exclude current admin
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
                  <span className="text-blue-500 font-semibold">Selected</span>
                )}
              </div>
            ))
        )}
      </div>

      {/* Actions */}
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
