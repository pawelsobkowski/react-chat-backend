const { mongoose } = require("../models");
const User = require("../models/user.model");
const Chat = require("../models/chat.model");
const bcrypt = require("bcrypt");

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

exports.usersFindByName = async (req, res) => {
  try {
    const usersTemp = await User.find(
      {
        $and: [
          { _id: { $ne: req.body.userId } },
          { fullName: { $regex: req.body.searchValue, $options: "i" } },
        ],
      },

      "_id fullName photoUrl"
    );
    const userFriendsTemp = await User.find(
      { _id: req.body.userId },
      "-_id friends"
    );
    const [userFriends] = userFriendsTemp;
    const users = usersTemp.map((item) => {
      const user = item.toJSON();
      return {
        ...user,
        isFriend: userFriends.friends.includes(user._id) ? true : false,
      };
    });
    res.send(users);
  } catch (error) {
    res.send(error);
  }
};

exports.updateUser = async (req, res) => {
  const fieldsToUpdate = {};

  if (
    req.body.hasOwnProperty("currentPassword") &&
    req.body.hasOwnProperty("password")
  ) {
    const currentPassword = req.body.currentPassword;
    const { password } = await User.findOne(
      { _id: req.params.id },
      "-_id password"
    );
    const isMatch = await bcrypt.compare(currentPassword, password);
    if (!isMatch) {
      res.status(403).json({ message: "Invalid password" });
      return;
    }
    fieldsToUpdate["password"] = await bcrypt.hash(req.body.password, 10);
  }

  if (Object.keys(req.body).length !== 0) {
    for (const [key, value] of Object.entries(req.body)) {
      if (key !== "currentPassword" && key !== "password") {
        fieldsToUpdate[key] = value;
      }
    }
  }

  User.updateOne({ _id: req.params.id }, fieldsToUpdate, (err) => {
    if (err) {
      res.status(400).json({ message: err });
    }
    res.status(200).json({ message: "Updated successfully" });
  });
};

exports.deleteUser = (req, res) => {
  Chat.deleteMany({ participants: req.params.id }, (err) => {
    if (err) {
      res.status(400).json({ message: err });
    }
    User.updateMany(
      { friends: req.params.id },
      {
        $pull: {
          friends: mongoose.Types.ObjectId(req.params.id),
          invitations: mongoose.Types.ObjectId(req.params.id),
          requests: mongoose.Types.ObjectId(req.params.id),
        },
      },
      (err) => {
        if (err) {
          res.send(err);
        }
        User.deleteOne({ _id: req.params.id }, (err) => {
          if (err) {
            res.status(400).json({ message: err });
          }
          res.status(200).json({ message: "Account deleted" });
        });
      }
    );
  });
};

exports.sendInvitation = (req, res) => {
  User.updateOne(
    { _id: req.body.id },
    {
      $addToSet: { invitations: [mongoose.Types.ObjectId(req.body.userId)] },
    },
    (err) => {
      if (err) {
        res.send(err);
      }
      User.updateOne(
        { _id: req.body.userId },
        {
          $addToSet: { requests: [mongoose.Types.ObjectId(req.body.id)] },
        },
        (err) => {
          if (err) {
            res.send(err);
          }
          res.status(200).send("Friend invitation has been sent");
        }
      );
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
        invitations: mongoose.Types.ObjectId(req.body.id),
      },
    },
    (err) => {
      if (err) {
        res.send(err);
      }
      User.updateOne(
        { _id: req.body.id },
        {
          $push: {
            friends: [mongoose.Types.ObjectId(req.body.userId)],
          },
          $pull: {
            requests: mongoose.Types.ObjectId(req.body.id),
          },
        },
        (err) => {
          if (err) {
            res.send(err);
          }
          const m = {
            content: "New contact. Say Hi",
            userId: req.body.id,
            timestamp: new Date(),
          };

          const chat = new Chat({
            participants: [
              mongoose.Types.ObjectId(req.body.userId),
              mongoose.Types.ObjectId(req.body.id),
            ],
            messages: [m],
          });
          chat.save((err) => {
            if (err) {
              console.log(err);
              res.json({ message: "Cannot initate chat room." });
            }
            res.status(200).json({ message: "New contact has been added" });
          });
        }
      );
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
      User.updateOne(
        { _id: req.body.id },
        {
          $pull: {
            requests: req.body.userId,
          },
        },
        (err) => {
          if (err) {
            res.send(err);
          }
          res.status(200).send("Invitation has been deleted");
        }
      );
    }
  );
};

exports.cancelInvitation = (req, res) => {
  User.updateOne(
    { _id: req.body.userId },
    {
      $pull: {
        requests: req.body.id,
      },
    },
    (err) => {
      if (err) {
        res.send(err);
      }
      User.updateOne(
        { _id: req.body.id },
        {
          $pull: {
            invitations: req.body.userId,
          },
        },
        (err) => {
          if (err) {
            res.send(err);
          }
          res.status(200).send("Invitation has been calcelled");
        }
      );
    }
  );
};
