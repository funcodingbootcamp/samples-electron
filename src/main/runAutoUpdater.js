const { dialog, nativeImage, Notification } = require('electron');
const { autoUpdater } = require('electron-updater');
const electronLog = require('electron-log');
const path = require('path');

const START_DELAY = 3000;
const { IS_MAC } = require('../constants/app');

const iconPath = path.join(__dirname, '../images/icon.png');
const icon = nativeImage.createFromPath(iconPath);

autoUpdater.logger = electronLog;

autoUpdater.autoDownload = false;

const setAutoUpdater = () => {
    const isNotificationsSupported = Notification.isSupported();
    electronLog.debug('isNotificationsSupported', isNotificationsSupported);

    autoUpdater.checkForUpdates();

    autoUpdater.on('checking-for-update', () => {
        electronLog.debug('checking-for-update');
    });
    autoUpdater.on('update-available', async () => {
        if (isNotificationsSupported) {
            const notification1 = new Notification({
                title: 'Update is available',
                body: 'An update is available, click to download it',
                icon: IS_MAC ? null : icon
            });
            notification1.on('click', () => {
                electronLog.debug('click update-available');
                autoUpdater.downloadUpdate();
            });
            notification1.on('show', () => {
                electronLog.debug('NOTIFICATION update-available');
            });
            notification1.show();
        } else {
            const result = await dialog.showMessageBox({
                type: 'question',
                title: 'Update available',
                message: 'An update is available, do you want to download it?',
                buttons: ['Yes', 'No'],
                icon
            });
            if (result.response === 0) {
                autoUpdater.downloadUpdate();
            }
        }
    });

    autoUpdater.on('update-downloaded', () => {
        // For Windows: If update-downloaded notification is created before update-available is closed,
        // click event does not work. Thats why we add setTimeout 3000
        setTimeout(async () => {
            if (isNotificationsSupported) {
                const notification2 = new Notification({
                    title: 'Update is ready',
                    body: 'The update is ready, click to install and restart now',
                    icon: IS_MAC ? null : icon
                });
                notification2.on('click', () => {
                    electronLog.debug('click update-downloaded');
                    autoUpdater.quitAndInstall(false, true);
                });
                notification2.on('show', () => {
                    electronLog.debug('NOTIFICATION update-downloaded');
                });
                notification2.show();
            } else {
                const result = await dialog.showMessageBox({
                    type: 'question',
                    title: 'Update ready',
                    message: 'Install and restart now?',
                    buttons: ['Yes', 'No'],
                    icon
                });
                if (result.response === 0) {
                    autoUpdater.quitAndInstall(false, true);
                }
            }
        }, 5000)
    });

    // autoUpdater.on('download-progress', (progressObj: any) => {
    // let logMessage: string = 'Downloaded ';
    // const percent = progressObj.percent;
    // TYPE NUMBER
    // electronLog.debug('typeof percent', typeof percent);
    // electronLog.debug('percent', percent);
    // if (typeof percent === 'string' || percent instanceof String) {
    //     logMessage += percent.substr(0, 5);
    // } else if (typeof percent === 'number') {
    //     logMessage += Math.floor(percent);
    // } else {
    //     logMessage += percent;
    // }
    // logMessage += '%';
    // // let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
    // // log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    // // log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
    // sendNotificationToWindow(logMessage);
    // });
};

exports.runAutoUpdater = () => setTimeout(setAutoUpdater, START_DELAY);
