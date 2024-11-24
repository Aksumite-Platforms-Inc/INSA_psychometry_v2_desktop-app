import { IpcMainEvent } from 'electron';
import { CreateBranch, GetAllBranches, DeleteBranch } from './api';

const performCreateBranch = async (
  event: IpcMainEvent,
  name: string,
  orgId: number,
  branchName: string,
  token: string,
) => {
  try {
    await CreateBranch(orgId, name, branchName, token);
    console.log('Branch created successfully:', name);

    event.reply('branch-created', {
      success: true,
      message: 'Branch created successfully',
    });
  } catch (error: any) {
    if (error && error.response) {
      console.error('Branch creation failed:', error.response.data);
    } else {
      console.error('Branch creation failed:', error.message);
    }

    event.reply('branch-created', {
      success: false,
      message: 'Branch creation failed. Please try again.',
    });
  }
};

const performGetAllBranches = async (
  orgId: number,
  token: string,
  event: IpcMainEvent,
) => {
  try {
    const branches = await GetAllBranches(orgId, token);

    // Transform or filter data if necessary
    const transformedBranches = branches.map((branch: any) => ({
      id: branch.id,
      name: branch.name || 'N/A', // Handle missing names
      orgId: branch.org_id,
      location: branch.location,
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
  event: IpcMainEvent,
  orgId: number,
  branchId: number,
  token: string,
) => {
  try {
    await DeleteBranch(orgId, branchId, token);
    console.log('Branch deleted successfully:', branchId);

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

export { performCreateBranch, performGetAllBranches, performDeleteBranch };
