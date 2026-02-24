const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const router = express.Router();

router.use(
  "/users",
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      // Log the original and rewritten path for debugging
      // console.log('Original path:', path);
      // Always forward as /users/...
      return path.startsWith('/users') ? path : `/users${path}`;
    }
  })
);

router.use(
  "/doctors",
  createProxyMiddleware({
    target: process.env.DOCTOR_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      console.log('Original path:', path);
      return path.startsWith('/doctors') ? path : `/doctors${path}`;
    }
  })
);

router.use(
  "/appointments",
  createProxyMiddleware({
    target: process.env.APPOINTMENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      console.log('Original path:', path);
      return path.startsWith('/appointments') ? path : `/appointments${path}`;
    }
  })
);

router.use(
  "/feedback",
  createProxyMiddleware({
    target: process.env.FEEDBACK_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      console.log('Original path:', path);
      return path.startsWith('/feedback') ? path : `/feedback${path}`;
    }
  })
);

module.exports = router;