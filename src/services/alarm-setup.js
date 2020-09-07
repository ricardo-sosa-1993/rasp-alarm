import { v1 as uuidv1 } from 'uuid';
import { getAlarmSetting, setAlarmSetting } from './alarm-settings';

async function setupAlarm() {

    const storedAlarmUuid = getAlarmSetting('alarm.uuid');
    console.log('stored alarm uuid!!! ', storedAlarmUuid);
    if(storedAlarmUuid) return;

    const alarmUuid = uuidv1();
    console.log('new alarm uuid!!! ', alarmUuid);
    setAlarmSetting('alarm.uuid', alarmUuid);
    // share alarm uuid with server here!
    // init socket room here
}

export { setupAlarm };