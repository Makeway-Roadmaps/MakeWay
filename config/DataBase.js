const mongoose = require("mongoose");
require("dotenv").config();

exports.connectDb = () => {
  mongoose
    .connect(process.env.MONGO_DB_URL)
    .then(() => {
      console.log("Connected to MongoDB successfully");
    })
    .catch((error) => {
      console.log("Failed to connect to MongoDB", error);
    });
};
