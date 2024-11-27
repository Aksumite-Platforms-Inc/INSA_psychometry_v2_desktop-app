import axios from 'axios';
import FormData from 'form-data';
import path from 'path';
import fs from 'fs';
import { IpcMainEvent, app } from 'electron';

// Define the base URL as a variable for flexibility
const API_BASE_URL = 'http://localhost:8080/api/v1';

// Set the default base URL for Axios
axios.defaults.baseURL = API_BASE_URL;

// File Section
const addBulkUsers = async (users: { name: string; email: string }[]) => {
  const response = await axios.post('/users/bulk-add', { users });
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to add users.');
  }
  return response.data;
};
const uploadScreenshot = async (
  screenshotPath: string,
  testId: string,
  token: string,
) => {
  const formData = new FormData();
  formData.append('image', fs.createReadStream(screenshotPath));
  formData.append('test_id', testId);

  if (!token) {
    throw new Error('Authorization token is missing.');
  }

  const response = await axios.post('/organization/submit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

// Auth Section
const logout = async (event?: IpcMainEvent) => {
  console.log('Logging out the user...');
  // Clear local storage and notify the renderer process
  localStorage.removeItem('authToken');
  if (event) {
    event.reply('user-logout-success', {
      success: true,
      message: 'User logged out successfully',
    });
  }
};

const performLogin = async (
  email: string,
  password: string,
): Promise<string> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/sso/login`, // Use the base URL variable
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

const updateProfile = async (
  fullName: string,
  email: string,
  password: string,
  token: string,
) => {
  try {
    const response = await axios.put(
      'organization/members/profile',
      {
        fullName,
        email,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Profile update failed:', error.response.data);
      throw new Error(error.response.data?.message || 'Profile update failed.');
    } else {
      console.error('Unexpected error:', (error as Error).message);
      throw new Error('An unexpected error occurred during profile update.');
    }
  }
};

// Users Section
const GetAllOrgMembers = async (orgId: number, token: string): Promise<any> => {
  if (!token) {
    throw new Error('Authorization token is missing.');
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}/organization/${orgId}/members`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data?.success) {
      return response.data.data; // Return the members array
    }
    throw new Error('Failed to fetch members from the API.');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch members.',
      );
    }
    throw new Error('An unexpected error occurred.');
  }
};

const DeleteOrgMember = async (
  orgId: number,
  memberId: number,
  token: string,
) => {
  if (!token) {
    throw new Error('Authorization token is missing.');
  }

  try {
    const response = await axios.delete(
      `${API_BASE_URL}/organization/${orgId}/members/${memberId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 'Failed to delete member.',
      );
    }
    throw new Error('An unexpected error occurred.');
  }
};

// Branches Section

const CreateBranch = async (orgId: number, name: string, token: string) => {
  console.log('Sending request to create branch:', { orgId, name, token });

  try {
    const response = await axios.post(
      `${API_BASE_URL}/organization/${orgId}/branches`,
      { name },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log('CreateBranch API Response:', response.data);
    return response.data.data;
  } catch (error: any) {
    console.error('CreateBranch API Error:', error.message);
    throw new Error(error.response?.data?.message || 'Branch creation failed.');
  }
};

const GetAllBranches = async (token: string): Promise<any> => {
  if (!token) {
    throw new Error('Authorization token is missing.');
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/organization/branches`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data?.success) {
      return response.data.data; // Return the branches array
    }
    throw new Error('Failed to fetch branches from the API.');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch branchess.',
      );
    }
    throw new Error('An unexpected error occurred.');
  }
};
const GetBranchById = async (
  orgId: number,
  branchId: number,
  token: string,
): Promise<any> => {
  if (!token) {
    throw new Error('Authorization token is missing.');
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}/organization/${orgId}/branches/${branchId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data?.success) {
      return response.data.data; // Return the branch details
    }
    throw new Error('Failed to fetch branch details from the API.');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'API Error in GetBranchById:',
        error.response?.data || error.message,
      );
      throw new Error(
        error.response?.data?.message || 'Failed to fetch branch details.',
      );
    }
    throw new Error('An unexpected error occurred.');
  }
};

const DeleteBranch = async (branchId: number, token: string) => {
  if (!token) {
    throw new Error('Authorization token is missing.');
  }

  try {
    const response = await axios.delete(
      `${API_BASE_URL}/organization/branches/${branchId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 'Failed to delete branch.',
      );
    }
    throw new Error('An unexpected error occurred.');
  }
};

const createExcelTemplate = async (): Promise<string> => {
  const outputPath = path.join(app.getPath('downloads'), 'UserTemplate.xlsx');
  console.log('Template file will be saved at:', outputPath); // Debugging log

  // Generate the Excel template (simplified for example)
  await fs.promises.writeFile(outputPath, 'Template data here...');
  return outputPath;
};

export {
  uploadScreenshot,
  performLogin,
  updateProfile,
  addBulkUsers,
  GetAllOrgMembers,
  DeleteOrgMember,
  CreateBranch,
  GetAllBranches,
  DeleteBranch,
  GetBranchById,
  logout,
  createExcelTemplate,
};
