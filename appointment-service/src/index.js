const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Mount routes without /appointments prefix (API Gateway already adds it)
app.use('/', appointmentRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`✓ Appointment Service running on port ${PORT}`);
});
