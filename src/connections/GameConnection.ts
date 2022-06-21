import { Server, Socket } from 'socket.io';
import Game from '../models/Game';

enum GameEvent {
  startGame = 'start_game',
  userReady = 'user_ready',
  players = 'players',
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

    this.io.sockets.emit(GameEvent.players, this.game.getPlayers().size);

    if (this.game.playersIsReady()) {
      this.io.emit(GameEvent.startGame);
    }
  }
}
