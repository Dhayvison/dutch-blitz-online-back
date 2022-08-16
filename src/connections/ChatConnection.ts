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

const chat = new Chat();

export default class ChatConnection {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  connect(socket: Socket) {
    socket.on(ChatEvent.userName, name =>
      this.handleSetSocketUserName(socket, name),
    );
    socket.on(ChatEvent.getMessages, () => this.handleGetMessages(socket));
    socket.on(ChatEvent.message, text => this.handleMessage(socket, text));
  }

  private sendMessage(message: ChatMessage) {
    this.io.sockets.emit(ChatEvent.message, message);
  }

  private cleanMessagesUser(user: User) {
    chat.getMessages().forEach(message => {
      if (message.user === user) {
        chat.deleteMessage(message);
        this.io.sockets.emit(ChatEvent.deleteMessage, message.id);
      }
    });
  }

  handleGetMessages(socket: Socket) {
    chat.getMessages().forEach(message => {
      socket.emit(ChatEvent.message, message);
    });
  }

  handleMessage(socket: Socket, text: string) {
    const message = new ChatMessage(socket.data.user, text);

    chat.addMessage(message);
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
