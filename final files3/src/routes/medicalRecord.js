import express from "express";
// import { authenticate } from "../middleware/auth.js";  <- comment out
import * as medicalRecordController from "../controllers/medicalRecordController.js";

const router = express.Router();

router.post("/", medicalRecordController.addMedicalRecord);
router.get("/:patientId", medicalRecordController.getMedicalRecords);
router.put("/:id", medicalRecordController.updateMedicalRecord);
router.delete("/:id", medicalRecordController.deleteMedicalRecord);

export default router;

