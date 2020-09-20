import React from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {establishWebRtcConnection} from '../services/webrtc';
import {setUserSetting} from '../services/user-settings';
import {RNCamera} from 'react-native-camera';
import {Text, View, StyleSheet} from 'react-native';

const QrScanner = ({navigation}) => {
  onSuccess = async (event) => {
    setUserSetting('alarmUuid', event.data);
    establishWebRtcConnection(event.data);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instructionText}>
        Scan the QR code from your alarm
      </Text>
      <QRCodeScanner
        checkAndroid6Permissions
        onRead={this.onSuccess}
        flashMode={RNCamera.Constants.FlashMode.off}
        showMarker={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D99BB',
  },
  instructionText: {
    color: '#fff',
    marginTop: 10,
    marginLeft: 10,
  },
});

export default QrScanner;
