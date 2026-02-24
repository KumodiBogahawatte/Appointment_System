const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

connectDB();   // Connect to MongoDB

const app = express();
app.use(express.json());

app.use("/users", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`User Service running on port ${process.env.PORT}`);
});