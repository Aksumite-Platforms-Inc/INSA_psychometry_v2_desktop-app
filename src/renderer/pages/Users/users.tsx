/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import { jsPDF as JsPDF } from 'jspdf';

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
    <div>
      <button type="button" onClick={toggleModal}>
        Add Users
      </button>
      {isModalOpen && (
        <div className="modal">
          <h2>Add Users</h2>
          <label htmlFor="emailList">Email List</label>
          <textarea
            id="emailList"
            value={emailList}
            onChange={(e) => setEmailList(e.target.value)}
          />
          <button type="button" onClick={handleAddUsers}>
            Submit
          </button>
        </div>
      )}
      <ul>
        {users.map((user) => (
          <li key={user.email}>{user.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
