// src/main/services/fileService.ts
import { IpcMainEvent } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import ExcelJS from 'exceljs';

const { dialog } = require('electron');

// Generate Excel Template
const performDownloadTemplate = async (event: IpcMainEvent) => {
  try {
    const appDataPath = path.join(
      path.resolve(__dirname, '../../'), // Navigate to the root of the project
      'resources/templates/user-template.xlsx', // Append the file path
    );

    console.log('Preparing to download template file...'); // Debugging log

    // Check if the template file exists in the app data
    if (!fs.existsSync(appDataPath)) {
      throw new Error('Template file not found in app data.');
    }

    // Open a dialog to let the user choose where to save the file
    const { filePath } = await dialog.showSaveDialog({
      title: 'Save Template File',
      defaultPath: 'user-template.xlsx',
      filters: [{ name: 'Excel Files', extensions: ['xlsx'] }],
    });

    if (!filePath) {
      throw new Error('No file path selected.');
    }

    // Copy the template file to the chosen location
    fs.copyFileSync(appDataPath, filePath);

    console.log('Template file copied to:', filePath); // Debugging log

    // Create a new workbook instance
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(appDataPath);

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
const processExcelFile = async (
  event: IpcMainEvent,
  filePath: string,
): Promise<void> => {
  console.log('Attempting to access file:', filePath);

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found at path: ${filePath}`);
  }

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    console.log(
      'Available sheets:',
      workbook.worksheets.map((ws) => ws.name),
    );

    const worksheet = workbook.getWorksheet(1); // Access the first sheet
    if (!worksheet) {
      throw new Error('No worksheet found in the file.');
    }

    const rows = worksheet.getSheetValues();
    if (!rows || rows.length <= 1) {
      throw new Error('The worksheet is empty or has no data.');
    }

    const parsedRows = rows
      .slice(1) // Skip the header row
      .filter((row) => {
        if (Array.isArray(row)) {
          return row[1] && row[2]; // Check required columns
        }
        if (typeof row === 'object' && row !== null) {
          return row['1'] && row['2']; // Check required columns by key
        }
        return false;
      })
      .map((row) => {
        const getCellValue = (cell: any): string => {
          if (cell === null || cell === undefined) return ''; // Handle null/undefined
          if (typeof cell === 'string' || typeof cell === 'number') {
            return cell.toString().trim();
          }
          if (typeof cell === 'object') {
            // Handle complex cell types (e.g., hyperlinks, rich text)
            if ('text' in cell) return cell.text.trim(); // Example: Handle hyperlink text
            if ('richText' in cell) {
              return cell.richText
                .map((part: any) => part.text)
                .join('')
                .trim(); // Handle rich text
            }
          }
          return ''; // Fallback for unsupported types
        };

        return {
          name: getCellValue(row && (Array.isArray(row) ? row[1] : row['1'])),
          email: getCellValue(row && (Array.isArray(row) ? row[2] : row['2'])),
        };
      });

    if (!parsedRows.length) {
      throw new Error('No valid rows found in the file.');
    }

    console.log('Parsed rows:', parsedRows);
    event.reply('excel-file-processed', { success: true, data: parsedRows });
  } catch (error) {
    console.error('Error processing Excel file:', error);
    event.reply('excel-file-processed', {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export { performDownloadTemplate, processExcelFile };
