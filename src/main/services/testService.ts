import { BrowserWindow, IpcMainEvent, app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { uploadScreenshot } from './api';

function setupUploadsDir() {
  const writablePath = app.getPath('userData'); // Or 'temp'
  const uploadsDir = path.join(writablePath, 'uploads');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  return uploadsDir;
}
const takeScreenshotAndUpload = async (
  mainWindow: BrowserWindow,
  testId: string,
  event: IpcMainEvent,
  token: string,
) => {
  const screenshotPath = path.join(setupUploadsDir(), `${testId}.png`);
  const uploadDir = path.dirname(screenshotPath);

  // Ensure the upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Function to set a timer for deleting the file
  const setFileDeletionTimer = (filePath: string) => {
    setTimeout(
      () => {
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (err) {
            if (err instanceof Error) {
              console.error(`Error removing file: ${err.message}`);
            } else {
              console.error('Error removing file:', err);
            }
          }
        }
      },
      10 * 60 * 1000,
    ); // 10 minutes in milliseconds
  };

  const uploadFile = async (filePath: string) => {
    try {
      const response = await uploadScreenshot(filePath, testId, token);

      if (response.status === 200) {
        fs.unlinkSync(filePath); // Remove the image file after successful upload
        event.reply('screenshot-taken', {
          status: 'success',
          message: 'Screenshot uploaded successfully',
        });
      } else {
        const retry = await mainWindow.webContents.executeJavaScript(
          `window.confirm('Failed to upload, try again?')`,
        );
        if (retry) {
          await uploadFile(filePath);
        } else {
          event.reply('screenshot-taken', {
            status: 'error',
            message: 'User declined to retry upload',
          });
        }
      }
      // Check if the screenshot already exists
      if (fs.existsSync(screenshotPath)) {
        const alreadyTaken = await mainWindow.webContents.executeJavaScript(
          `window.confirm('Test already exists. Do you want to send it again?')`,
        );

        if (alreadyTaken) {
          await uploadFile(screenshotPath);
        } else {
          event.reply('screenshot-taken', {
            status: 'cancelled',
            message: 'User chose not to resend the existing screenshot',
          });
        }
      }
    } catch (error) {
      console.error('Error uploading screenshot:', error);
      const retry = await mainWindow.webContents.executeJavaScript(
        `window.confirm('An error occurred while uploading, try again?')`,
      );
      if (retry) {
        await uploadFile(filePath);
      } else {
        event.reply('screenshot-taken', {
          status: 'error',
          message: 'User declined to retry upload',
        });
      }
    }
  };

  // Check if the screenshot already exists
  if (fs.existsSync(screenshotPath)) {
    const alreadyTaken = await mainWindow.webContents.executeJavaScript(
      `window.confirm('Test already exists. Do you want to send it again?')`,
    );

    if (alreadyTaken) {
      await uploadFile(screenshotPath);
    } else {
      event.reply('screenshot-taken', {
        status: 'cancelled',
        message: 'User chose not to resend the existing screenshot',
      });
    }
    return;
  }

  try {
    const iframeRect = { x: 600, y: 80, width: 1000, height: 750 };

    if (mainWindow) {
      // Capture a new screenshot
      const image = await mainWindow.webContents.capturePage(iframeRect);
      fs.writeFileSync(screenshotPath, image.toPNG());
      console.log(`New screenshot saved at: ${screenshotPath}`);

      // Set a timer to delete the screenshot after 10 minutes
      setFileDeletionTimer(screenshotPath);

      await uploadFile(screenshotPath);
    } else {
      console.error('Error: mainWindow is not available');
      event.reply('screenshot-taken', {
        status: 'error',
        message: 'mainWindow is not available',
      });
    }
  } catch (error) {
    console.error('Error taking screenshot:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    event.reply('screenshot-taken', { status: 'error', message: errorMessage });
  }
};

export default takeScreenshotAndUpload;
