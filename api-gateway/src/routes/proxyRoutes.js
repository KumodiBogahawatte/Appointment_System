const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const router = express.Router();

console.log("Loading proxy routes...");
console.log("DOCTOR_SERVICE_URL:", process.env.DOCTOR_SERVICE_URL);
console.log("USER_SERVICE_URL:", process.env.USER_SERVICE_URL);
console.log("APPOINTMENT_SERVICE_URL:", process.env.APPOINTMENT_SERVICE_URL);
console.log("FEEDBACK_SERVICE_URL:", process.env.FEEDBACK_SERVICE_URL);

// Users Service
router.use(
  "/users",
  createProxyMiddleware({
    target: "http://localhost:3001",
    changeOrigin: true,
    pathRewrite: {
      "^/users": ""  // Strip /users prefix before forwarding
    },
    logLevel: "debug"
  })
);

// Doctors Service
router.use(
  "/doctors",
  createProxyMiddleware({
    target: "http://localhost:3002",
    changeOrigin: true,
    pathRewrite: {
      "^/doctors": ""  // Strip /doctors prefix before forwarding
    },
    logLevel: "debug"
  })
);

// Appointments Service
router.use(
  "/appointments",
  createProxyMiddleware({
    target: "http://localhost:3003",
    changeOrigin: true,
    pathRewrite: {
      "^/appointments": ""  // Strip /appointments prefix before forwarding
    },
    logLevel: "debug"
  })
);

// Feedback Service
router.use(
  "/feedback",
  createProxyMiddleware({
    target: "http://localhost:3004",
    changeOrigin: true,
    pathRewrite: {
      "^/feedback": ""  // Strip /feedback prefix before forwarding
    },
    logLevel: "debug"
  })
);

module.exports = router;