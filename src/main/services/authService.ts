import { IpcMainEvent } from 'electron';
import { performLogin, performResetPassword } from './api';
import LoginResponse from '../types/auth.type';

// eslint-disable-next-line consistent-return
const login = async (email: string, password: string, event: IpcMainEvent) => {
  try {
    const apiresponse = await performLogin(email, password);
    const response: LoginResponse = {
      success: true,
      token: apiresponse.data.data.token,
      message: apiresponse.data.data.message,
    };
    return response;
  } catch (error: any) {
    const response = {
      token: '',
      success: false,
      message: error.message || 'Login failed.',
    };
    event.reply('user-login-success', response);
  }
};

const resetPassword = async (email: string, event: IpcMainEvent) => {
  try {
    await performResetPassword(email);
    const response = {
      success: true,
      message: 'Password reset email sent.',
    };
    event.reply('reset-password-success', response);
  } catch (error: any) {
    const response = {
      success: false,
      message: error.message || 'Password reset failed.',
    };
    event.reply('reset-password-success', response);
  }
};

export { login, resetPassword };
