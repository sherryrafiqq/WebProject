import express from "express";
import { authenticate } from "../middleware/auth.js";
import * as medicalRecordController from "../controllers/medicalRecordController.js";

const router = express.Router();

router.post("/", authenticate, medicalRecordController.addMedicalRecord);
router.get("/:patientId", authenticate, medicalRecordController.getMedicalRecords);
router.put("/:id", authenticate, medicalRecordController.updateMedicalRecord);
router.delete("/:id", authenticate, medicalRecordController.deleteMedicalRecord);

export default router;

