const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
    console.log("inside database");
    try {
        const MONGO_URI = process.env.MONGODB_URL_LOCAL;

        // Check if MONGO_URI is defined
        if (!MONGO_URI) {
            throw new Error("MONGO_URI is not defined in the environment variables");
        }

        // Connect to MongoDB
        const db = await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB not connected");
        console.log(error.message); // Log the specific error message
        process.exit(1); // Exit the process with failure
    }
};

module.exports = dbConnect;
