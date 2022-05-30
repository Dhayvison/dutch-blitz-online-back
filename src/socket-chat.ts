import { Server, Socket } from 'socket.io';
import { v4 as uuid } from 'uuid';
import { error } from './utils/text-coloring';

type ChatUser = {
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

const defaultUser = {
  id: 'anon',
  name: 'Anonymous',
};

const messageExpirationTimeMS = 5 * 60 * 1000; // 5 min

class SocketConnection {
  private io: Server;
  private socket: Socket;

  constructor(io: Server, socket: Socket) {
    this.socket = socket;
    this.io = io;

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

  handleMessage(text: string) {
    const message = {
      id: uuid(),
      user: users.get(this.socket) || defaultUser,
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
    users.set(this.socket, { name });
  }

  disconnect() {
    console.log(error`A user disconnected on: CHAT`);
    users.delete(this.socket);
  }
}

function chat(io: Server) {
  io.on('connection', socket => {
    new SocketConnection(io, socket);
  });
}

export default chat;
