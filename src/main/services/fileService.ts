// src/main/services/fileService.ts
import { IpcMainEvent } from 'electron';
import { createExcelTemplate } from './api';

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

export default performDownloadTemplate;
