import express from "express";
import dotenv from "dotenv";
import medicalRecordRoutes from "./src/routes/medicalRecord.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/medical-records", medicalRecordRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Medical Records service running on port ${PORT}`));

