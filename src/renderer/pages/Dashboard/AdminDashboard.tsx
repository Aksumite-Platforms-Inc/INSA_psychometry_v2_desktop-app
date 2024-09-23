import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Jan', users: 30, tests: 40 },
  { name: 'Feb', users: 50, tests: 60 },
  { name: 'Mar', users: 40, tests: 70 },
];

const AdminDashboard: React.FC = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 p-4 shadow-lg rounded-lg">
        <h3 className="text-xl font-semibold mb-4">User Growth</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#8884d8" />
            <Line type="monotone" dataKey="tests" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 shadow-lg rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Test Completion</h3>
        <p>Report generation functionality goes here.</p>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">
          Generate Report
        </button>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
