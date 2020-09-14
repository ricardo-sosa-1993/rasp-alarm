const constraints = window.constraints = {
    audio: false,
    video: true
};
const dataChannelOptions = {
    ordered: false,
    maxRetransmitTime: 1000,
};
let peerConnection, dataChannel;

async function getVideoStream() {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    return stream;
}

function handleError(error) {
    if (error.name === 'ConstraintNotSatisfiedError') {
        const v = constraints.video;
        console.error(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
    } else if (error.name === 'PermissionDeniedError') {
        console.error('Permissions have not been granted to use your camera and ' +
            'console.error, you need to allow the page access to your devices in ' +
            'order for the demo to work.');
    }
    console.error(`getUserMedia error: ${error.name}`, error);
}

async function createWebRtcOffer(onIceCandidateCallback, onConnectionChangeCallback, onMessageCallback, callback) {
    try {
        peerConnection = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        // setup data channel
        dataChannel = peerConnection.createDataChannel('dataChannel',dataChannelOptions);
        dataChannel.onmessage = onMessageCallback;

        // setup listeners
        peerConnection.onicecandidate = onIceCandidateCallback;
        peerConnection.onconnectionstatechange = onConnectionChangeCallback;

        // setup video stream
        const videoStream = await getVideoStream();
        peerConnection.addStream(videoStream);


        // create offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        callback(offer);
    } catch (e) {
        handleError(e);
        return;
    }
}

function setRemoteDescription(remoteDescription) {
    peerConnection.setRemoteDescription(remoteDescription);
}

function addIceCandidate(candidate) {
    try {
        peerConnection.addIceCandidate(candidate);
    } catch (e) { }
}

function sendOnDataChannel(data) {
    dataChannel.send(data);
}

function getConnectionState() {
    return peerConnection.connectionState;
}

export { createWebRtcOffer, setRemoteDescription, addIceCandidate, sendOnDataChannel, getConnectionState };