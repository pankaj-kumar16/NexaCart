
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Middleware to read JSON data
app.use(express.json());

const orderRoutes = require("./routes/orderRoutes");

app.use("/api/orders", orderRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("NexaCart Order Service is running!");
});

// Start server
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Atlas Connected Successfully!");

        const PORT = process.env.PORT || 5004;

        app.listen(PORT, () => {
            console.log(`Order Service running on port ${PORT}`);
        });

    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
};

startServer();
