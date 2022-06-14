import { v4 as uuid } from 'uuid';

import User from './User';

export default class ChatMessage {
  id: string;
  user: User;
  text: string;
  time: number;

  constructor(user: User, text: string) {
    this.id = uuid();
    this.user = user;
    this.text = text;
    this.time = Date.now();
  }
}
