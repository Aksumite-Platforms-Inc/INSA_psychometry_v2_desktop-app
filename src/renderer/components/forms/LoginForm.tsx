/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import Logo from '../../assets/Images/logo/logo.png';
import 'react-toastify/dist/ReactToastify.css';

interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
}

interface DecodedToken {
  role: string;
}

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.electron && window.electron.ipcRenderer) {
      const handleLoginSuccess = (_event: any, ...args: unknown[]) => {
        const response = args[0] as LoginResponse;
        if (response.success && response.token) {
          localStorage.setItem('authToken', response.token);

          try {
            const decoded: DecodedToken = jwtDecode(response.token);
            const userRole = decoded.role;

            if (userRole === 'org_admin' || userRole === 'branch_admin') {
              navigate('/dashboard');
            } else if (userRole === 'org_member') {
              navigate('/tests');
            } else {
              toast.error('Unknown role. Contact support.');
              console.error('Unknown role:', userRole);
            }

            toast.success('Login successful!');
          } catch (err) {
            console.error('Error decoding token:', err);
            toast.error('Failed to process user role. Contact support.');
          }
        } else {
          setError(response.message || 'Login failed.');
          toast.error(response.message || 'Login failed.');
        }
      };

      window.electron.ipcRenderer.on('user-login-success', handleLoginSuccess);

      return () => {
        window.electron.ipcRenderer.removeListener(
          'user-login-success',
          handleLoginSuccess,
        );
      };
    }
    return undefined;
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.sendMessage('user-login', email, password);
    } else {
      setError('Electron IPC is not available');
      toast.error('Electron IPC is not available.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">
            INSA | Personality Test Platform
          </h1>
          <img src={Logo} alt="Logo" className=" mx-auto mb-4" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="8+ Characters, 1 Capital letter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 flex justify-between items-center">
          <Link
            to="/forgotpassword"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>
          <Link to="/help" className="text-sm text-blue-600 hover:underline">
            Need Help?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
