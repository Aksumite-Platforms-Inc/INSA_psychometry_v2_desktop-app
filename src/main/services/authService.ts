import { IpcMainEvent } from 'electron';
import { performLogin, performResetPassword } from './api';

const login = async (email: string, password: string, event: IpcMainEvent) => {
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

const resetPassword = async (email: string, event: IpcMainEvent) => {
  try {
    await performResetPassword(email);
  } catch (error: any) {
    const response = {
      success: false,
      message: error,
    };
    event.reply('reset-password-success', response);
  }
};

export { login, resetPassword };
