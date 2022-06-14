import { Server, Socket } from 'socket.io';
import Chat from '../models/Chat';
import ChatMessage from '../models/ChatMessage';
import User from '../models/User';

enum ChatEvent {
  userName = 'user_name',
  message = 'message',
  getMessages = 'get_messages',
  deleteMessage = 'delete_message',
}

export default class ChatConnection {
  private io: Server;
  private socket: Socket;
  private chat: Chat;

  constructor(io: Server, socket: Socket) {
    this.socket = socket;
    this.io = io;
    this.chat = new Chat();

    this.chat.addUser(this.socket, '');

    socket.on(ChatEvent.userName, name => this.handleSetSocketUserName(name));
    socket.on(ChatEvent.getMessages, () => this.getMessages());
    socket.on(ChatEvent.message, value => this.handleMessage(value));
  }

  sendMessage(message: ChatMessage) {
    this.io.sockets.emit(ChatEvent.message, message);
  }

  getMessages() {
    this.chat.getMessages().forEach(message => {
      this.socket.emit(ChatEvent.message, message);
    });
  }

  cleanMessagesUser(user: User) {
    this.chat.getMessages().forEach(message => {
      if (message.user === user) {
        this.chat.deleteMessage(message);
        this.io.sockets.emit(ChatEvent.deleteMessage, message.id);
      }
    });
  }

  handleMessage(text: string) {
    const user = this.chat.getUser(this.socket);
    const message = new ChatMessage(user, text);

    this.chat.addMessage(message);
    this.sendMessage(message);

    setTimeout(() => {
      this.io.sockets.emit(ChatEvent.deleteMessage, message.id);
    }, Chat.MESSAGE_LIFETIME_MS);
  }

  handleSetSocketUserName(name: string) {
    const user = this.chat.getUser(this.socket);
    user.setName(name);
    this.cleanMessagesUser(user);
  }
}
