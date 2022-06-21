import { Socket } from 'socket.io';
import Player from './Player';

export default class Game {
  private players: Map<Socket, Player>;
  static MAX_PLAYERS_NUM: number = 4;

  constructor() {
    this.players = new Map<Socket, Player>();
  }

  addPlayer(socket: Socket) {
    if (this.players.size < Game.MAX_PLAYERS_NUM) {
      const player = new Player();
      this.players.set(socket, player);
    }
  }

  getPlayer(socket: Socket) {
    return this.players.get(socket);
  }

  removePlayer(socket: Socket) {
    this.players.delete(socket);
  }

  getPlayers() {
    return this.players;
  }
}
