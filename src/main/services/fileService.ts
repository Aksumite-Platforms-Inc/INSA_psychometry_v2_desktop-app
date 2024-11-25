// src/main/services/fileService.ts
import { IpcMainEvent } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import ExcelJS from 'exceljs';

// Generate Excel Template
const performDownloadTemplate = async (event: IpcMainEvent) => {
  try {
    console.log('Generating template file...'); // Debugging log

    // Create a workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Template');

    // Define the template columns
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 35 },
    ];

    // File path for the template
    const filePath = path.join(process.cwd(), 'user-template.xlsx');

    // Write the workbook to the file
    await workbook.xlsx.writeFile(filePath);

    console.log('Template file created at:', filePath); // Debugging log
    event.reply('template-downloaded', { success: true, filePath });
  } catch (error) {
    console.error('Error generating template file:', error);
    event.reply('template-downloaded', {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Process Uploaded Excel File
const processExcelFile = async (filePath: string): Promise<any> => {
  console.log('Attempting to access file:', filePath); // Debugging log

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found at path: ${filePath}`);
  }

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    // Get the first worksheet
    const worksheet = workbook.worksheets[0];

    // Parse rows into JSON format
    const rows: { name: string; email: string }[] = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        // Skip header row
        const name = row.getCell(1).value?.toString() || '';
        const email = row.getCell(2).value?.toString() || '';

        if (name && email) {
          rows.push({ name, email });
        }
      }
    });

    if (!rows.length) {
      throw new Error('The uploaded file is empty or invalid.');
    }

    console.log('Processed rows:', rows); // Debugging log
    return rows;
  } catch (error) {
    console.error('Error reading Excel file:', error);
    throw new Error('Failed to process the Excel file.');
  }
};

export { performDownloadTemplate, processExcelFile };
