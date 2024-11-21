import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/forms/LoginForm';

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      // colsole log the token saved inside localstorage
      // console.log('LocalToken:', localStorage.getItem('authToken'));

      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <h2 className="text-center text-2xl font-semibold mb-6">Login</h2>
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
