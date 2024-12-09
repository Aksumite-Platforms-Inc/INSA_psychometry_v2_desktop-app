import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface AssignAdminModalProps {
  branchId: number;
  orgId: number;
  onClose: () => void;
  onAssign: (userId: number) => void;
}

function AssignAdminModal({
  branchId,
  orgId,
  onClose,
  onAssign,
}: AssignAdminModalProps) {
  const [members, setMembers] = useState<{ id: number; name: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-branch-members', {
      orgId,
      branchId,
      token: localStorage.getItem('authToken'),
    });

    const handleBranchMembersListed = (_event: any, response: any) => {
      setLoading(false);
      if (response.success) {
        setMembers(response.data || []);
      } else {
        toast.error(response.message || 'Failed to fetch branch members.');
      }
    };

    window.electron.ipcRenderer.on(
      'branch-members-listed',
      handleBranchMembersListed,
    );

    return () => {
      window.electron.ipcRenderer.removeListener(
        'branch-members-listed',
        handleBranchMembersListed,
      );
    };
  }, [branchId, orgId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Assign Admin</h2>
        {loading ? (
          <p>Loading members...</p>
        ) : (
          <div>
            <select
              className="border p-2 w-full rounded-md"
              onChange={(e) => setSelectedUser(Number(e.target.value))}
            >
              <option value="">Select a user</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => selectedUser && onAssign(selectedUser)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Assign
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssignAdminModal;
