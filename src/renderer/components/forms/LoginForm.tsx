import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Logo from '../../assets/Images/logo/logo-dark.svg';
import 'react-toastify/dist/ReactToastify.css';

interface LoginResponse {
  success: boolean;
  message?: string;
  user?: {
    email: string;
    token?: string;
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
          // console.log('Received response from main process:', response);

          const typedResponse = response as LoginResponse & { token: string };
          if (typedResponse.success) {
            // console.log('Login successful:', typedResponse.user);

            // Save token in localStorage
            if (typedResponse.token) {
              localStorage.setItem('authToken', typedResponse.token);
              toast.success('Login successful!');

              // console.log('Token saved to localStorage:', typedResponse.token);
            }

            navigate('/tests');
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
    <div className="rounded-sm border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-wrap items-center p-5">
        <div className="hidden w-full xl:block xl:w-1/2">
          <div className="py-17.5 px-26 text-center">
            <Link className="mb-5.5 inline-block" to="/">
              <img className="hidden dark:block" src={Logo} alt="Logo" />
            </Link>
            <p className="2xl:px-20">INSA Personality Test</p>
          </div>
        </div>

        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <span className="mb-1.5 block font-medium">Welcome Back</span>
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Sign In to INSA | Audit Dashboard
            </h2>

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
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-gray-900 dark:focus:border-primary"
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
                      type="password"
                      placeholder="6+ Characters, 1 Capital letter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-gray-900 dark:focus:border-primary"
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
