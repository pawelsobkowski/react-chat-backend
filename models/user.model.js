const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
  fullName: String,
  photoUrl: String,
  email: String,
  password: String,
  status: Boolean,
  friends: Array,
});

module.exports = mongoose.model("Users", UsersSchema);
