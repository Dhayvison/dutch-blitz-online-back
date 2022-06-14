import { Server } from 'socket.io';
import ChatConnection from './connections/socket-chat';
import GameConnection from './connections/socket-game';
import { error, warning } from './utils/text-coloring';

function socketConnection(io: Server) {
  io.on('connection', socket => {
    console.log(warning`A user is ONLINE`);

    new ChatConnection(io, socket);
    new GameConnection(io, socket);

    socket.on('disconnect', () => {
      console.log(error`A user is OFFLINE`);
    });

    socket.on('connect_error', err => {
      console.error(`connect_error due to ${err.message}`);
    });
  });
}

export default socketConnection;
