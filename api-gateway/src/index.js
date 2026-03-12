const express = require("express");
const cors = require("cors");
require("dotenv").config();
const proxyRoutes = require("./routes/proxyRoutes");

const app = express();

// Enable CORS for frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Only use express.json() for non-proxied routes (if any)
// app.use(express.json());

app.use("/", proxyRoutes);

app.listen(process.env.PORT, () => {
  console.log(`API Gateway running on port ${process.env.PORT}`);
});