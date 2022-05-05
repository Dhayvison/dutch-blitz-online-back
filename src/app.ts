import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import * as http from 'http';
import { Server } from 'socket.io';
import { router } from './routes';
import { error, success, warning } from './utils/text-coloring';

const app = express();
app.use(cors());
app.use(express.json());
app.disable('x-powered-by');

app.get('/status', (...[, response]) => {
  return response.json({ status: 'running' });
});

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', socket => {
  console.log(warning`A user connected`);
  socket.broadcast.emit('hi');

  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log(error`A user disconnected`);
    socket.broadcast.emit('chat message', { message: 'bye! 👋' });
  });

  socket.on('ping', date => {
    socket.emit('pong', date);
  });
});

app.use(router);
app.use(express.static('public'));

server.listen(process.env.PORT, () =>
  console.info(success`Server is running on port:`, process.env.PORT),
);
export { app };
