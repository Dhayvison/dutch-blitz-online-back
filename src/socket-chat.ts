import { Server, Socket } from 'socket.io';
import { v4 as uuid } from 'uuid';
import { error, warning } from './utils/text-coloring';

type ChatUser = {
  id: string;
  name: string;
};

type ChatMessage = {
  id: string;
  user: ChatUser;
  text: string;
  time: number;
};

const messages = new Set<ChatMessage>();
const users = new Map<Socket, ChatUser>();

const messageExpirationTimeMS = 5 * 60 * 1000; // 5 min

class SocketConnection {
  private io: Server;
  private socket: Socket;

  constructor(io: Server, socket: Socket) {
    this.socket = socket;
    this.io = io;

    const user = { id: uuid(), name: '' };
    users.set(this.socket, user);

    socket.on('user_name', name => this.handleSetSocketUserName(name));
    socket.on('get_messages', () => this.getMessages());
    socket.on('message', value => this.handleMessage(value));
    socket.on('disconnect', () => this.disconnect());
    socket.on('connect_error', err => {
      console.log(`connect_error due to ${err.message}`);
    });
    socket.on('ping', date => {
      socket.emit('pong', date);
    });
  }

  sendMessage(message: ChatMessage) {
    this.io.sockets.emit('message', message);
  }

  getMessages() {
    messages.forEach(message => {
      this.socket.emit('message', message);
    });
  }

  cleanMessagesUser (user: ChatUser) {
    messages.forEach(message => {
      if (message.user === user){
        messages.delete(message);
        this.io.sockets.emit('delete_message', message.id);
      }
    });
  }

  handleMessage(text: string) {
    const message = {
      id: uuid(),
      user: users.get(this.socket),
      text,
      time: Date.now(),
    };

    messages.add(message);
    this.sendMessage(message);

    setTimeout(() => {
      messages.delete(message);
      this.io.sockets.emit('delete_message', message.id);
    }, messageExpirationTimeMS);
  }

  handleSetSocketUserName(name: string) {
    const user = users.get(this.socket);
    user.name = name;
    users.set(this.socket, user);
    this.cleanMessagesUser(user);
    this.socket.emit('new_user', user.name);
  }

  disconnect() {
    console.log(error`A user disconnected on: CHAT`);
    users.delete(this.socket);
  }
}

function chat(io: Server) {
  io.on('connection', socket => {
    console.log(warning`A user connected on: CHAT`);
    new SocketConnection(io, socket);
  });
}

export default chat;
