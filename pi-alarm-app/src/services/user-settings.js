import AsyncStorage from '@react-native-community/async-storage';

async function getUserSetting(settingName, callback) {
  const settingValue = await AsyncStorage.getItem(settingName);
  callback(settingValue);
}

async function setUserSetting(settingName, settingValue) {
  await AsyncStorage.setItem(settingName, settingValue);
}

export {getUserSetting, setUserSetting};
