
require("dotenv").config();

const express = require("express");
const transporter = require("./config/email");
const notificationRoutes = require("./routes/notificationRoutes");
const app = express();

app.use(express.json());
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "NexaCart Notification Service is running!"
    });
});

const PORT = process.env.PORT || 5005;

app.listen(PORT, async () => {
    console.log(`Notification Service running on port ${PORT}`);

    try {
        await transporter.verify();
        console.log("Gmail SMTP Connected Successfully!");
    } catch (error) {
        console.error("Gmail Connection Failed:", error.message);
    }
});
