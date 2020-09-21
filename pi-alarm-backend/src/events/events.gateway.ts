import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('ready')
  onReady(socket: Socket, data: any): void {
    if(!data.roomId) return;
    socket.join(data.roomId);
    socket.to(data.roomId).emit('joined_to_room', { roomId: data.roomId });
    console.log('joined to room  ', data.roomId);
  }

  @SubscribeMessage('sdp')
  onSdp(socket: Socket, data: any): void {
    if(!data.roomId) return;
    socket.to(data.roomId).emit('sdp', data);
  }

  @SubscribeMessage('ice_candidate')
  onIceCandidate(socket: Socket, data: any): void {
    if(!data.roomId) return;
    socket.to(data.roomId).emit('ice_candidate', data);
  }
}