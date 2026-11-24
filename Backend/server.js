const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const connectDB = require("./config/connectionDB");
connectDB();
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("Welcome to the API server for RED FLAG Application");
});


app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});