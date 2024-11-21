import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginResponse {
  success: boolean;
  message?: string;
  user?: {
    email: string;
  };
}

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.electron && window.electron.ipcRenderer) {
      const unsubscribe = window.electron.ipcRenderer.on(
        'user-login-success',
        (_event, response) => {
          console.log('Received response from main process:', response);

          const typedResponse = response as LoginResponse;
          if (typedResponse.success) {
            console.log('Login successful:', typedResponse.user);
            navigate('/dashboard');
          } else {
            console.error('Login failed:', typedResponse.message);
            setError(typedResponse.message || 'An unexpected error occurred.');
          }
        },
      );

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
    return undefined;
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.sendMessage('user-login', email, password);
    } else {
      setError('Electron IPC is not available');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 max-w-sm mx-auto"
    >
      {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}
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
      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-150"
      >
        Login
      </button>
    </form>
  );
}

export default LoginForm;
