const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

    await user.save((err) => {
      if (err) {
        res
          .status(500)
          .json({ message: "Failed to create new user. Try again." });
      }
      res.status(201).json({ message: "User created successfully." });
    });
  } catch (err) {
    next(err);
  }
};

exports.signIn = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email: email });
  if (user) {
    if (bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ userId: user._id.toString() }, "test", {
        expiresIn: "1h",
      });
      res.status(200).json({ message: "Login successfully", token });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  } else {
    res.status(401).json({ message: "Invalid email" });
  }
};
