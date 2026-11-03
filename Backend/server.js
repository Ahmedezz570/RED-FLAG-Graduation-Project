const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const connectDB = require("./config/connectionDB");
connectDB();
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/auth", require("./routes/authRoutes"));
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});