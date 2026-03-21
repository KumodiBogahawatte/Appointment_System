const express = require("express");
const router = express.Router();

const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorAvailability,
  getDoctorAppointments,
  getDoctorFeedback,
  healthCheck
} = require("../controllers/doctorController");

// Health check
router.get("/health", healthCheck);

// Doctor CRUD (API Gateway prepends /doctors via pathRewrite)
router.get("/", getDoctors);
router.post("/", createDoctor);

router.get("/:id", getDoctorById);
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

// Doctor additional endpoints
router.get("/:id/availability", getDoctorAvailability);
router.get("/:id/appointments", getDoctorAppointments);
router.get("/:id/feedback", getDoctorFeedback);

module.exports = router;