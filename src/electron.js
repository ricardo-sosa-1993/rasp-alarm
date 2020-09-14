const electron = require('electron');
const {Board, Servo} = require('johnny-five');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
let mainWindow;
let servo, pos = 90;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    mainWindow.loadURL(startUrl);

    if(process.env.ELECTRON_START_URL){
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', function () {
        mainWindow = null
    })

    // setup board
    // Board
    const board = new Board({'repl': false});
    board.on('ready', function() {
        console.log('readyyyyy!! ');
        servo = new Servo({ pin: 9, startAt: pos });
    });
}
app.on('ready', createWindow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});

ipc.on('move_servo', (event, args) => {
    // max: 180 min: 0 
    if(args === 'left' && pos < 180) pos = pos + 15;
    if(args === 'right' && pos > 0) pos = pos - 15;
    servo.to(pos);
    event.sender.send('servo_position',pos);
});