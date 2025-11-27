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
    const { role, id: requesterId } = req.user;
    assertDoctorOrAdmin(role);

    const { patient_id, doctor_id, diagnosis, prescriptions, notes } = req.body;
    if (!patient_id || !diagnosis) {
      return res
        .status(400)
        .json({ message: "patient_id and diagnosis are required" });
    }

    let assignedDoctorId = doctor_id;
    if (role === "doctor") {
      assignedDoctorId = requesterId;
    }
    if (!assignedDoctorId) {
      return res.status(400).json({ message: "doctor_id is required" });
    }

    const result = await medicalRecordModel.createMedicalRecord({
      patient_id,
      doctor_id: assignedDoctorId,
      diagnosis,
      prescriptions: prescriptions || null,
      notes: notes || null,
    });

    res
      .status(201)
      .json({ message: "Medical record created successfully", recordId: result.insertId });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message || "Server error" });
  }
}

export async function getMedicalRecords(req, res) {
  try {
    const { patientId } = req.params;
    const { role, id } = req.user;

    if (role === "patient" && Number(patientId) !== id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const doctorScope = role === "doctor" ? id : null;
    const records = await medicalRecordModel.getRecordsByPatient(patientId, doctorScope);

    if (role === "doctor" && !records.length) {
      return res
        .status(404)
        .json({ message: "No medical records found for this patient under your care" });
    }

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
}

export async function updateMedicalRecord(req, res) {
  try {
    const { id: recordId } = req.params;
    const { role, id } = req.user;

    if (role === "patient") {
      return res.status(403).json({ message: "Access denied" });
    }

    const record = await medicalRecordModel.getRecordById(recordId);
    if (!record) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    if (role === "doctor" && record.doctor_id !== id) {
      return res.status(403).json({ message: "Access denied" });
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
    const { role, id } = req.user;

    if (role === "patient") {
      return res.status(403).json({ message: "Access denied" });
    }

    const record = await medicalRecordModel.getRecordById(recordId);
    if (!record) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    if (role === "doctor" && record.doctor_id !== id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await medicalRecordModel.deleteMedicalRecord(recordId);
    res.json({ message: "Medical record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
}

