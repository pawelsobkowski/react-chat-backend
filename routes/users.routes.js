const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users.controller");

router.get("/users", usersController.usersFindAll);
router.get("/users/:id", usersController.usersFindById);
router.post("/searchUsers", usersController.usersFindByName);
router.put("/users/:id", usersController.updateUser);
router.put("/sendInvitation", usersController.sendInvitation);
router.put("/acceptInvitation", usersController.acceptInvitation);
router.put("/denyInvitation", usersController.denyInvitation);
router.put("/cancelInvitation", usersController.cancelInvitation);
router.delete("/users/:id", usersController.deleteUser);

module.exports = router;
