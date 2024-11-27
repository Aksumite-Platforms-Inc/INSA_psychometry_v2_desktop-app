import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/forms/LoginForm';

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="w-auto min-h-screen flex items-center justify-center bg-gray-100">
      <div className=" w-[80vw] max-w-xl">
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
