import db from "../config/db.js";

export async function createAppointment({ patient_id, doctor_id, appointment_date, appointment_time, notes = '' }) {
  const [result] = await db.query(
    "INSERT INTO Appointments (patient_id, doctor_id, appointment_date, appointment_time, notes, status) VALUES (?, ?, ?, ?, ?, 'scheduled')",
    [patient_id, doctor_id, appointment_date, appointment_time, notes]
  );
  return result;
}

export async function getAppointmentsByPatient(patient_id) {
  const [rows] = await db.query(
    `SELECT a.*, d.name as doctor_name, d.specialty 
     FROM Appointments a 
     JOIN Doctors d ON a.doctor_id = d.id 
     WHERE a.patient_id = ? 
     ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
    [patient_id]
  );
  return rows;
}

export async function getAppointmentsByDoctor(doctor_id) {
  const [rows] = await db.query(
    `SELECT a.*, p.name as patient_name, p.email as patient_email
     FROM Appointments a 
     JOIN Patients p ON a.patient_id = p.id 
     WHERE a.doctor_id = ? 
     ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
    [doctor_id]
  );
  return rows;
}

export async function updateAppointmentStatus(id, status) {
  const [result] = await db.query(
    "UPDATE Appointments SET status = ? WHERE id = ?",
    [status, id]
  );
  return result;
}

export async function updateAppointment(id, { appointment_date, appointment_time, notes }) {
  const [result] = await db.query(
    "UPDATE Appointments SET appointment_date = ?, appointment_time = ?, notes = ? WHERE id = ?",
    [appointment_date, appointment_time, notes, id]
  );
  return result;
}

export async function deleteAppointment(id) {
  const [result] = await db.query("DELETE FROM Appointments WHERE id = ?", [id]);
  return result;
}

export async function checkAppointmentConflict(doctor_id, appointment_date, appointment_time, exclude_id = null) {
  let query = `SELECT * FROM Appointments 
               WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? 
               AND status != 'cancelled'`;
  
  const params = [doctor_id, appointment_date, appointment_time];
  
  if (exclude_id) {
    query += " AND id != ?";
    params.push(exclude_id);
  }
  
  const [rows] = await db.query(query, params);
  return rows[0];
}

export async function getAppointmentById(id) {
  const [rows] = await db.query(
    `SELECT a.*, p.name as patient_name, d.name as doctor_name, d.specialty
     FROM Appointments a
     JOIN Patients p ON a.patient_id = p.id
     JOIN Doctors d ON a.doctor_id = d.id
     WHERE a.id = ?`,
    [id]
  );
  return rows[0];
}