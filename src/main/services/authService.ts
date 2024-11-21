import { IpcMainEvent } from 'electron';
import { performLogin } from './api';

const login = async (email: string, password: string, event: IpcMainEvent) => {
  console.log('Login called with:', { email, password });

  if (!email || !password) {
    const response = {
      success: false,
      message: 'Email and password are required',
    };
    console.log('Validation failed:', response);
    event.reply('user-login-success', response);
    return;
  }

  try {
    const response = await performLogin(email, password);
    console.log('Login successful, API response:', response);

    const user = { email }; // Simplify user object for now
    event.reply('user-login-success', { success: true, user });
  } catch (error: any) {
    if (error && error.response) {
      console.error('Login failed:', error.response.data);
    } else {
      console.error('Login failed:', error.message);
    }

    const response = {
      success: false,
      message: 'Login failed. Please check your credentials.',
    };
    event.reply('user-login-success', response);
  }
};
export default login;
