import db from "../config/db.js";

export async function createMedicalRecord({
  patient_id,
  doctor_id,
  diagnosis,
  prescriptions,
  notes,
}) {
  const [result] = await db.query(
    `INSERT INTO MedicalRecords (
        patient_id,
        doctor_id,
        diagnosis,
        prescriptions,
        notes
      ) VALUES (?, ?, ?, ?, ?)`,
    [patient_id, doctor_id, diagnosis, prescriptions, notes]
  );
  return result;
}

export async function getRecordsByPatient(patient_id, doctor_scope_id = null) {
  let query = `SELECT mr.*,
                      p.name AS patient_name,
                      d.name AS doctor_name,
                      d.specialty
               FROM MedicalRecords mr
               JOIN Patients p ON mr.patient_id = p.id
               JOIN Doctors d ON mr.doctor_id = d.id
               WHERE mr.patient_id = ?`;
  const params = [patient_id];

  if (doctor_scope_id) {
    query += " AND mr.doctor_id = ?";
    params.push(doctor_scope_id);
  }

  query += " ORDER BY mr.created_at DESC";

  const [rows] = await db.query(query, params);
  return rows;
}

export async function getRecordById(id) {
  const [rows] = await db.query(
    `SELECT mr.*,
            p.name AS patient_name,
            d.name AS doctor_name
     FROM MedicalRecords mr
     JOIN Patients p ON mr.patient_id = p.id
     JOIN Doctors d ON mr.doctor_id = d.id
     WHERE mr.id = ?`,
    [id]
  );
  return rows[0];
}

export async function updateMedicalRecord(id, { diagnosis, prescriptions, notes }) {
  const fields = [];
  const values = [];

  if (diagnosis !== undefined) {
    fields.push("diagnosis = ?");
    values.push(diagnosis);
  }
  if (prescriptions !== undefined) {
    fields.push("prescriptions = ?");
    values.push(prescriptions);
  }
  if (notes !== undefined) {
    fields.push("notes = ?");
    values.push(notes);
  }

  if (!fields.length) {
    return { affectedRows: 0 };
  }

  fields.push("updated_at = CURRENT_TIMESTAMP");

  const [result] = await db.query(
    `UPDATE MedicalRecords SET ${fields.join(", ")} WHERE id = ?`,
    [...values, id]
  );
  return result;
}

export async function deleteMedicalRecord(id) {
  const [result] = await db.query("DELETE FROM MedicalRecords WHERE id = ?", [id]);
  return result;
}

