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
  private chat: Chat;

  constructor(io: Server) {
    this.io = io;
    this.chat = new Chat();
  }

  connect(socket: Socket) {
    socket.on(ChatEvent.userName, name =>
      this.handleSetSocketUserName(socket, name),
    );
    socket.on(ChatEvent.getMessages, () => this.getMessages(socket));
    socket.on(ChatEvent.message, text => this.handleMessage(socket, text));
  }

  sendMessage(message: ChatMessage) {
    this.io.sockets.emit(ChatEvent.message, message);
  }

  getMessages(socket: Socket) {
    this.chat.getMessages().forEach(message => {
      socket.emit(ChatEvent.message, message);
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

  handleMessage(socket: Socket, text: string) {
    const message = new ChatMessage(socket.data.user, text);

    this.chat.addMessage(message);
    this.sendMessage(message);

    setTimeout(() => {
      this.io.sockets.emit(ChatEvent.deleteMessage, message.id);
    }, Chat.MESSAGE_LIFETIME_MS);
  }

  handleSetSocketUserName(socket: Socket, name: string) {
    const user = socket.data.user;
    user.setName(name);
    this.cleanMessagesUser(user);
  }
}
