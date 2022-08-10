import 'dotenv/config';
import * as http from 'http';
import { Server } from 'socket.io';
import app from './app';
import socketConnection from './sockets';
import { success } from './utils/text-coloring';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

socketConnection(io);

server.listen(process.env.PORT, () =>
  console.info(success`Server is running on port:`, process.env.PORT),
);
