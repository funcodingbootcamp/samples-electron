const { app, BrowserWindow, Notification } = require('electron');
const windowStateKeeper = require('electron-window-state');
const path = require('path');
const electronLog = require('electron-log');
const os = require('os');

require('./menu');
const { runAutoUpdater } = require('./runAutoUpdater');

// set log level for the main process
electronLog.transports.file.level = 'debug';

// for notifications
app.setAppUserModelId('ru.busation.samples-electron');

let mainWindow;

function createWindow() {
    runAutoUpdater();
    let mainWindowState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 600
    });

    mainWindow = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        minWidth: 300,
        minHeight: 150,
        webPreferences: {
            nodeIntegration: true
        },
        show: true
    });

    mainWindowState.manage(mainWindow);
    mainWindow.loadFile(path.join(__dirname, '../index.html'));
    mainWindow.webContents.openDevTools();

    // Listen for window being closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Electron `app` is ready
app.on('ready', () => {
    createWindow();
});

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
    if (mainWindow === null) createWindow();
});

// NOTIFICATIONS
// setTimeout(() => {
//     const logoIcon = path.join(__dirname, '../images/icon.png');
//     const notific = new Notification({
//         title: 'Message from MAIN',
//         body: 'Click to quit the APP',
//         icon: logoIcon
//     });
//     notific.on('click', () => {
//         console.log('MAIN notification clicked');
//         app.quit();
//     });
//     notific.on('show', () => {
//         electronLog.debug('show Message from MAIN');
//     });
//     notific.show();
// }, 2000);

// NOTIFICATION node-notifier
// does not work well for mac
// const notifier = require('node-notifier');
// setTimeout(() => {
//     const logoIcon = path.join(__dirname, 'images/icon.png');
//     notifier.notify(
//         {
//             title: 'node-notifier',
//             message: 'Hello from node, Mr. User!'
//             // icon: logoIcon,
//             // contentImage: logoIcon,
//             // sound: true, // Only Notification Center or Windows Toasters
//             // wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait
//         },
//         function(err, response) {
//             // Response is response from notification
//         }
//     );
//
//     notifier.on('click', function(notifierObject, options, event) {
//         console.log('click');
//     });
//
//     notifier.on('timeout', function(notifierObject, options) {
//         console.log('timeout');
//     });
// }, 4000);
