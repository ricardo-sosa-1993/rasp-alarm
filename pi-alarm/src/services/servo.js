const electron = require('electron');
const ipc = electron.ipcRenderer;

function setSetServoPositionListener(callback) {
    ipc.on('servo_position', (event, args) => {
        callback(args);
    });
}

function moveServo(direction) {
    ipc.send('move_servo', direction);
}

export {moveServo, setSetServoPositionListener};