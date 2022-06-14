import { v4 as uuid } from 'uuid';

export default class User {
  private id: string;
  private name: string;

  constructor(name: string) {
    this.id = uuid();
    this.name = name;
  }

  setName(name: string) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}
