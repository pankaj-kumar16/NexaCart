
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Read JSON request body
app.use(express.json());

// Import cart routes
const cartRoutes = require("./routes/cartRoutes");

// Cart API routes
app.use("/api/cart", cartRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("NexaCart Cart Service is running!");
});

// Connect MongoDB and start server
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Atlas Connected Successfully!");

        const PORT = process.env.PORT || 5003;

        app.listen(PORT, () => {
            console.log(`Cart Service running on port ${PORT}`);
        });

    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
};

startServer();
