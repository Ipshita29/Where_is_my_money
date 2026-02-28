const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../utils/authMiddleware");
const uploadController = require("../controllers/uploadController");

// Create uploads folder if missing
const fs = require("fs");
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

// MULTER STORAGE CONFIG
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// ROUTE
router.post(
    "/",
    authMiddleware,
    upload.single("statement"),
    uploadController.uploadStatement
);

module.exports = router;