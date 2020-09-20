import React, { useEffect, useState } from 'react';
import { getAlarmUuid } from './services/alarm-setup';
import { getWebSocket } from './services/web-socket';
import { createWebRtcOffer, setRemoteDescription, addIceCandidate, sendOnDataChannel, getConnectionState } from './services/webrtc';
import { moveServo, setSetServoPositionListener } from './services/servo';
import './App.css';
import QRCode from 'qrcode.react';
import Modal from './components/Modal';


function App() {
  const [connectionState, setConnectionState] = useState('disconnected');
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const alarmUuid = getAlarmUuid();

  useEffect(() => {
    // WebRTC connection
    const socket = getWebSocket(alarmUuid);

    socket.on('joined_to_room', () => {
      const onIceCandidateCallback = (iceEvent) => {
        if (iceEvent.candidate) {
          socket.emit('ice_candidate', {
            roomId: alarmUuid,
            candidate: iceEvent.candidate
          });

        }
      };

      const onConnectionChangeCallback = () => {
        setConnectionState(getConnectionState());
      };

      const onMessageCallback = (event) => {
        const eventPayload = JSON.parse(event.data);

        if (eventPayload.messageType === 'move_servo') {
          moveServo(eventPayload.data);
          return;
        }
      };

      const callback = (offer) => {
        socket.emit('sdp', { roomId: alarmUuid, offer });
      };

      createWebRtcOffer(onIceCandidateCallback, onConnectionChangeCallback, onMessageCallback, callback);
    });

    socket.on('sdp', (data) => {
      setRemoteDescription(data.answer);
    });

    socket.on('ice_candidate', (data) => {
      if (data.candidate) addIceCandidate(data.candidate);
    });

    // Servo position
    const servoPositionCallback = (data) => {
      sendOnDataChannel(JSON.stringify({ messageType: 'servo_position', data }));
    };
    setSetServoPositionListener(servoPositionCallback);
  }, []);

  const onQrModalCloseClick = () => {
    setQrModalVisible(false);
  };

  const shwoQRModal = () => {
    setQrModalVisible(true);
  };

  return (
    <div className="App">
      <p className='Connection-status'>
        <span className='label'>Connection status: </span>{connectionState} <span className={`Connection-status-dot ${connectionState === 'connected' ? 'success' : 'error'}`}></span>
      </p>
      <h1 className="App-title">Pi Alarm</h1>
      <div className='Menu-container'>
        <button className='Menu-button' onClick={shwoQRModal}>Show Alarm QR code</button>
      </div>
      <Modal isOpen={qrModalVisible} onCloseClick={onQrModalCloseClick}>
        <div className='Qr-container'>
          <QRCode value={alarmUuid} size={200} />
        </div>
      </Modal>
    </div>
  );
}

export default App;
