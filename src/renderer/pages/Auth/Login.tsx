import React from 'react';
import LoginForm from '../../components/forms/LoginForm';

function Login() {
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
