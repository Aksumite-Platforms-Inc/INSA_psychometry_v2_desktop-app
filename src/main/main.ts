/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { app, BrowserWindow, shell, ipcMain, IpcMainEvent } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import path from 'path';
// import fs from 'fs';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import {
  resendResult,
  endTest,
  deleteResult,
  checkResult,
  checkIfTestTaken,
} from './services/testService';
import login from './services/authService';
import {
  performDownloadTemplate,
  processExcelFile,
} from './services/fileService';
import {
  performCreateBranch,
  performDeleteBranch,
  performGetAllBranches,
  performGetBranchDetails,
  performAssignBranchAdmin,
  performGetBranchMembers,
} from './services/branchService';
import {
  PerformUpdateProfile,
  performGetAllMembers,
  // performGetBranchMembers,
  performDeleteMember,
} from './services/userService';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1200,
    height: 800,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      nodeIntegration: false,
      contextIsolation: true, // Keep this true for security with contextBridge
      webSecurity: false, // Disable same-origin restrictions
    },
    // fullscreen: true, // Add this line to make the window fullscreen
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

// screeen shot taker
ipcMain.on('check-test-result', (event, testId: string) => {
  checkResult(testId, event);
});

ipcMain.on('delete-test-result', (event, testId: string) => {
  deleteResult(testId, event);
});

ipcMain.on(
  'resend-test-result',
  async (event, testId: string, token: string) => {
    await resendResult(testId, token, event);
  },
);

ipcMain.on('take-screenshot', async (event, { testId, dimensions, token }) => {
  if (mainWindow) {
    await endTest(mainWindow, testId, dimensions, token, event);
  } else {
    console.error('mainWindow is not defined');
    event.reply('take-screenshot-error', {
      success: false,
      message: 'Main window is not available.',
    });
  }
});
ipcMain.on(
  'check-if-test-taken',
  async (event: IpcMainEvent, { memberId, testId, token }) => {
    try {
      await checkIfTestTaken(memberId, testId, token, event);
    } catch (error) {
      console.error('Error in check-if-test-taken handler:', error);
    }
  },
);

// Login Section

ipcMain.on('user-login', async (event, email, password) => {
  console.log('Received login attempt:', { email, password });

  try {
    await login(email, password, event);
  } catch (error) {
    console.error('Error in login handler:', error);

    event.reply('user-login-success', {
      success: false,
      message: 'An internal error occurred.',
    });
  }
});

// File Section
ipcMain.on(
  'upload-excel-template',
  async (event: IpcMainEvent, { token, filePath }) => {
    console.log('Received file path:', filePath); // Log file path
    try {
      const result = await processExcelFile(event, token, filePath);
      event.reply('excel-template-uploaded', {
        success: true,
        message: 'Users added successfully!',
        data: result,
      });
    } catch (error: any) {
      console.error('Error processing Excel file:', error.message);
      event.reply('excel-template-uploaded', {
        success: false,
        message:
          error.message || 'An error occurred while processing the file.',
      });
    }
  },
);

// Members Section

ipcMain.on(
  'update-profile',
  async (
    event,
    fullName: string,
    email: string,
    password: string,
    token: string,
  ) => {
    console.log('Received profile update:', { fullName, email, password });
    try {
      // Perform profile update here
      await PerformUpdateProfile(fullName, email, password, event, token);

      event.reply('profile-updated', {
        success: true,
        user: { email },
      });
    } catch (error) {
      console.error('Error in profile update:', error);

      event.reply('profile-updated', {
        success: false,
        message: 'An internal error occurred.',
      });
    }
  },
);
ipcMain.on('get-members', async (event: IpcMainEvent, { orgId, token }) => {
  await performGetAllMembers(orgId, token, event);
});
ipcMain.on('get-branch-members', (event, { orgId, branchId, token }) => {
  performGetBranchMembers(event, orgId, branchId, token);
});

ipcMain.on(
  'delete-member',
  async (event: IpcMainEvent, { orgId, userId, token }) => {
    await performDeleteMember(event, orgId, userId, token);
  },
);

ipcMain.on('get-branches', async (event: IpcMainEvent, { token }) => {
  await performGetAllBranches(token, event);
});

ipcMain.on('get-branch-details', async (event, { orgId, branchId, token }) => {
  console.log('Received get-branch-details request:', { branchId, token });
  await performGetBranchDetails(event, orgId, branchId, token);
});

ipcMain.on(
  'create-branch',
  async (
    event: IpcMainEvent,
    { orgId, name, token }: { orgId: number; name: string; token: string },
  ) => {
    await performCreateBranch(event, orgId, name, token);
  },
);

ipcMain.on(
  'delete-branch',
  async (event: IpcMainEvent, { branchId, token }) => {
    await performDeleteBranch(branchId, token, event);
  },
);
// Handle the 'get-branch-members' request
// ipcMain.on('get-branch-members', async (event, { orgId, branchId, token }) => {
//   try {
//     const members = await performGetBranchMembers(
//       orgId,
//       branchId,
//       token,
//       event,
//     );
//     event.reply('branch-members-listed', { success: true, data: members });
//   } catch (error) {
//     console.error('Error fetching branch members:', error);
//     event.reply('branch-members-listed', {
//       success: false,
//       message: error.message || 'Failed to fetch branch members.',
//     });
//   }
// });

// Handle the 'assign-branch-admin' request
ipcMain.on(
  'assign-branch-admin',
  (event, { orgId, branchId, email, token }) => {
    performAssignBranchAdmin(event, orgId, branchId, email, token);
  },
);

// File download Section

ipcMain.on('download-template', (event) => {
  performDownloadTemplate(event); // Call service
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
