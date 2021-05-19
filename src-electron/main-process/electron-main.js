import { app, BrowserWindow, nativeTheme, Tray, nativeImage, Menu, ipcMain } from 'electron';
import path from 'path';

import { storeUser, storeSession, electron_store } from './ipc-handler';
import { IPC_MESSAGES } from '../../constant';

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'));
  }
} catch (_) {}

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD ) {
  global.__statics = __dirname;
}

let mainWindow;
const image = nativeImage.createFromPath(path.resolve(__statics, 'favicon-16x16.png'));


function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 500,
    height: 700,
    useContentSize: false,
    x: 800,
    y: 0,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  });

  mainWindow.loadURL(process.env.APP_URL);
  mainWindow.setMenuBarVisibility(false);
  mainWindow.tray = new Tray(image);
  const menu = Menu.buildFromTemplate([{ role: 'quit' }]);
  mainWindow.tray.setToolTip('For Better Virtual Assistance');
  mainWindow.tray.setContextMenu(menu);
  mainWindow.tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function publish(message, payload = {}) {
  mainWindow.webContents.send(message, payload);
}

function resisterSubscription() {
  ipcMain.handle(IPC_MESSAGES.STORE_SESSION, storeSession);
  ipcMain.handle(IPC_MESSAGES.STORE_USER, storeUser);
  ipcMain.on(IPC_MESSAGES.RESTORE_SESSION, () => {
    let sess = electron_store.get('botSession');
    let user = electron_store.get('user');
    if ((user && user !== undefined) || user !== null) {
      const args = {
        users: user,
        botSession: sess
      };
      publish(IPC_MESSAGES.RESTORE_SESSION, args);
    }
  });
  ipcMain.on(IPC_MESSAGES.CLEAR_STORAGE, () => {
    electron_store.clear();
  });
}

app.on('ready', () => {
  resisterSubscription();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
