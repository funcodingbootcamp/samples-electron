const { Menu, MenuItem } = require('electron');

const mainMenu = new Menu();

const menuItem1 = new MenuItem({
    label: 'Electron',
    submenu: [
        {
            label: 'Greet',
            click: () => {
                console.log('Hello from menu');
            },
            accelerator: 'Shift+Alt+K'
        },
        { label: 'DevTools', role: 'toggleDevTools' },
        { role: 'quit' }
    ]
});

mainMenu.append(menuItem1);

Menu.setApplicationMenu(mainMenu);
