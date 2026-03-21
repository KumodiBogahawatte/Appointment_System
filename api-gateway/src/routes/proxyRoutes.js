const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const router = express.Router();

const USER_TARGET = process.env.USER_SERVICE_URL || "http://localhost:3001";
const DOCTOR_TARGET = process.env.DOCTOR_SERVICE_URL || "http://localhost:3002";
const APPOINTMENT_TARGET =
  process.env.APPOINTMENT_SERVICE_URL || "http://localhost:3003";
const FEEDBACK_TARGET = process.env.FEEDBACK_SERVICE_URL || "http://localhost:3004";

/** Avoid 504 when a downstream service is slow to answer (e.g. cold DB). */
const proxyCommon = {
  changeOrigin: true,
  timeout: 120000,
  proxyTimeout: 120000,
};

console.log("Loading proxy routes...");
console.log("USER_SERVICE_URL:", USER_TARGET);
console.log("DOCTOR_SERVICE_URL:", DOCTOR_TARGET);
console.log("APPOINTMENT_SERVICE_URL:", APPOINTMENT_TARGET);
console.log("FEEDBACK_SERVICE_URL:", FEEDBACK_TARGET);

// Users Service
router.use(
  "/users",
  createProxyMiddleware({
    target: USER_TARGET,
    ...proxyCommon,
    pathRewrite: {
      "^/users": "",
    },
    logLevel: "warn",
  })
);

// Doctors Service
router.use(
  "/doctors",
  createProxyMiddleware({
    target: DOCTOR_TARGET,
    ...proxyCommon,
    pathRewrite: {
      "^/doctors": "",
    },
    logLevel: "warn",
  })
);

// Appointments Service
router.use(
  "/appointments",
  createProxyMiddleware({
    target: APPOINTMENT_TARGET,
    ...proxyCommon,
    pathRewrite: {
      "^/appointments": "",
    },
    logLevel: "warn",
  })
);

// Feedback Service
router.use(
  "/feedback",
  createProxyMiddleware({
    target: FEEDBACK_TARGET,
    ...proxyCommon,
    pathRewrite: {
      "^/feedback": "",
    },
    logLevel: "warn",
  })
);

module.exports = router;
