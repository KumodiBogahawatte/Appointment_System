const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

connectDB();   // Connect to MongoDB

const app = express();

// Enable CORS
app.use(cors());

app.use(express.json());

// Mount routes without /users prefix (API Gateway already adds it)
app.use("/", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`User Service running on port ${process.env.PORT}`);
});