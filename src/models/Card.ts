enum CardColor {
  Blue = 'blue',
  Green = 'green',
  Red = 'red',
  Yellow = 'yellow',
}

class Card {
  readonly number: number;
  readonly color: CardColor;

  constructor(number: number, color: CardColor) {
    this.number = number;
    this.color = color;
  }
}

export { Card, CardColor };
