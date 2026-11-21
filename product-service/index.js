
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Middleware to read JSON data
app.use(express.json());

// Import product routes
const productRoutes = require("./routes/productRoutes");

// Product API routes
app.use("/api/products", productRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("NexaCart Product Service is running!");
});

// Start server and connect MongoDB
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Atlas Connected Successfully!");

        const PORT = process.env.PORT || 5002;

        app.listen(PORT, () => {
            console.log(`Product Service running on port ${PORT}`);
        });

    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
};

startServer();
