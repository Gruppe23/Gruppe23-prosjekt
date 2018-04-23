const electron = require('electron');
var path = require('path')
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({width: 1200, frame: false, height: 900, minWidth: 1000, minHeight: 780, icon: path.join(__dirname, 'assets/icons/png/64x64.png') });

  // Open Development Tools
  mainWindow.openDevTools();

  mainWindow.loadURL('file://' + __dirname + '/index.html');
});

app.on('window-all-closed', () => {
  app.quit();
});
