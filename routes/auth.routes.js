const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

router.post("/auth/signUp", authController.signUp);
router.post("/auth/signIn", authController.signIn);

module.exports = router;
