import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Logo from '../../assets/Images/logo/logo.png';
import 'react-toastify/dist/ReactToastify.css';
import { getUserRole } from '../../utils/validationUtils';

interface LoginResponse {
  success: boolean;
  message?: string;
  user?: {
    email: string;
    token?: string;
  };
}

// Initialize toast notifications
// toast.configure();

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const userRole = getUserRole();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.electron && window.electron.ipcRenderer) {
      const unsubscribe = window.electron.ipcRenderer.on(
        'user-login-success',
        (_event, response) => {
          const typedResponse = response as LoginResponse & { token: string };
          if (typedResponse.success) {
            // Save token in localStorage
            if (typedResponse.token) {
              localStorage.setItem('authToken', typedResponse.token);
              // Show success toast
              toast.success('Login successful!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
              });
            }

            // Navigate based on user role
            if (
              userRole === 'Organization Admin' ||
              userRole === 'Branch Admin'
            ) {
              navigate('/dashboard');
            } else {
              navigate('/tests');
            }
          } else {
            // Show error toast
            toast.error(typedResponse.message || 'Login failed!', {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored',
            });
            setError(typedResponse.message || 'An unexpected error occurred.');
          }
        },
      );

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
    return undefined;
  }, [navigate, userRole]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.sendMessage('user-login', email, password);
    } else {
      setError('Electron IPC is not available');
      toast.error('Electron IPC is not available', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };

  return (
    <div className="w-full rounded-sm border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark">
      <div className="w-full flex flex-wrap items-center p-5">
        <div className="w-full  xl:block xl:w-1/2">
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
                <label
                  htmlFor="email"
                  className="mb-2.5 block font-medium text-black dark:text-white"
                >
                  Email
                  <div className="relative">
                    <input
                      id="email"
                      type="text"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </label>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="mb-2.5 block font-medium text-black dark:text-white"
                >
                  Password
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      placeholder="8+ Characters, 1 Capital letter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </label>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="mb-5">
                <input
                  type="submit"
                  value="Sign In"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-blue-700 p-4 text-white transition hover:bg-opacity-90"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
