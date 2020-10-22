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
  User.findById(req.params.id, (err, user) => {
    if (err) {
      return next(err);
    }
    res.send(user);
  });
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.params.id, { $set: req.body }, (err) => {
    if (err) {
      return next(err);
    }
    res.send("User updated.");
  });
};

exports.deleteUser = (req, res) => {
  User.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      return next(err);
    }
    res.send("User deleted.");
  });
};
