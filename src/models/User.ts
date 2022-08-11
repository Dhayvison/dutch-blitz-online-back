import { v4 as uuid } from 'uuid';

export default class User {
  readonly id: string;
  protected name: string;

  constructor(name?: string) {
    this.id = uuid();
    this.name = name ?? '';
  }

  setName(name: string) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}
