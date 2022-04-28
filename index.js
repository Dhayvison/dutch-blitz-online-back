const express = require("express");

const app = express();
const http = require("http");

const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server);

io.on("connection", (socket) => {
  socket.broadcast.emit("hi");

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("chat message", { message: "bye! 👋" });
  });
});

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

server.listen(3000);
