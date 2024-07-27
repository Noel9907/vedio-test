const express = require("express");
const app = express();
const http = require("http");
const socketIo = require("socket.io");

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { RoomId: "someRoomId" });
});

const server = http.Server(app);
const io = socketIo(server);

server.listen(4000, () => {
  console.log("Server running on port 4000");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("newUser", (id) => {
    socket.join("/");
    socket.to("/").broadcast.emit("userJoined", id);
  });
});
