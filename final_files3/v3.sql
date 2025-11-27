CREATE DATABASE beauty_clinic;
SHOW DATABASES;
USE beauty_clinic;

-- Patients Table
CREATE TABLE IF NOT EXISTS Patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctors Table
CREATE TABLE IF NOT EXISTS Doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    specialty VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medical Records Table
CREATE TABLE IF NOT EXISTS MedicalRecords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    diagnosis TEXT NOT NULL,
    prescriptions TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_medical_record_patient
      FOREIGN KEY (patient_id) REFERENCES Patients(id)
      ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_medical_record_doctor
      FOREIGN KEY (doctor_id) REFERENCES Doctors(id)
      ON DELETE CASCADE ON UPDATE CASCADE
);

SHOW TABLES;
SHOW COLUMNS FROM MedicalRecords;
SELECT * FROM MedicalRecords;

