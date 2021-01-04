const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chat.controller");

router.get("/chat", chatController.chatFindAll);
router.get("/chat/:id", chatController.chatFindById);
router.post("/chat/:id", chatController.sendMessage);
router.get("/chat/user/:id", chatController.chatUserFindAll);

module.exports = router;
