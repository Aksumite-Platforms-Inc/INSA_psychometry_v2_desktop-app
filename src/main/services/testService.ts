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

const takeScreenshotAndUpload = async (
  mainWindow: BrowserWindow,
  testId: string,
  dimensions: { width: number; height: number },
  event: IpcMainEvent,
  token: string,
): Promise<void> => {
  if (!token) {
    console.error('Authorization token is missing');
    event.reply('screenshot-taken', {
      status: 'error',
      message: 'Authorization token is missing',
    });
    return;
  }

  const uploadsDir = setupUploadsDir();
  const screenshotPath = path.join(uploadsDir, `${testId}.png`);

  const setFileDeletionTimer = (filePath: string): void => {
    setTimeout(
      () => {
        if (typeof filePath === 'string' && fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (error) {
            console.error('Error deleting file:', error);
          }
        }
      },
      10 * 60 * 1000, // 10 minutes
    );
  };

  const uploadFile = async (filePath: string): Promise<void> => {
    try {
      console.log('Uploading with token:', token);
      const response = await uploadScreenshot(filePath, testId, token);

      if (response.status === 200) {
        console.log(`Screenshot uploaded successfully: ${filePath}`);
        fs.unlinkSync(filePath);
        event.reply('screenshot-taken', {
          status: 'success',
          message: 'Screenshot uploaded successfully',
        });
      } else {
        const retry = await mainWindow.webContents.executeJavaScript(
          `window.confirm('Upload failed. Would you like to retry?')`,
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
        `window.confirm('An error occurred during upload. Try again?')`,
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

  try {
    // Use dimensions sent from the renderer process
    const iframeRect = {
      x: 0,
      y: 0,
      width: dimensions.width,
      height: dimensions.height,
    };

    console.log('Taking screenshot with rect:', iframeRect);

    if (mainWindow) {
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
          return;
        }
      }
      const image = await mainWindow.webContents.capturePage(iframeRect);
      fs.writeFileSync(screenshotPath, image.toPNG());
      console.log(`Screenshot saved at: ${screenshotPath}`);

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
    event.reply('screenshot-taken', {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export default takeScreenshotAndUpload;
