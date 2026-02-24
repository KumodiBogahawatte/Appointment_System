require("dotenv").config();

module.exports = {
  USER_SERVICE: process.env.USER_SERVICE_URL,
  DOCTOR_SERVICE: process.env.DOCTOR_SERVICE_URL,
  APPOINTMENT_SERVICE: process.env.APPOINTMENT_SERVICE_URL,
  FEEDBACK_SERVICE: process.env.FEEDBACK_SERVICE_URL
};