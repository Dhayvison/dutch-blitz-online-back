import { Server, Socket } from 'socket.io';
import Game from '../models/Game';

enum GameEvent {
  userReady = 'user_ready',
  userNotReady = 'user_not_ready',
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

    socket.on(GameEvent.userReady, () => this.handleSetPlayerReady());
    socket.on(GameEvent.userNotReady, () => this.handleSetPlayerNotReady());

    socket.on(GameEvent.ping, date => {
      socket.emit(GameEvent.pong, date);
    });
  }

  handleSetPlayerReady() {
    this.game.addPlayer(this.socket);
  }

  handleSetPlayerNotReady() {
    this.game.removePlayer(this.socket);
  }
}
