const mongoose = require("mongoose");

let cached = global.mongooseConn;

const connectDB = async () => {
  if (cached) return cached;

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  cached = global.mongooseConn = await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 8000,
  });

  console.log("MongoDB connected");
  return cached;
};

module.exports = connectDB;