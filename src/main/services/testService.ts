import { BrowserWindow, IpcMainEvent, app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { uploadScreenshot } from './api';

function setupUploadsDir(): string {
  try {
    const writablePath = app.isPackaged
      ? path.join(process.resourcesPath, 'upload') // In packaged app
      : path.join(app.getAppPath(), 'upload'); // In development

    if (!fs.existsSync(writablePath)) {
      fs.mkdirSync(writablePath, { recursive: true });
    }

    return writablePath;
  } catch (error) {
    console.error('Error setting up uploads directory:', error);
    throw new Error('Failed to create uploads directory');
  }
}

const checkResult = (testId: string, event: IpcMainEvent): void => {
  const uploadsDir = setupUploadsDir();
  const screenshotPath = path.join(uploadsDir, `${testId}.png`);

  if (fs.existsSync(screenshotPath)) {
    console.log(`Test result exists for testId: ${testId}`);
    event.reply('test-result-exists', true);
  } else {
    console.log(`No test result found for testId: ${testId}`);
    event.reply('test-result-exists', false);
  }
};

const deleteResult = (testId: string, event: IpcMainEvent): void => {
  const uploadsDir = setupUploadsDir();
  const screenshotPath = path.join(uploadsDir, `${testId}.png`);

  if (fs.existsSync(screenshotPath)) {
    try {
      fs.unlinkSync(screenshotPath);
      console.log(`Deleted test result for testId: ${testId}`);
      event.reply('delete-test-result-success', true);
    } catch (error) {
      console.error('Error deleting test result:', error);
      event.reply('delete-test-result-failure', error.message);
    }
  } else {
    console.log(`No test result found to delete for testId: ${testId}`);
    event.reply('delete-test-result-success', false); // If already gone, treat as success
  }
};

const resendResult = async (
  testId: string,
  token: string,
  event: IpcMainEvent,
): Promise<void> => {
  const uploadsDir = setupUploadsDir();
  const screenshotPath = path.join(uploadsDir, `${testId}.png`);

  if (fs.existsSync(screenshotPath)) {
    try {
      console.log(`Resending result for test ${testId}`);
      const response = await uploadScreenshot(screenshotPath, testId, token);
      console.log('Upload response:', response); // Log the entire response object

      if (response.status === 200) {
        console.log(`Successfully resent result for test ${testId}`);
        event.reply('resend-test-result-success');
      } else {
        console.error('Upload failed:', response.statusText || 'Unknown error');
        event.reply(
          'resend-test-result-failure',
          response.statusText || 'Upload failed.',
        );
      }
    } catch (error) {
      console.error('Error resending result:', error);
      event.reply('resend-test-result-failure', error.message);
    }
  } else {
    console.error('No existing result found to resend.');
    event.reply('resend-test-result-failure', 'No result exists to resend.');
  }
};

const endTest = async (
  mainWindow: BrowserWindow,
  testId: string,
  dimensions: { width: number; height: number },
  token: string,
  event: IpcMainEvent,
): Promise<void> => {
  const uploadsDir = setupUploadsDir();
  const screenshotPath = path.join(uploadsDir, `${testId}.png`);

  const setFileDeletionTimer = (filePath: string): void => {
    setTimeout(
      () => {
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            console.log(`Screenshot deleted: ${filePath}`);
          } catch (error) {
            console.error('Error deleting file:', error);
          }
        }
      },
      10 * 60 * 1000,
    ); // 10 minutes
  };

  try {
    const iframeRect = {
      x: 0,
      y: 0,
      width: dimensions.width,
      height: dimensions.height,
    };
    console.log(`Taking screenshot with rect:`, iframeRect);

    const image = await mainWindow.webContents.capturePage(iframeRect);
    fs.writeFileSync(screenshotPath, image.toPNG());
    console.log(`Screenshot saved at: ${screenshotPath}`);

    setFileDeletionTimer(screenshotPath);

    try {
      const response = await uploadScreenshot(screenshotPath, testId, token);
      if (response.status === 200) {
        console.log('Screenshot uploaded successfully');
        fs.unlinkSync(screenshotPath);
        event.reply('screenshot-complete');
      } else {
        console.error('Upload failed:', response.statusText);
        event.reply('screenshot-failed', 'Upload failed.');
      }
    } catch (uploadError) {
      console.error('Error during upload:', uploadError);
      event.reply('screenshot-failed', 'An error occurred during upload.');
    }
  } catch (error) {
    console.error('Error taking screenshot:', error);
    if (error instanceof Error) {
      event.reply('screenshot-failed', error.message);
    } else {
      event.reply('screenshot-failed', 'An unknown error occurred.');
    }
  }
};

export { checkResult, deleteResult, resendResult, endTest };
