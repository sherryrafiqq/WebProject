import * as appointmentModel from "../models/appointmentModel.js";

export async function bookAppointment(req, res) {
  try {
    const { doctor_id, appointment_date, appointment_time, notes } = req.body;
    const patient_id = req.user.id;

    if (!doctor_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ 
        message: "All fields are required: doctor_id, appointment_date, appointment_time" 
      });
    }

    const conflict = await appointmentModel.checkAppointmentConflict(
      doctor_id, 
      appointment_date, 
      appointment_time
    );
    
    if (conflict) {
      return res.status(400).json({ message: "This time slot is already booked" });
    }

    const result = await appointmentModel.createAppointment({
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      notes
    });

    res.status(201).json({ 
      message: "Appointment booked successfully", 
      appointmentId: result.insertId 
    });
  } catch (err) {
    console.error("Error booking appointment:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getUserAppointments(req, res) {
  try {
    const user_id = req.user.id;
    const user_role = req.user.role;

    let appointments;
    if (user_role === 'patient') {
      appointments = await appointmentModel.getAppointmentsByPatient(user_id);
    } else if (user_role === 'doctor') {
      appointments = await appointmentModel.getAppointmentsByDoctor(user_id);
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(appointments);
  } catch (err) {
    console.error("Error getting appointments:", err);
    res.status(500).json({ message: "Server error"});
  }
}

export async function cancelAppointment(req, res) {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const user_role = req.user.role;

    const appointment = await appointmentModel.getAppointmentById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (user_role === 'patient' && appointment.patient_id !== user_id) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    if (user_role === 'doctor' && appointment.doctor_id !== user_id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await appointmentModel.updateAppointmentStatus(id, 'cancelled');
    res.json({ message: "Appointment cancelled successfully"});
  } catch (err) {
    console.error("Error cancelling appointment:", err);
    res.status(500).json({ message: "Server error"});
  }
}

export async function updateAppointment(req, res) {
  try {
    const { id } = req.params;
    const { appointment_date, appointment_time, status, notes } = req.body;
    const user_id = req.user.id;
    const user_role = req.user.role;

    const appointment = await appointmentModel.getAppointmentById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found"});
    }

    if (user_role === 'patient' && appointment.patient_id !== user_id) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    if (user_role === 'doctor' && appointment.doctor_id !== user_id) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (status) {
      await appointmentModel.updateAppointmentStatus(id, status);
    }

    if (appointment_date && appointment_time) {
      const conflict = await appointmentModel.checkAppointmentConflict(
        appointment.doctor_id, 
        appointment_date, 
        appointment_time, 
        id
      );
      
      if (conflict) {
        return res.status(400).json({ message: "This time slot is already booked" });
      }

      await appointmentModel.updateAppointment(id, {
        appointment_date,
        appointment_time,
        notes: notes || appointment.notes
      });
    }

    res.json({ message: "Appointment updated successfully" });
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).json({ message: "Server error"});
  }
}

export async function getAppointmentDetails(req, res) {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const user_role = req.user.role;

    const appointment = await appointmentModel.getAppointmentById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found"});
    }

    if (user_role === 'patient' && appointment.patient_id !== user_id) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    if (user_role === 'doctor' && appointment.doctor_id !== user_id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(appointment);
  } catch (err) {
    console.error("Error getting appointment details:", err);
    res.status(500).json({ message: "Server error" });
  }
}