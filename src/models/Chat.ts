import ChatMessage from './ChatMessage';

export default class Chat {
  private messages: Set<ChatMessage>;

  static readonly MESSAGE_LIFETIME_MS = 5 * 60 * 1000;

  constructor() {
    this.messages = new Set<ChatMessage>();
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
