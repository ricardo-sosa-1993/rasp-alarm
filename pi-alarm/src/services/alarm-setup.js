import { v1 as uuidv1 } from 'uuid';
import { getAlarmSetting, setAlarmSetting } from './alarm-settings';

function getAlarmUuid() {
    const storedAlarmUuid = getAlarmSetting('alarm.uuid');

    if(storedAlarmUuid) return storedAlarmUuid;

    const alarmUuid = uuidv1();
    setAlarmSetting('alarm.uuid', alarmUuid);

    return alarmUuid;
}

export { getAlarmUuid };