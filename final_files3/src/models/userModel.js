import db from "../config/db.js";

// PATIENTS
export async function findPatientByEmail(email) {
  const [rows] = await db.query("SELECT * FROM Patients WHERE email = ?", [email]);
  return rows[0];
}

export async function createPatient({ name, email, password }) {
  const [result] = await db.query(
    "INSERT INTO Patients (name, email, password) VALUES (?, ?, ?)",
    [name, email, password]
  );
  return result;
}

export async function findPatientById(id) {
  const [rows] = await db.query("SELECT * FROM Patients WHERE id = ?", [id]);
  return rows[0];
}

export async function updatePatient(id, { name, email, password }) {
  const [result] = await db.query(
    "UPDATE Patients SET name = ?, email = ?, password = ? WHERE id = ?",
    [name, email, password, id]
  );
  return result;
}

// DOCTORS
export async function findDoctorByEmail(email) {
  const [rows] = await db.query("SELECT * FROM Doctors WHERE email = ?", [email]);
  return rows[0];
}

export async function createDoctor({ name, email, password, specialty }) {
  const [result] = await db.query(
    "INSERT INTO Doctors (name, email, password, specialty) VALUES (?, ?, ?, ?)",
    [name, email, password, specialty]
  );
  return result;
}

export async function findDoctorById(id) {
  const [rows] = await db.query("SELECT * FROM Doctors WHERE id = ?", [id]);
  return rows[0];
}

export async function updateDoctor(id, { name, email, password, specialty }) {
  const [result] = await db.query(
    "UPDATE Doctors SET name = ?, email = ?, password = ?, specialty = ? WHERE id = ?",
    [name, email, password, specialty, id]
  );
  return result;
}

// ADMINS
export async function findAdminByEmail(email) {
  const [rows] = await db.query("SELECT * FROM Admins WHERE email = ?", [email]);
  return rows[0];
}

export async function createAdmin({ name, email, password }) {
  const [result] = await db.query(
    "INSERT INTO Admins (name, email, password) VALUES (?, ?, ?)",
    [name, email, password]
  );
  return result;
}

export async function findAdminById(id) {
  const [rows] = await db.query("SELECT * FROM Admins WHERE id = ?", [id]);
  return rows[0];
}

export async function updateAdmin(id, { name, email, password }) {
  const [result] = await db.query(
    "UPDATE Admins SET name = ?, email = ?, password = ? WHERE id = ?",
    [name, email, password, id]
  );
  return result;
}

