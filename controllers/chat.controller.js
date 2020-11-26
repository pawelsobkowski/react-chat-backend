const Chat = require("../models/chat.model");

exports.chatFindAll = (req, res) => {
  Chat.find((err, chats) => {
    if (err) {
      return next(err);
    }
    res.send(chats);
  });
};

exports.chatUserFindAll = (req, res) => {
  Chat.find({ participants: req.params.id })
    .populate({ path: "participants", select: "_id fullName photoUrl" })
    .then((err, chats) => {
      if (err) {
        res.send(err);
      }
      res.send(chats);
    });
};
