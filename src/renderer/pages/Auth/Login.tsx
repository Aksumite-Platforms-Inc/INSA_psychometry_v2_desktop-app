import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correct import statement
import { useAuth } from '../../context/AuthContext';

function Login() {
  const { setAuth } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post<{ token: string }>(
        'http://localhost:3001/login',
        { username, password },
      );

      const { token } = response.data;
      localStorage.setItem('token', token);
      const decodedToken: any = jwtDecode(token);
      setAuth({ token, role: decodedToken.role });
      navigate('/dashboard');
    } catch (err) {
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
          <div>
            <a href="/forgot-password">Forgot Password?</a>
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
