const { remote } = require('electron');

// const self = remote.getCurrentWindow();

// Progress bar
// let progress = 0.01;
// let progressInterval = setInterval(() => {
//     self.setProgressBar(progress);
//
//     if (progress <= 1) {
//         progress += 0.01;
//     } else {
//         self.setProgressBar(-1);
//         clearInterval(progressInterval);
//     }
// }, 50);

// NOTIFICATIONS
setTimeout(() => {
    let myNotification = new Notification('Message from RENDERER', {
        body: 'Test notification',
        icon: './images/icon.png'
    });

    myNotification.onclick = () => {
        console.log('RENDERER notification clicked');
    };
}, 2000);
