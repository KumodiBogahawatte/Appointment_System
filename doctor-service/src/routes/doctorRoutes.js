const express = require("express");
const router = express.Router();

const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
} = require("../controllers/doctorController");

router.get("/doctors", getDoctors);

router.get("/doctors/:id", getDoctorById);

router.post("/doctors", createDoctor);

router.put("/doctors/:id", updateDoctor);

router.delete("/doctors/:id", deleteDoctor);

module.exports = router;