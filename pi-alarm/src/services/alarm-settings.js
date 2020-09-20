const electron = window.require('electron');
const fs = electron.remote.require('fs');
const { app } = electron.remote;
const path = require('path');

function getSettingsPath() {
    const userDataPath = app.getPath('userData');
    const settingsPath = path.join(userDataPath, 'alarm-settings.json');

    return settingsPath;
}

function setAlarmSetting(name, value) {
    const settingsPath = getSettingsPath();
    let existingData;

    try {
        existingData = JSON.parse(fs.readFileSync(settingsPath));
    } catch(err) {
        existingData = {};
    }

    existingData[name] = value;
    fs.writeFileSync(settingsPath, JSON.stringify(existingData));
}

function getAlarmSetting(name) {
    const settingsPath = getSettingsPath();
    let existingData;

    try {
        existingData = JSON.parse(fs.readFileSync(settingsPath));
    } catch (err){
        return null;
    }

    return existingData[name];
}

export { setAlarmSetting, getAlarmSetting };