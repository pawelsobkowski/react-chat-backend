const Chat = require("../models/chat.model");

exports.chatFindAll = (req, res) => {
  Chat.find((err, chats) => {
    if (err) {
      return next(err);
    }
    res.send(chats);
  });
};

exports.chatFindById = (req, res) => {
  Chat.find({ _id: req.params.id })
    .populate({ path: "participants", select: "_id fullName photoUrl" })
    .then((err, chats) => {
      if (err) {
        res.send(err);
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

exports.sendMessage = (req, res) => {
  const message = {
    content: req.body.content,
    userId: req.body.userId,
    timestamp: new Date(),
  };

  Chat.updateOne(
    { _id: req.params.id },
    { $addToSet: { messages: [message] } },
    (err) => {
      if (err) {
        res.send(err);
      }
      res.status(200).send("Message sent.");
    }
  );
};
