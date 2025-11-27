import express from "express";
import * as appointmentController from "../controllers/appointmentController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticate, appointmentController.bookAppointment);
router.get("/", authenticate, appointmentController.getUserAppointments);
router.get("/:id", authenticate, appointmentController.getAppointmentDetails);
router.put("/:id", authenticate, appointmentController.updateAppointment);
router.delete("/:id", authenticate, appointmentController.cancelAppointment);

export default router;