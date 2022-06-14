import { Server, Socket } from 'socket.io';

export default class GameConnection {
  private io: Server;
  private socket: Socket;

  constructor(io: Server, socket: Socket) {
    this.socket = socket;
    this.io = io;

    socket.on('ping', date => {
      socket.emit('pong', date);
    });
  }
}
