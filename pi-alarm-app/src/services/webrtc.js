import {RTCPeerConnection} from 'react-native-webrtc';
import {getWebSocket, closeWebSocket} from './web-socket';
let peerConnection;
let dataChannel;
let videoStream;
let socket;
const connectionStateChangeListeners = [];
const dataChannelMessageListeners = {};
const streamReceivedListeners = [];

function sendOnDataChannel(messageType, data) {
  dataChannel.send(JSON.stringify({messageType, data}));
}

function getVideoStream() {
  return videoStream;
}

function registerConnectionStateChangeListener(callback) {
  connectionStateChangeListeners.push(callback);
}

function registerDataChannelMessageListener(messageType, callback) {
  if (dataChannelMessageListeners[messageType]) {
    dataChannelMessageListeners[messageType].push(callback);
  } else {
    dataChannelMessageListeners[messageType] = [callback];
  }
}

function registerStreamReceivedListener(callback) {
  streamReceivedListeners.push(callback);
}

function establishWebRtcConnection(storedAlarmUuid) {
  closeWebRtcConnection();
  socket = getWebSocket(storedAlarmUuid);

  // On web rtc offer from alarm
  socket.on('sdp', async (data) => {
    // create peer connection
    peerConnection = new RTCPeerConnection({
      iceServers: [{urls: 'stun:stun.l.google.com:19302'}],
    });

    // setup datachannel
    peerConnection.ondatachannel = (event) => {
      dataChannel = event.channel;
      dataChannel.onmessage = (event) => {
        const messagePayload = JSON.parse(event.data);
        const callbacks =
          dataChannelMessageListeners[messagePayload.messageType];

        if (callbacks) {
          callbacks.forEach((callback) => callback(messagePayload));
        }
      };
    };

    // setup listeners
    peerConnection.onicecandidate = (iceEvent) => {
      socket.emit('ice_candidate', {
        roomId: storedAlarmUuid,
        candidate: iceEvent.candidate,
      });
    };
    peerConnection.onaddstream = (event) => {
      videoStream = event.stream;
      streamReceivedListeners.forEach((callback) => callback(event.stream));
    };
    peerConnection.onconnectionstatechange = () => {
      connectionStateChangeListeners.forEach((callback) =>
        callback(peerConnection.connectionState),
      );
    };

    // create answer
    await peerConnection.setRemoteDescription(data.offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.emit('sdp', {roomId: storedAlarmUuid, answer});
  });

  // Ice candidate from alarm
  socket.on('ice_candidate', async (data) => {
    if (data.candidate) {
      await peerConnection.addIceCandidate(data.candidate);
    }
  });
}

function closeWebRtcConnection() {
  if (peerConnection) {
    peerConnection.close();
  }
  connectionStateChangeListeners.forEach((callback) =>
    callback('disconnected'),
  );
  closeWebSocket();
  peerConnection = null;
  dataChannel = null;
  videoStream = null;
  socket = null;
}

export {
  establishWebRtcConnection,
  registerConnectionStateChangeListener,
  registerDataChannelMessageListener,
  registerStreamReceivedListener,
  getVideoStream,
  sendOnDataChannel,
  closeWebRtcConnection,
};
