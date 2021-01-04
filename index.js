const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const users = require("./routes/users.routes");
const auth = require("./routes/auth.routes");
const chat = require("./routes/chat.routes");
const db = require("./models/index");
const http = require("http");
const socketio = require("socket.io");

const port = 3001;
const corsOption = {
  origin: "http://localhost:3000",
};

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New connection");
  socket.on("join", (roomId) => {
    socket.join(roomId);
  });
  socket.on("sendMessage", (data, callback) => {
    io.to(data.roomId).emit("message", {
      _id: Math.random() * 1000,
      content: data.messageInput,
      userId: data.userId,
    });
    callback();
  });
  socket.on("disconnect", () => {
    console.log("User left");
  });
});

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

app.use(cors(corsOption));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(users);
app.use(auth);
app.use(chat);

server.listen(port);
