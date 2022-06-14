import { Server, Socket } from 'socket.io';
import Chat from '../models/Chat';
import ChatMessage from '../models/ChatMessage';
import User from '../models/User';

export default class ChatConnection {
  private io: Server;
  private socket: Socket;
  private chat: Chat;

  constructor(io: Server, socket: Socket) {
    this.socket = socket;
    this.io = io;
    this.chat = new Chat();

    this.chat.addUser(this.socket, '');

    socket.on('user_name', name => this.handleSetSocketUserName(name));
    socket.on('get_messages', () => this.getMessages());
    socket.on('message', value => this.handleMessage(value));
  }

  sendMessage(message: ChatMessage) {
    this.io.sockets.emit('message', message);
  }

  getMessages() {
    this.chat.getMessages().forEach(message => {
      this.socket.emit('message', message);
    });
  }

  cleanMessagesUser(user: User) {
    this.chat.getMessages().forEach(message => {
      if (message.user === user) {
        this.chat.deleteMessage(message);
        this.io.sockets.emit('delete_message', message.id);
      }
    });
  }

  handleMessage(text: string) {
    const user = this.chat.getUser(this.socket);
    const message = new ChatMessage(user, text);

    this.chat.addMessage(message);
    this.sendMessage(message);

    setTimeout(() => {
      this.io.sockets.emit('delete_message', message.id);
    }, Chat.MESSAGE_LIFETIME_MS);
  }

  handleSetSocketUserName(name: string) {
    const user = this.chat.getUser(this.socket);
    user.setName(name);
    this.cleanMessagesUser(user);
  }
}
