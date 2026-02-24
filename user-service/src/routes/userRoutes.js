const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userController = require("../controllers/userController");

router.post("/signup", userController.signup);
router.post("/login", userController.login);

// Middleware to validate ObjectId
router.get("/:id", (req, res, next) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).json({ message: "Invalid user id" });
	}
	next();
}, userController.getUser);

module.exports = router;