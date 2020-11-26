const { mongoose } = require("../models");
const User = require("../models/user.model");
const Chat = require("../models/chat.model");

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
          $push: {
            friends: [mongoose.Types.ObjectId(req.body.userId)],
          },
          $pull: {
            requests: req.body.id,
          },
        },
        (err) => {
          if (err) {
            res.send(err);
          }
          const chat = new Chat({
            participants: [
              mongoose.Types.ObjectId(req.body.userId),
              mongoose.Types.ObjectId(req.body.id),
            ],
            messages: [],
          });
          chat.save((err) => {
            if (err) {
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
