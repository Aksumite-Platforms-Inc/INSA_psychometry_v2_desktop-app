// src/main/services/fileService.ts
import { IpcMainEvent } from 'electron';
import * as fs from 'fs';
import * as xlsx from 'xlsx';
import { createExcelTemplate, addBulkUsers } from './api';

const performDownloadTemplate = async (event: IpcMainEvent) => {
  try {
    console.log('Generating template file...'); // Debugging log
    const filePath = await createExcelTemplate(); // Simulated function to generate file
    console.log('Template file created at:', filePath);
    event.reply('template-downloaded', { success: true });
  } catch (error) {
    console.error('Error generating template file:', error);
    event.reply('template-downloaded', {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

const processExcelFile = async (filePath: string): Promise<any> => {
  if (!fs.existsSync(filePath)) {
    throw new Error('File not found.');
  }

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Assuming the first sheet is used
  const sheet = workbook.Sheets[sheetName];

  // Convert the sheet data to JSON
  const rows = xlsx.utils.sheet_to_json(sheet);

  if (!rows || rows.length === 0) {
    throw new Error('The uploaded file is empty or invalid.');
  }

  // Validate and prepare data for the API
  const users = rows.map((row: any) => ({
    name: row.Name,
    email: row.Email,
  }));

  // Return the Promise directly without using `await`
  return addBulkUsers(users);
};

export { performDownloadTemplate, processExcelFile };
