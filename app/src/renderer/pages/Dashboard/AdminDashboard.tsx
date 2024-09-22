import Button from '../../components/common/Button';

function AdminDashboard() {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white shadow-lg rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Users</h3>
          <p>Manage all users in your organization.</p>
          <Button label="View Users" onClick={() => {}} />
        </div>
        <div className="p-4 bg-white shadow-lg rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Tests</h3>
          <p>Manage and assign tests to your users.</p>
          <Button label="View Tests" onClick={() => {}} />
        </div>
        <div className="p-4 bg-white shadow-lg rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Reports</h3>
          <p>Generate and view reports of user performance.</p>
          <Button label="View Reports" onClick={() => {}} />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
