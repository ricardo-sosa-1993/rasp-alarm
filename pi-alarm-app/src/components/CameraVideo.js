import React, {useEffect, useState} from 'react';
import {
  registerStreamReceivedListener,
  registerDataChannelMessageListener,
  sendOnDataChannel,
  getVideoStream,
} from '../services/webrtc';
import {RTCView} from 'react-native-webrtc';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

const CameraVideo = () => {
  const [videoStream, setVideoStream] = useState(getVideoStream());
  const [servoPosition, setServoPosition] = useState();
  useEffect(() => {
    registerStreamReceivedListener((stream) => {
      setVideoStream(stream);
    });
    registerDataChannelMessageListener('servo_position', (message) => {
      setServoPosition(message.data);
    });
  }, []);

  onMoveServoRight = () => {
    sendOnDataChannel('move_servo', 'right');
  };

  onMoveServoLeft = () => {
    sendOnDataChannel('move_servo', 'left');
  };

  if (videoStream) {
    return (
      <View style={styles.container}>
        <RTCView
          style={{height: '70%', width: '100%'}}
          zOrder={20}
          objectFit={'cover'}
          mirror={true}
          streamURL={videoStream.toURL()}
        />
        {servoPosition && (
          <Text style={styles.positionText}>
            <Text style={{fontWeight: 'bold'}}>Camera position: </Text>
            {servoPosition} °
          </Text>
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={this.onMoveServoLeft}>
            <Text style={styles.buttonText}>Move left</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.onMoveServoRight}>
            <Text style={styles.buttonText}>Move right</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View>
      <Text>No connection</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D99BB',
  },
  positionText: {
    color: '#fff',
    margin: 10,
  },
  button: {
    borderColor: '#146b82',
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 8,
    width: 100,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginLeft: 40,
    marginRight: 40,
  },
});

export default CameraVideo;
