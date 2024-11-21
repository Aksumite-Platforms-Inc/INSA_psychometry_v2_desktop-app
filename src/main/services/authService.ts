import { IpcMainEvent } from 'electron';
import { performLogin } from './api';

const login = async (email: string, password: string, event: IpcMainEvent) => {
  console.log('Login called with:', { email, password });

  try {
    const token = await performLogin(email, password);
    console.log('Token retrieved from API:', token);

    const user = { email };
    event.reply('user-login-success', { success: true, user, token });
  } catch (error: any) {
    const response = {
      success: false,
      message: 'Login failed. Please check your credentials.',
    };
    event.reply('user-login-success', response);
  }
};

export default login;
