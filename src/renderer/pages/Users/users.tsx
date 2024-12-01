/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import JsPDF from 'jspdf'; // For generating PDFs
import UserTable from '../../components/Tables/UserTable';
import DefaultLayout from '../../components/layout/defaultlayout';

function Users() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailList, setEmailList] = useState('');
  const [users, setUsers] = useState<{ email: string; password: string }[]>([]);

  // Toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Function to generate random password
  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8); // Simple 8-character password
  };

  // Function to generate PDF with users' credentials
  const GeneratePDF = (userList: { email: string; password: string }[]) => {
    const doc = new JsPDF();
    doc.text('User Login Details', 10, 10);
    userList.forEach((user, index) => {
      doc.text(
        `${index + 1}. Email: ${user.email}, Password: ${user.password}`,
        10,
        20 + index * 10,
      );
    });
    doc.save('user_credentials.pdf');
  };

  // Function to handle bulk or individual user addition
  const handleAddUsers = () => {
    const emails = emailList.split(',').map((email) => email.trim());
    const newUsers = emails.map((email) => ({
      email,
      password: generateRandomPassword(),
    }));
    setUsers([...users, ...newUsers]);
    toggleModal();
    GeneratePDF(newUsers);
  };

  return (
    <DefaultLayout>
      <div className="relative ">
        <div className={`flex ${isModalOpen ? 'backdrop-blur-sm' : ''}`}>
          <div className="flex-1 p-5 h-screen overflow-y-auto ">
            <div className="flex justify-between items-center mt-5">
              <input
                type="text"
                placeholder="Search..."
                className="p-2 border border-gray-300 rounded-md"
              />
              <button
                type="button"
                className="bg-blue-500 text-white p-2 rounded-md"
                onClick={toggleModal}
              >
                Add Users
              </button>
            </div>
            <UserTable />

            {/* Displaying added users */}
            <div className="mt-5">
              <h3 className="text-lg font-bold mb-3">Invited Users:</h3>
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
                  <tr>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Password</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.email} className="border-t">
                      <td className="py-2 px-4">{user.email}</td>
                      <td className="py-2 px-4">{user.password}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* <Footer /> */}

        {/* Modal for adding users */}
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
