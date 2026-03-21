const dns = require('dns');
const mongoose = require('mongoose');

dns.setServers(['8.8.8.8', '8.8.4.4']);
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (_) {}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Appointment Service MongoDB Connected Successfully');
  } catch (error) {
    console.error('✗ Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
