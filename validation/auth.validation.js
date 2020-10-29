const { body, validationResult } = require("express-validator");
const User = require("../models/user.model");

exports.signUp = [
  body("email", "Invalid email.")
    .isEmail()
    .normalizeEmail()
    .custom((value) => {
      return User.findOne({ email: value }).then((user) => {
        console.log(user);
        if (user) {
          return Promise.reject("Email already in use.");
        }
      });
    }),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Length must be at least 8 characters long"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ errors: errors.array(), message: "Validation failed." });
    }
    next();
  },
];
