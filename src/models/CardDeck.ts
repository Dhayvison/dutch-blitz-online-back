import { shuffle } from '../libs/array-utils';
import { Card, CardColor } from './Card';

enum DeckSymbol {
  shark = 'shark',
  cheetah = 'cheetah',
  wolf = 'wolf',
  hawk = 'hawk',
}

class CardDeck {
  private cards: Card[] = [];
  readonly symbol: DeckSymbol;

  static CARD_NUMBER = 10;

  constructor(symbol: DeckSymbol) {
    this.symbol = symbol;
  }

  generateDeck() {
    const cards = [];
    const baseArray = Array.from(Array(CardDeck.CARD_NUMBER).keys());
    Object.values(CardColor).forEach(color => {
      baseArray.map(number => {
        cards.push(new Card(number + 1, color));
      });
    });
    this.cards = cards;
    return this;
  }

  shuffle() {
    shuffle(this.cards);
    return this;
  }
}

export { CardDeck, DeckSymbol };
