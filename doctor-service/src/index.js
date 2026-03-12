const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const doctorRoutes = require("./routes/doctorRoutes");

const app = express();

connectDB();

// Enable CORS
app.use(cors());

app.use(express.json());

app.use("/", doctorRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Doctor Service running on port ${process.env.PORT}`);
});