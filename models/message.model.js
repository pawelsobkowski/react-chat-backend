const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  content: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  timestamp: Date,
});

module.exports = MessageSchema;
