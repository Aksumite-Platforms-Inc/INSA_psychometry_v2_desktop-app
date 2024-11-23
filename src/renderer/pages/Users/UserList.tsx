/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import UserTable from '../../components/Tables/UserTable';
import DefaultLayout from '../../components/layout/defaultlayout';

function Users() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailList, setEmailList] = useState('');
  const [newUsers, setNewUsers] = useState<{ email: string }[]>([]);
  // INFO: user add will be added in the future
  // Toggle modal visibility
  const toggleModal = () => setIsModalOpen((prev) => !prev);

  // Handle user addition (bulk or individual)
  const handleAddUsers = () => {
    const emails = emailList
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email); // Remove empty entries
    const usersToAdd = emails.map((email) => ({ email }));

    setNewUsers((prev) => [...prev, ...usersToAdd]);
    setEmailList('');
    toggleModal();
  };

  return (
    <DefaultLayout>
      <div className="relative">
        {/* Main Content */}
        <div className={`flex ${isModalOpen ? 'backdrop-blur-sm' : ''}`}>
          <div className="flex-1 p-5 h-screen overflow-y-auto">
            <div className="flex justify-between items-center mt-5">
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search..."
                className="p-2 border border-gray-300 rounded-md"
              />

              {/* Add Users Button */}
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={toggleModal}
              >
                Add Users
              </button>
            </div>

            {/* User Table */}
            <UserTable />
          </div>
        </div>

        {/* Add Users Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
              <h2 className="text-2xl font-bold mb-5">Add Users</h2>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddUsers();
                }}
              >
                {/* Email Input */}
                <div className="flex flex-col">
                  <label
                    htmlFor="emails"
                    className="text-gray-600 font-semibold"
                  >
                    Email Addresses (comma separated)
                  </label>
                  <textarea
                    id="emails"
                    className="p-2 border border-gray-300 rounded-md"
                    placeholder="Enter email addresses, separated by commas"
                    rows={4}
                    value={emailList}
                    onChange={(e) => setEmailList(e.target.value)}
                  />
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    onClick={toggleModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Add Users
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}

export default Users;
