const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userController = require("../controllers/userController");

// Health check
router.get("/health", userController.healthCheck);

// Auth routes
router.post("/signup", userController.signup);
router.post("/login", userController.login);

// List all users (must be before /:id)
router.get("/", userController.getAllUsers);

// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).json({ message: "Invalid user id" });
	}
	next();
};

// User CRUD routes
router.get("/:id", validateObjectId, userController.getUser);
router.put("/:id", validateObjectId, userController.updateUser);
router.delete("/:id", validateObjectId, userController.deleteUser);

// User appointments
router.get("/:id/appointments", validateObjectId, userController.getUserAppointments);

module.exports = router;