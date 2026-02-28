const express = require("express");
const router = express.Router();
const authMiddleware = require("../utils/authMiddleware");
const chatController = require("../controllers/chatController");

router.post("/", authMiddleware, chatController.chat);

module.exports = router;
