const dns = require("dns");
const mongoose = require("mongoose");

// Windows: Node's DNS can fail on SRV (mongodb+srv) while `nslookup` works.
// Use public DNS before Mongoose resolves _mongodb._tcp...
dns.setServers(["8.8.8.8", "8.8.4.4"]);
try {
  dns.setDefaultResultOrder("ipv4first");
} catch (_) {
  /* older Node */
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;