/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); // React Router's navigation hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await window.electron.ipcRenderer.invoke('auth:login', {
        email,
        password,
      });

      if (response.success) {
        localStorage.setItem('authToken', response.token);
        setError(null);
        console.log('Login successful');
        navigate('/dashboard'); // Redirect to dashboard
      } else {
        setError(response.message || 'Invalid email or password.');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 max-w-sm mx-auto"
    >
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-gray-700 font-semibold mb-2"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          title="Email"
          placeholder="Enter your email"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-gray-700 font-semibold mb-2"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          title="Password"
          placeholder="Enter your password"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <button
        type="submit"
        className="bg-blue-500 w-full py-2 mt-5 rounded-lg text-white"
      >
        Login
      </button>
    </form>
  );
}

export default LoginForm;
