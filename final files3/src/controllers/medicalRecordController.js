import * as medicalRecordModel from "../models/medicalRecordModel.js";

function assertDoctorOrAdmin(role) {
  if (role !== "doctor" && role !== "admin") {
    const err = new Error("Access denied");
    err.statusCode = 403;
    throw err;
  }
}

export async function addMedicalRecord(req, res) {
  try {
    console.log("BODY RECEIVED:", req.body);  // <--- log it

    const { patient_id, doctor_id, diagnosis, prescriptions, notes } = req.body;

    // temporarily just return the data instead of DB
    return res.status(201).json({
      message: "POST received",
      data: { patient_id, doctor_id, diagnosis, prescriptions, notes }
    });
  } catch (error) {
    console.error("ADD RECORD ERROR:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getMedicalRecords(req, res) {
  try {
    const { patientId } = req.params;
    // Bypassing auth - allow access to all records
    const records = await medicalRecordModel.getRecordsByPatient(patientId, null);

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
}

export async function updateMedicalRecord(req, res) {
  try {
    const { id: recordId } = req.params;
    // Bypassing auth - allow all updates

    const record = await medicalRecordModel.getRecordById(recordId);
    if (!record) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    const { diagnosis, prescriptions, notes } = req.body;
    if (
      diagnosis === undefined &&
      prescriptions === undefined &&
      notes === undefined
    ) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    await medicalRecordModel.updateMedicalRecord(recordId, {
      diagnosis,
      prescriptions,
      notes,
    });

    res.json({ message: "Medical record updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
}

export async function deleteMedicalRecord(req, res) {
  try {
    const { id: recordId } = req.params;
    // Bypassing auth - allow all deletions

    const record = await medicalRecordModel.getRecordById(recordId);
    if (!record) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    await medicalRecordModel.deleteMedicalRecord(recordId);
    res.json({ message: "Medical record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
}

