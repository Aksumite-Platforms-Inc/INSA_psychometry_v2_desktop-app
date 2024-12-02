// src/main/services/fileService.ts
import { IpcMainEvent, app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import ExcelJS from 'exceljs';
import { addBulkUsers } from './api'; // Import the API function

const { dialog, BrowserWindow } = require('electron');

const mainWindow = BrowserWindow.getFocusedWindow();

const getTemplatePath = () => {
  const basePath = app.isPackaged
    ? process.resourcesPath // In packaged app
    : app.getAppPath(); // In development

  return path.join(basePath, 'resources/templates/user-template.xlsx');
};

// Generate Excel Template
const performDownloadTemplate = async (event: IpcMainEvent) => {
  try {
    const TempPath = getTemplatePath();
    if (!fs.existsSync(TempPath)) {
      throw new Error('Template file not found.');
    }
    const { filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Save Template File',
      defaultPath: 'user-template.xlsx',
      filters: [{ name: 'Excel Files', extensions: ['xlsx'] }],
    });

    if (!filePath) {
      throw new Error('No file path selected.');
    }

    fs.copyFileSync(TempPath, filePath);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(TempPath);
    await workbook.xlsx.writeFile(filePath);

    event.reply('template-downloaded', { success: true, filePath });
  } catch (error) {
    event.reply('template-error', {
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    event.reply('template-downloaded', {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Process Uploaded Excel File
const processExcelFile = async (
  event: IpcMainEvent,
  token: number,
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

    // Parse the rows into JSON format
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
            if ('text' in cell) return cell.text.trim();
            if ('richText' in cell) {
              return cell.richText
                .map((part: any) => part.text)
                .join('')
                .trim();
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

    // Send the parsed data to the API
    const apiResponse = await addBulkUsers(token, parsedRows); // Use your API function
    console.log('API response:', apiResponse);

    // Send success response back to the renderer process
    event.reply('excel-file-processed', { success: true, data: apiResponse });
  } catch (error) {
    console.error('Error processing Excel file:', error);
    event.reply('excel-file-processed', {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
export { performDownloadTemplate, processExcelFile };
