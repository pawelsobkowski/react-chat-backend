const User = require("../models/user.model");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res, next) => {
  const fullName = req.body.fullName;
  const email = req.body.email;
  const password = req.body.password;
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullName: fullName,
      email: email,
      password: encryptedPassword,
      photoUrl: "",
      status: true,
      friends: [],
    });

    user.save((err) => {
      if (err) {
        res.status(500).send("Failed to create new user. Try again.");
      }
      res.status(201).send("User created successfully.");
    });
  } catch (err) {
    next(err);
  }
};
