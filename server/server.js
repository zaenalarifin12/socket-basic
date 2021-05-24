const path = require("path");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const { generateMessage } = require("./utils/message");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/../public/index.html"));
});

io.on("connection", (socket) => {
  console.log("a new user just connected");

  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback("name and room required");
    }

    socket.join(params.room);

    // io.to(params.room).emit("updateUserList", user.getUserList(params.room));
    socket.emit(
      "newMessage",
      generateMessage("Admin", "welcome to the chat api!")
    );

    socket.broadcast.emit(
      "newMessage",
      generateMessage("Admin", "new user joined!")
    );

    callback();
  });

  // ======================================

  // name parameter
  socket.on("createMessage", (message, callback) => {
    console.log("message ", message);

    // broadcast to everyone , all
    // io.emit("newMessage", {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime(),
    // });

    // broadcast to everyone , except me
    socket.broadcast.emit(
      "newMessage",
      generateMessage(message.from, message.text)
    );
    callback("this is the server");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
