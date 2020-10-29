const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const validation = require("../validation/auth.validation");

router.post("/auth/signUp", validation.signUp, authController.signUp);
router.post("/auth/signIn", authController.signIn);

module.exports = router;
