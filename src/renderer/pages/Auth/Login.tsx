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
    <div className="w-auto min-h-screen flex items-center justify-center bg-gray-100">
      <div className=" w-[80vw] max-w-xl">
        {/* <h2 className="w-full text-center text-2xl font-bold mb-9">Welcome</h2> */}
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
