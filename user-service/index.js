
/*const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("NexaCart User Service is running!");
});

const PORT = 5001;

app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});
*/

require("dotenv").config();
const userRoutes = require("./routes/userRoutes");

const express = require("express");
const mongoose = require("mongoose");


const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("NexaCart User Service is running!");
});

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Atlas Connected Successfully!");

        const PORT = process.env.PORT || 5001;

        app.listen(PORT, () => {
            console.log(`User Service running on port ${PORT}`);
        });

    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
};

startServer();

