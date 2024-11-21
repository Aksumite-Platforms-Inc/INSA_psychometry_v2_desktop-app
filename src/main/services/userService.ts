import { IpcMainEvent } from 'electron';
import { updateProfile } from './api';

const PerformUpdateProfile = async (
  fullName: string,
  email: string,
  password: string,
  event: IpcMainEvent,
) => {
  if (!email || !fullName || password) {
    const response = {
      success: false,
      message: 'Email, full name, and password are required',
    };
    console.log('Validation failed:', response);
    event.reply('user-login-success', response);
    return;
  }

  try {
    const response = await updateProfile(fullName, email, password);
    console.log('Profile updated successfully:', response);

    event.reply('user-login-success', {
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    if (error && error.response) {
      console.error('Profile update failed:', error.response.data);
    } else {
      console.error('Profile update failed:', error.message);
    }

    const response = {
      success: false,
      message: 'Profile update failed. Please check your credentials.',
    };
    event.reply('user-login-success', response);
  }
};

export default PerformUpdateProfile;
