import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
// import LoginForm from '../../components/forms/LoginForm';

function Login() {
  const { setAuth } = useAuth(); // Add setAuth to update auth context
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // To display error messages
  const navigate = useNavigate(); // For redirection after successful login

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post<{ token: string }>(
        'http://localhost:3001/login',
        {
          username,
          password,
        },
      );

      const { token } = response.data;

      // Store token in localStorage
      localStorage.setItem('token', token);

      // Update auth context
      setAuth({ username, role: 'organization_admin' }); // Update based on user role

      // Redirect user to dashboard
      navigate('/dashboard');
    } catch (err) {
      // Display error if login fails
      setError('Login failed. Please check your credentials.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <h2 className="text-center text-2xl font-semibold mb-6">Login</h2>
        <hr />
        <br />
        <br />
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 w-full py-2 mt-5 rounded-lg text-white"
          >
            Login
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
