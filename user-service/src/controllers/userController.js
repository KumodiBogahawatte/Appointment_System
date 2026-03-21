const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || undefined // will default to 'patient' if not provided
    });

    res.status(201).json({ message: "User created", userId: user._id, role: user.role });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });


    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role, id: user._id });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const updates = {};

    // Only update provided fields
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (role) updates.role = role;
    
    // Hash password if provided
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    // Check if email already exists (if being updated)
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).select("-password");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated", user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserAppointments = async (req, res) => {
  try {
    // This endpoint would typically call the appointment service
    // For now, return an empty array
    // When appointment service integration is complete, this will fetch real data
    res.json({ 
      userId: req.params.id,
      appointments: [],
      message: "Appointment integration in progress"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.healthCheck = async (req, res) => {
  try {
    res.json({ status: 'User Service is running', port: process.env.PORT });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};