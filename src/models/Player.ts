import { CardDeck } from './CardDeck';
import User from './User';

export default class Player {
  readonly user: User;
  private isReady: boolean;
  private deck: CardDeck;

  constructor(user: User) {
    this.user = user;
    this.isReady = false;
  }

  setIsReady(isReady: boolean) {
    this.isReady = isReady;
  }

  getIsReady() {
    return this.isReady;
  }

  getDeck() {
    return this.deck;
  }

  setDeck(deck: CardDeck) {
    this.deck = deck;
  }
}
