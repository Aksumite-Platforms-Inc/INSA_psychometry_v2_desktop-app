// src/main/services/api.ts
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
// import Store from 'electron-store';

// const store = new Store<{ token: string }>(); // Define the structure of stored data

const uploadScreenshot = async (screenshotPath: string, testId: string) => {
  const formData = new FormData();
  formData.append('image', fs.createReadStream(screenshotPath));
  formData.append('test_id', testId);

  const token = localStorage.getItem('token');
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

const performLogin = async (
  email: string,
  password: string,
): Promise<string> => {
  try {
    const response = await axios.post(
      'http://localhost:8080/api/v1/sso/login',
      { email, password },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('API response:', response.data);

    // Extract the token from the response
    const token = response.data?.data?.token;

    if (!token) {
      console.error('Token not returned in API response:', response.data);
      throw new Error('Token not returned from API.');
    }

    return token; // Return the token to the caller
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Login failed:', error.response.data);
      throw new Error(error.response.data?.message || 'Login failed.');
    } else {
      console.error('Unexpected error:', (error as Error).message);
      throw new Error('An unexpected error occurred during login.');
    }
  }
};

export { uploadScreenshot, performLogin };
