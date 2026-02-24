const express = require("express");
require("dotenv").config();
const proxyRoutes = require("./routes/proxyRoutes");

const app = express();

// Only use express.json() for non-proxied routes (if any)
// app.use(express.json());

app.use("/", proxyRoutes);

app.listen(process.env.PORT, () => {
  console.log(`API Gateway running on port ${process.env.PORT}`);
});