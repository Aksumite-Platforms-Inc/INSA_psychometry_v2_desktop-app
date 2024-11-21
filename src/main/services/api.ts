// src/main/services/api.ts
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import Store from 'electron-store';

const store = new Store<{ token: string }>(); // Define the structure of stored data

const uploadScreenshot = async (screenshotPath: string, testId: string) => {
  const formData = new FormData();
  formData.append('image', fs.createReadStream(screenshotPath));
  formData.append('test_id', testId);

  const token = store.get('token'); // Use Electron Store to retrieve token
  if (!token) {
    throw new Error('Authorization token is missing.');
  }

  const response = await axios.post(
    'http://localhost:8080/api/v1/organization/submit',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response;
};

const performLogin = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      'http://localhost:8080/api/v1/sso/login',
      {
        email,
        password,
      },
    );

    const {
      data: { token },
    } = response;

    if (!token) {
      throw new Error('Token not returned from API.');
    }

    store.set('token', token); // Store token securely
    console.log('Token stored successfully.');
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Login failed:', error.response.data);
      throw new Error(error.response.data?.message || 'Login failed.');
    } else {
      console.error('Login failed:', (error as Error).message);
      throw new Error('An unexpected error occurred during login.');
    }
  }
};

export { uploadScreenshot, performLogin };
