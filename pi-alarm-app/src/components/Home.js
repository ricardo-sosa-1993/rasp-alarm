import React, {useState, useEffect} from 'react';
import {
  registerConnectionStateChangeListener,
  establishWebRtcConnection,
  closeWebRtcConnection,
} from '../services/webrtc';
import {getUserSetting} from '../services/user-settings';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

const Home = ({navigation}) => {
  useEffect(() => {
    registerConnectionStateChangeListener(setConnectionState);
  }, []);
  const [connectionState, setConnectionState] = useState('disconnected');

  tryToReconnect = () => {
    getUserSetting('alarmUuid', (storedAlarmUuid) => {
      if (storedAlarmUuid) {
        console.log('reconnecting');
        establishWebRtcConnection(storedAlarmUuid);
      }
    });
  };

  disconnect = () => {
    closeWebRtcConnection();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.connectionStatus}>
        <Text style={styles.connectionStatusLabel}>Connection status:</Text>{' '}
        {connectionState}{' '}
        {connectionState !== 'connecting' && (
          <TouchableOpacity
            style={{
              ...styles.connectionStatusDot,
              backgroundColor:
                connectionState === 'connected' ? 'yellowgreen' : 'red',
            }}
          />
        )}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('QrScanner');
          }}>
          <Text style={styles.buttonText}>
            {connectionState === 'connected'
              ? 'Connect to different alarm'
              : 'Connect to alarm'}
          </Text>
        </TouchableOpacity>
        {connectionState !== 'connected' && (
          <TouchableOpacity style={styles.button} onPress={this.tryToReconnect}>
            <Text style={styles.buttonText}>Try to reconnect</Text>
          </TouchableOpacity>
        )}
        {connectionState === 'connected' && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('CameraVideo')}>
            <Text style={styles.buttonText}>See camera video</Text>
          </TouchableOpacity>
        )}
        {connectionState === 'connected' && (
          <TouchableOpacity style={styles.button} onPress={this.disconnect}>
            <Text style={styles.buttonText}>Disconnect</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D99BB',
  },
  connectionStatus: {
    textAlign: 'right',
    color: '#FFFFFF',
    marginTop: 12,
    marginRight: 10,
  },
  connectionStatusLabel: {
    fontWeight: 'bold',
  },
  connectionStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: 'red',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: '30%',
  },
  button: {
    borderColor: '#146b82',
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 8,
    width: 200,
    marginTop: 40,
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,

    elevation: 16,
  },
  buttonText: {
    color: '#146b82',
  },
});

export default Home;
