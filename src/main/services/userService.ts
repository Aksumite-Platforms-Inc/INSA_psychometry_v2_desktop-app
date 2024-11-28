import { IpcMainEvent } from 'electron';
import {
  updateProfile,
  GetAllOrgMembers,
  DeleteOrgMember,
  GetAllBranchMembers,
} from './api';

const PerformUpdateProfile = async (
  fullName: string,
  email: string,
  password: string,
  event: IpcMainEvent,
  token: string,
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
    const response = await updateProfile(fullName, email, password, token);
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

const performGetAllMembers = async (
  orgId: number,
  token: string,
  event: IpcMainEvent,
) => {
  try {
    const members = await GetAllOrgMembers(orgId, token);

    // Transform or filter data if necessary
    const transformedMembers = members.map((member: any) => ({
      id: member.id,
      name: member.name || 'N/A', // Handle missing names
      email: member.email,
      role: member.role,
      organizationId: member.org_id,
      branchId: member.branch_id,
      createdAt: member.created_at,
      activationCode: member.activation_code,
    }));

    // Reply to the renderer process with the success response
    event.reply('members-listed', {
      success: true,
      message: 'Members listed successfully',
      data: transformedMembers,
    });
  } catch (error) {
    console.error('Error fetching members:', error);

    // Reply to the renderer process with the error response
    event.reply('members-listed', {
      success: false,
      message:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    });
  }
};
const performGetBranchMembers = async (
  orgId: number,
  branchId: number,
  token: string,
  event: IpcMainEvent,
) => {
  try {
    console.log('Fetching branch members:', { orgId, branchId, token }); // Debugging log

    // Call the API to get branch members
    const members = await GetAllBranchMembers(orgId, branchId, token);
    console.log('Fetched branch members:', members);

    // Reply with the success response
    event.reply('branch-members-listed', {
      success: true,
      data: members,
    });
  } catch (error: any) {
    console.error('Error fetching branch members:', error.message);

    // Reply with the failure response
    event.reply('branch-members-listed', {
      success: false,
      message: error.message || 'Failed to fetch branch members.',
    });
  }
};

const performDeleteMember = async (
  event: IpcMainEvent,
  orgId: number,
  userId: number,
  token: string,
) => {
  try {
    const response = await DeleteOrgMember(orgId, userId, token);
    event.reply('member-deleted', response);
  } catch (error: any) {
    event.reply('member-deleted', {
      success: false,
      message: error.message,
    });
  }
};
export {
  PerformUpdateProfile,
  performGetAllMembers,
  performDeleteMember,
  performGetBranchMembers,
};
