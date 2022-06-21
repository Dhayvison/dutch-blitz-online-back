import { Server } from 'socket.io';
import ChatConnection from './connections/ChatConnection';
import GameConnection from './connections/GameConnection';
import User from './models/User';
import { error, warning } from './utils/text-coloring';

class SocketConnection {
  private io: Server;
  private chat: ChatConnection;
  private game: GameConnection;

  constructor(io: Server) {
    this.io = io;
    this.chat = new ChatConnection(io);
    this.game = new GameConnection(io);
  }

  connect() {
    this.io.on('connection', socket => {
      socket.data.user = new User('');

      console.log(warning`A user is ONLINE: ` + socket.id);

      this.chat.connect(socket);
      this.game.connect(socket);

      socket.on('disconnect', () => {
        console.log(error`A user is OFFLINE`);
        this.game.handleSetPlayerReady(socket, false);
      });

      socket.on('connect_error', err => {
        console.error(`connect_error due to ${err.message}`);
      });
    });
  }
}

function socketConnection(io: Server) {
  new SocketConnection(io).connect();
}

export default socketConnection;
