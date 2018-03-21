import {app, nativeImage, Menu, Tray, BrowserWindow} from 'electron'
import * as windowStateKeeper from 'electron-window-state';
import * as path from 'path';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {

  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 560
  });

  const iconPath = path.join(__dirname, '../../build/icons/icon.ico');
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    //useContentSize: true,
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    frame: process.env.NODE_ENV === 'development',
    transparent: process.env.NODE_ENV !== 'development',
    resizable: true,
    icon: iconPath
  });
  mainWindowState.manage(mainWindow);

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null
  });

  // Minimize to tray

  // Use relative path only in development - for build use real icon
  let tray = new Tray(process.env.NODE_ENV === 'development' ? iconPath : '../icons/icon.ico');
  tray.setToolTip('Equalizer APO UI');
  const contextMenu = Menu.buildFromTemplate([{
    label: 'Show Equalizer APO UI', click: function () {
      mainWindow.show()
    }
  }, {
    label: 'Quit', click: function () {
      app.isQuiting = true
      app.quit()
    }
  }]);
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  });

  mainWindow.on('minimize', function (event) {
    event.preventDefault();
    mainWindow.hide();
  });
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
