
const express = require("express");
const router = express.Router();

const {
    sendEmail
} = require("../controllers/notificationController");

const serviceAuthMiddleware = require("../middleware/serviceAuthMiddleware");

// Protected Email API
router.post("/email", serviceAuthMiddleware, sendEmail);

// Notification Service Health Check
router.get("/", (req, res) => {
    res.status(200).json({
        message: "NexaCart Notification Service is running!"
    });
});

module.exports = router;
