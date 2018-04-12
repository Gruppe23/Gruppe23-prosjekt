const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
import {history} from './src/js/forside';
let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({width: 1200, height: 900, minWidth: 1000, minHeight: 780, });

  // Open Development Tools
  mainWindow.openDevTools();

  mainWindow.loadURL('file://' + __dirname + '/index.html');
});

app.on('window-all-closed', () => {
  history.push("/")
  app.quit();
});
