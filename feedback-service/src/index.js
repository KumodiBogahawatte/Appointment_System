const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();

// Connect to database
connectDB();

// Enable CORS
app.use(cors());

app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Feedback Service is running', port: process.env.PORT });
});

// Routes
app.use('/', feedbackRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Feedback Service running on port ${process.env.PORT}`);
});
