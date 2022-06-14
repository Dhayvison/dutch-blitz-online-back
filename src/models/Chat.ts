import { Socket } from 'socket.io';
import ChatMessage from './ChatMessage';
import User from './User';

export default class Chat {
  private messages: Set<ChatMessage>;
  private users: Map<Socket, User>;

  static MESSAGE_LIFETIME_MS = 5 * 60 * 1000;

  constructor() {
    this.messages = new Set<ChatMessage>();
    this.users = new Map<Socket, User>();
  }

  disconnectUser(socket: Socket) {
    this.users.delete(socket);
  }

  addUser(socket: Socket, username: string) {
    const user = new User(username);
    this.users.set(socket, user);
  }

  getUser(socket: Socket) {
    return this.users.get(socket);
  }

  addMessage(message: ChatMessage) {
    this.messages.add(message);
    setTimeout(() => {
      this.messages.delete(message);
    }, Chat.MESSAGE_LIFETIME_MS);
  }

  getMessages() {
    return this.messages;
  }

  deleteMessage(message: ChatMessage) {
    this.messages.delete(message);
  }
}
