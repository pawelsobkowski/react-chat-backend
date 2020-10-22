const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

router.post("/auth/signUp", authController.signUp);

module.exports = router;
