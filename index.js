const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const users = require("./routes/users.routes");
const auth = require("./routes/auth.routes");
const chat = require("./routes/chat.routes");
const db = require("./models/index");

const app = express();
const port = 3001;
const corsOption = {
  origin: "http://localhost:3000",
};

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

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello world" });
});

app.listen(port, () => {
  console.log("Working");
});
