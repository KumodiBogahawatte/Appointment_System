const Doctor = require("../models/doctorModel");

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor)
      return res.status(404).json({ message: "Doctor not found" });

    res.json(doctor);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createDoctor = async (req, res) => {
  try {
    const { name, specialization, contact } = req.body;

    const doctor = new Doctor({
      name,
      specialization,
      contact
    });

    await doctor.save();

    res.status(201).json(doctor);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const { name, specialization, contact } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { name, specialization, contact },
      { new: true, runValidators: true }
    );

    if (!doctor)
      return res.status(404).json({ message: "Doctor not found" });

    res.json(doctor);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor)
      return res.status(404).json({ message: "Doctor not found" });

    res.json({ message: "Doctor deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};