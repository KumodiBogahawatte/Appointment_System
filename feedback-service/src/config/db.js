const dns = require('dns');
const mongoose = require('mongoose');

dns.setServers(['8.8.8.8', '8.8.4.4']);
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (_) {}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Feedback Service MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
