import { IpcMainEvent } from 'electron';
import {
  CreateBranch,
  GetAllBranches,
  DeleteBranch,
  GetBranchById,
  AssignBranchAdmin,
  GetAllBranchMembers, // Import the AssignBranchAdmin API function
} from './api';

const performCreateBranch = async (
  event: IpcMainEvent,
  orgId: number,
  name: string,
  token: string,
) => {
  console.log('Attempting to create branch:', { orgId, name, token });
  try {
    const newBranch = await CreateBranch(orgId, name, token);
    console.log('Branch created successfully in API:', newBranch);

    event.reply('branch-created', {
      success: true,
      message: 'Branch created successfully',
      data: newBranch,
    });
  } catch (error: any) {
    console.error('Branch creation failed in API:', error.message);

    event.reply('branch-created', {
      success: false,
      message: error.message || 'Branch creation failed. Please try again.',
    });
  }
};

const performGetAllBranches = async (token: string, event: IpcMainEvent) => {
  try {
    const branches = await GetAllBranches(token);

    // Transform or filter data if necessary
    const transformedBranches = branches.map((branch: any) => ({
      id: branch.id,
      name: branch.name || 'N/A', // Handle missing names
      orgId: branch.org_id,
      createdAt: branch.created_at,
    }));

    event.reply('branches-listed', {
      success: true,
      data: transformedBranches,
    });
  } catch (error) {
    console.error('Failed to fetch branches:', error);

    event.reply('branches-listed', {
      success: false,
      message:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    });
  }
};

const performDeleteBranch = async (
  branchId: number,
  token: string,
  event: IpcMainEvent,
) => {
  try {
    await DeleteBranch(branchId, token);
    event.reply('branch-deleted', {
      success: true,
      message: 'Branch deleted successfully',
    });
  } catch (error: any) {
    if (error && error.response) {
      console.error('Branch deletion failed:', error.response.data);
    } else {
      console.error('Branch deletion failed:', error.message);
    }

    event.reply('branch-deleted', {
      success: false,
      message: 'Branch deletion failed. Please try again.',
    });
  }
};

const performGetBranchDetails = async (
  event: IpcMainEvent,
  orgId: number,
  branchId: number,
  token: string,
) => {
  try {
    const branchDetails = await GetBranchById(orgId, branchId, token);

    event.reply('branch-details-fetched', {
      success: true,
      data: branchDetails,
    });
  } catch (error) {
    console.error('Failed to fetch branch details:', error);

    event.reply('branch-details-fetched', {
      success: false,
      message:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    });
  }
};
const performGetBranchMembers = async (
  event: IpcMainEvent,
  orgId: number,
  branchId: number,
  token: string,
) => {
  console.log('Fetching branch members:', { orgId, branchId, token }); // Debugging log

  try {
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

const performAssignBranchAdmin = async (
  event: IpcMainEvent,
  orgId: number,
  branchId: number,
  email: string,
  token: string,
) => {
  try {
    console.log('Assigning admin:', { orgId, branchId, email }); // Debugging log
    await AssignBranchAdmin(orgId, branchId, email, token);

    event.reply('branch-admin-assigned', {
      success: true,
      message: 'Admin assigned successfully.',
    });
  } catch (error: any) {
    console.error('Failed to assign branch admin:', error.message);

    event.reply('branch-admin-assigned', {
      success: false,
      message: error.message || 'Failed to assign branch admin.',
    });
  }
};

export {
  performCreateBranch,
  performGetAllBranches,
  performDeleteBranch,
  performGetBranchDetails,
  performGetBranchMembers, // Export the new function
  performAssignBranchAdmin, // Export the new function
};
