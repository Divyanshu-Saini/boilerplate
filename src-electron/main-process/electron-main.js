import { app, BrowserWindow, nativeTheme, Tray, nativeImage, Menu } from 'electron';
import  path from 'path';

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'));
  }
} catch (_) {}

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname;
}

let mainWindow;
const image = nativeImage.createFromPath(path.join(__dirname, '../icons/icon.ico'));

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 500,
    height: 700,
    useContentSize: true,
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
    const menu = Menu.buildFromTemplate([
        {role: "quit"}, 
    ]);
    mainWindow.tray.setToolTip("For Better Virtual Assistance");
    mainWindow.tray.setContextMenu(menu);
    mainWindow.tray.on('click',()=>{
      mainWindow.isVisible()? mainWindow.hide() : mainWindow.show();
    })
    mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

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
