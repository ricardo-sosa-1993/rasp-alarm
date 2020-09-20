/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {getUserSetting} from '../services/user-settings';
import {NavigationContainer} from '@react-navigation/native';
import {establishWebRtcConnection} from '../services/webrtc';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './Home';
import QrScanner from './QrScanner';
import CameraVideo from './CameraVideo';

const Stack = createStackNavigator();

const App: () => React$Node = () => {
  useEffect(() => {
    getUserSetting('alarmUuid', (storedAlarmUuid) => {
      if (storedAlarmUuid) {
        establishWebRtcConnection(storedAlarmUuid);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: 'Pi Alarm',
            ...headerStyles,
          }}
        />
        <Stack.Screen
          name="QrScanner"
          component={QrScanner}
          options={{
            title: 'Connect to alarm',
            ...headerStyles,
          }}
        />
        <Stack.Screen
          name="CameraVideo"
          component={CameraVideo}
          options={{
            title: 'Alarm video',
            ...headerStyles,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const headerStyles = {
  headerStyle: {
    backgroundColor: '#0b3d4a',
  },
  headerTintColor: '#fff',
};

export default App;
