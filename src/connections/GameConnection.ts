import { Server, Socket } from 'socket.io';
import Game from '../models/Game';

enum GameEvent {
  startGame = 'start_game',
  userReady = 'user_ready',
  players = 'players',
  ping = 'ping',
  pong = 'pong',
}

const game = new Game();

export default class GameConnection {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
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
      game.addPlayer(socket);
    } else {
      game.removePlayer(socket);
    }

    this.io.sockets.emit(GameEvent.players, game.getPlayers().size);

    if (game.playersIsReady()) {
      for (const socket of game.getPlayers().keys()) {
        socket.emit(GameEvent.startGame);
      }
    }
  }
}
