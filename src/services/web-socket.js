import socketIOClient from "socket.io-client";
const ENDPOINT = "http://192.168.0.12:3000";

let socket;

function getWebSocket(roomId) {
    if(socket) return socket;

    socket = socketIOClient(ENDPOINT);
    socket.emit('ready', { roomId });

    return socket;
}

export { getWebSocket };