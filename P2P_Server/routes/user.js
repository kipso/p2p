const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user_controller');
const MessageController = require('../controllers/message_controller');
const middleware = require('../middleware/middleware');

//Handle requests to route "/user"

// router.get("/:userId", UserController.get_user);
router.post("/login", UserController.user_login)

router.post("/registration", UserController.user_signup);

router.get("/users",middleware.checkToken, UserController.get_users);

router.get("/coversation/:id",middleware.checkToken,MessageController.get_conversations);

router.post("/send-message",middleware.checkToken,MessageController.save_message);

router.delete("/logout",middleware.checkToken,UserController.user_logout);

module.exports = router;