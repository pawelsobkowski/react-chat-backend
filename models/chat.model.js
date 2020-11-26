const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Message = require("./message.model");

const ChatSchema = new Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  messages: [Message],
});

module.exports = mongoose.model("Chat", ChatSchema);
