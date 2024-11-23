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
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import takeScreenshotAndUpload from './services/testService';
import login from './services/authService';
import {
  PerformUpdateProfile,
  performGetAllMembers,
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
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      nodeIntegration: false,
      contextIsolation: true, // Keep this true for security with contextBridge
    },
  });

  mainWindow.loadURL(resolveHtmlPath('Login'));

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
ipcMain.on('take-screenshot', async (event, testId, token) => {
  if (mainWindow) {
    await takeScreenshotAndUpload(mainWindow, testId, event, token);
  } else {
    console.error('Error: mainWindow is not available');
    event.reply('screenshot-taken', 'Error: mainWindow is not available');
  }
});
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

ipcMain.on(
  'delete-member',
  async (event: IpcMainEvent, { orgId, userId, token }) => {
    await performDeleteMember(event, orgId, userId, token);
  },
);

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
