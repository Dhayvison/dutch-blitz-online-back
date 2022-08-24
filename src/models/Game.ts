import { CardDeck, DeckSymbol } from './CardDeck';
import Player from './Player';

export default class Game {
  private players: Player[];
  static readonly MAX_PLAYERS_NUM: number = 4;
  private decks: CardDeck[] = [];

  constructor() {
    this.players = [];
    Object.values(DeckSymbol).forEach(symbol => {
      this.decks.push(new CardDeck(symbol).generateDeck().shuffle());
    });
  }

  private findPlayer(id: string) {
    return this.players.find(player => {
      return player.user.id === id;
    });
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }

  getPlayer(id: string) {
    const player = this.findPlayer(id);
    return player ?? null;
  }

  removePlayer(player: Player) {
    const playerIndex = this.players.findIndex(playerItem => {
      return playerItem.user.id === player.user.id;
    });

    return this.players.splice(playerIndex, 1);
  }

  getPlayers() {
    return this.players;
  }

  playersIsReady() {
    return this.players.length === Game.MAX_PLAYERS_NUM;
  }
}
