const mongoose = require("mongoose");
const connnectDB = async () => {    
    await mongoose.connect(process.env.MONGO_URI)

    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));
}
module.exports = connnectDB;   