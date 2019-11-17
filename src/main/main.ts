import { app, BrowserWindow, Notification } from 'electron';
import * as windowStateKeeper from 'electron-window-state';
import * as path from 'path';
import * as electronLog from 'electron-log';
import * as isDev from 'electron-is-dev';

import { LOG_LEVEL, DEBUG_MODE } from '../constants/app';

import './menu';
import { runAutoUpdater } from './runAutoUpdater';

// set log level for the main process
electronLog.transports.file.level = LOG_LEVEL;

// for notifications
app.setAppUserModelId('ru.busation.samples-electron');

let mainWindow: BrowserWindow;

function createWindow() {
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

    runAutoUpdater(mainWindow);

    mainWindowState.manage(mainWindow);
    mainWindow.loadFile(path.join(__dirname, '../index.html'));

    // Listen for window being closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Electron `app` is ready
app.on('ready', () => {
    enableHotReload();
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

function enableHotReload() {
    // Comment this out to disable hot-reload
    if (isDev) {
        const hotReloader = require('electron-reload');
        hotReloader(path.join(__dirname, '../'));
    }
}

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
