const { mongoose } = require("../models");
const User = require("../models/user.model");

exports.usersFindAll = (req, res) => {
  User.find((err, users) => {
    if (err) {
      return next(err);
    }
    res.send(users);
  });
};

exports.usersFindById = (req, res) => {
  User.findById(req.params.id)
    .populate({ path: "friends", select: "_id fullName photoUrl" })
    .populate({ path: "invitations", select: "_id fullName photoUrl" })
    .then((user) => {
      res.send(user);
    });
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.params.id, { $set: req.body }, (err) => {
    if (err) {
      res.send(err);
    }
    res.send("User updated.");
  });
};

exports.deleteUser = (req, res) => {
  User.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.send(err);
    }
    res.send("User deleted.");
  });
};

exports.sendInvitation = (req, res) => {
  User.findByIdAndUpdate(
    req.body.id,
    {
      $addToSet: { invitations: [mongoose.Types.ObjectId(req.body.userId)] },
    },
    (err) => {
      if (err) {
        res.send(err);
      }
      res.status(200).send("Friend invitation has been sent");
    }
  );
};

exports.acceptInvitation = (req, res) => {
  User.updateOne(
    { _id: req.body.userId },
    {
      $push: {
        friends: [mongoose.Types.ObjectId(req.body.id)],
      },
      $pull: {
        invitations: req.body.id,
      },
    },
    (err) => {
      if (err) {
        res.send(err);
      }
      res.status(200).send("New contact has been added");
    }
  );
};

exports.denyInvitation = (req, res) => {
  User.updateOne(
    { _id: req.body.userId },
    {
      $pull: {
        invitations: req.body.id,
      },
    },
    (err) => {
      if (err) {
        res.send(err);
      }
      res.status(200).send("Invitation has been deleted");
    }
  );
};
