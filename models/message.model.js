const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  content: String,
  timestamp: Date,
  userId: String,
});

module.exports = MessageSchema;
