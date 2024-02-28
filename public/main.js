const { app, BrowserWindow } = require('electron')
// const server = require("../././Inventory-Management-System/server")
const path = require('path')
const isDev = require('electron-is-dev')
require('@electron/remote/main').initialize()
const axios = require('axios')

// const server = require(path.join(process.resourcesPath, "Tailor-Management-System/server.js"))
let splash
let isConnected = "loading"

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1920,
    height: 920,
    // width: "100%",
    // height: "100%",
    // resizable: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      // preload: path.join(__dirname, "../Tailor-Management-System/server.js"),
    },
    devTools: false
  })

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )
  win.maximize()
  // win.removeMenu(true)

}



app.on('ready', () => {
  // create main browser window
  win = new BrowserWindow({
      titleBarStyle: 'hidden',
      width: 1920,
      height: 1080,
      show: false, // don't show the main window
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        devTools: false,
        // preload: path.join(__dirname, "../Inventory-Management-System/server.js"),
 
      }
  });
  // create a new `splash`-Window 
  splash = new BrowserWindow({width: 410, height: 310, transparent: true, frame: false, alwaysOnTop: true});
  splash.loadURL(`file://${__dirname}/splash.html`);
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )
  // win.maximize()

  // if main window is ready to show, then destroy the splash window and show up the main window
  win.webContents.on('did-finish-load', () => {
    // setTimeout( async function (){   
    //   const res = await axios
    // .get('http://127.0.0.1:80/api/v1/companyInfo').then((res)=> {
    //   isConnected = "connected"
    // }).catch(err => isConnected = "no connection")
      splash.destroy();
      createWindow()
  // }, 2000);
  });
});


// app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.exit(0)
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
