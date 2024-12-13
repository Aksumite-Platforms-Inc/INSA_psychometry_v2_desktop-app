import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import Logo from '../../assets/Images/logo/logo.png';
import 'react-toastify/dist/ReactToastify.css';

interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string; // The token should include the user's role
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
          // Save token in localStorage
          localStorage.setItem('authToken', response.token);

          // Decode token to get user role
          try {
            const decoded: DecodedToken = jwtDecode(response.token);
            const userRole = decoded.role;

            // Navigate based on user role
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
    setError(null); // Clear any previous errors
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.sendMessage('user-login', email, password);
    } else {
      setError('Electron IPC is not available');
      toast.error('Electron IPC is not available.');
    }
  };

  return (
    <div className="w-full rounded-sm border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark">
      <div className="w-full flex flex-wrap items-center p-5">
        <div className="w-full xl:block xl:w-1/2">
          <div className="py-17.5 px-26 text-center">
            <Link className="mb-5.5 inline-block" to="/">
              <img className="hidden dark:block" src={Logo} alt="Logo" />
            </Link>
            <h2 className="mb-9 font-bold">INSA | Personality Test Platform</h2>
          </div>
        </div>

        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="mb-2.5 block font-medium">
                  Email
                  <input
                    id="email"
                    type="text"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black"
                  />
                </label>
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="mb-2.5 block font-medium">
                  Password
                  <input
                    id="password"
                    type="password"
                    placeholder="8+ Characters, 1 Capital letter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black"
                  />
                </label>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="mb-5">
                <input
                  type="submit"
                  value="Sign In"
                  className="w-full cursor-pointer rounded-lg border bg-blue-700 p-4 text-white"
                />
              </div>

              <div className="mb-2.5">
                <button
                  type="button"
                  onClick={() => {
                    navigate('/forgotpassword');
                  }}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
