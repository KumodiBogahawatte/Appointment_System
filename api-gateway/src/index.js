const express = require("express");
const cors = require("cors");
require("dotenv").config();
const proxyRoutes = require("./routes/proxyRoutes");

const app = express();

// Enable CORS for frontend
app.use(cors({
  origin: '*',
  credentials: true
}));

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "API Gateway is running" });
});

app.use("/", proxyRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});