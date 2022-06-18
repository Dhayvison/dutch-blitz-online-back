import { Server, Socket } from 'socket.io';
import Game from '../models/Game';

enum GameEvent {
  userReady = 'user_ready',
  ping = 'ping',
  pong = 'pong',
}

export default class GameConnection {
  private io: Server;
  private game: Game;

  constructor(io: Server) {
    this.io = io;
    this.game = new Game();
  }

  connect(socket: Socket) {
    socket.on(GameEvent.userReady, status =>
      this.handleSetPlayerReady(socket, status),
    );

    socket.on(GameEvent.ping, date => {
      socket.emit(GameEvent.pong, date);
    });
  }

  handleSetPlayerReady(socket: Socket, status: boolean) {
    if (status) {
      this.game.addPlayer(socket);
    } else {
      this.game.removePlayer(socket);
    }
  }
}
