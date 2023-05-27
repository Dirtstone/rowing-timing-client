import { app, BrowserWindow, nativeTheme } from 'electron';
import path from 'path';
import os from 'os';
import { ipcMain } from 'electron'
import { writeFileSync, readFileSync, existsSync } from 'fs';
import {v4 as uuid4} from 'uuid'

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(
      path.join(app.getPath('userData'), 'DevTools Extensions')
    );
  }
} catch (_) {}

let mainWindow: BrowserWindow | undefined;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
      sandbox: false
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools();
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });
}

const storePath = path.join(app.getPath('userData'), '/staticStore.json');
const sessionPath = path.join(app.getPath('userData'), '/sessionStore.json');

if(!existsSync(sessionPath)){
  const session = {
    clientId: uuid4(),
    regattaUuid: "",
    target: ""
  };

  writeFileSync(sessionPath, JSON.stringify(session));
}

ipcMain.handle("clientStorage:update", (ev, regattaUuid: string, target: string) => {
  let session = JSON.parse(readFileSync(sessionPath).toString());
  session.regattaUuid = regattaUuid;
  session.target = target;
  console.log(session)

  writeFileSync(sessionPath, JSON.stringify(session));
});

ipcMain.handle("clientStorage:load", (ev) => {
  return readFileSync(sessionPath).toString();
});

ipcMain.handle("staticStore:save", (ev, storeData: string) => {
  writeFileSync(storePath, storeData);
});

ipcMain.handle("staticStore:load", (ev) => {
  return readFileSync(storePath).toString();
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === undefined) {
    createWindow();
  }
});
