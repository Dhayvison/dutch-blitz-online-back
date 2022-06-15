import { Server, Socket } from 'socket.io';
import Game from '../models/Game';

enum GameEvent {
  userReady = 'user_ready',
  ping = 'ping',
  pong = 'pong',
}

export default class GameConnection {
  private io: Server;
  private socket: Socket;
  private game: Game;

  constructor(io: Server, socket: Socket) {
    this.socket = socket;
    this.io = io;
    this.game = new Game();

    socket.on(GameEvent.userReady, status => this.handleSetPlayerReady(status));

    socket.on(GameEvent.ping, date => {
      socket.emit(GameEvent.pong, date);
    });
  }

  handleSetPlayerReady(status: boolean) {
    if (status) {
      this.game.addPlayer(this.socket);
    } else {
      this.game.removePlayer(this.socket);
    }
  }
}
