/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import Illustration from '../../assets/Images/logo/undraw_online_test_re_kyfx (1).svg';
import Logo from '../../assets/Images/logo/INSA_ICON_LOGO.png';
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-gray-800">
      <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl flex flex-col md:flex-row w-full">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 z-0">
          <img src={Logo} alt="Watermark Logo" className="max-w-sm" />
        </div>

        {/* Left Section - Illustration */}
        <div className="relative z-10 flex items-center justify-center w-full md:w-1/2 p-8 bg-gray-100">
          <img src={Illustration} alt="Illustration" className="max-w-xs" />
        </div>

        {/* Right Section - Form */}
        <div className="relative z-10 w-full md:w-1/2 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              INSA | Personality Test Platform
            </h1>
            <p className="text-sm text-gray-600">
              Welcome back! Please log in.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="8+ Characters, 1 Capital letter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 flex justify-between items-center text-sm">
            <Link
              to="/forgotpassword"
              className="text-gray-800 hover:underline"
            >
              Forgot Password?
            </Link>
            <Link to="/help" className="text-gray-800 hover:underline">
              Need Help?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
