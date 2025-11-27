// controllers/userController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userModel from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

// REGISTER 
export async function register(req, res) {
    try {
        const { name, email, password, role, specialty } = req.body;

        let existingUser;
        if (role === "patient") existingUser = await userModel.findPatientByEmail(email);
        else if (role === "doctor") existingUser = await userModel.findDoctorByEmail(email);
        else if (role === "admin") existingUser = await userModel.findAdminByEmail(email);
        else return res.status(400).json({ message: "Invalid role" });

        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        let result;
        if (role === "patient") {
            result = await userModel.createPatient({ name, email, password: hashedPassword });
        } else if (role === "doctor") {
            result = await userModel.createDoctor({ name, email, password: hashedPassword, specialty });
        } else if (role === "admin") {
            result = await userModel.createAdmin({ name, email, password: hashedPassword });
        }

        res.status(201).json({ message: "User registered successfully", userId: result.insertId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// LOGIN 
export async function login(req, res) {
    try {
        const { email, password, role } = req.body;

        let user;
        if (role === "patient") user = await userModel.findPatientByEmail(email);
        else if (role === "doctor") user = await userModel.findDoctorByEmail(email);
        else if (role === "admin") user = await userModel.findAdminByEmail(email);
        else return res.status(400).json({ message: "Invalid role" });

        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// GET PROFILE 
export async function getProfile(req, res) {
    try {
        const { id, role } = req.user; 

        let user;
        if (role === "patient") user = await userModel.findPatientById(id);
        else if (role === "doctor") user = await userModel.findDoctorById(id);
        else if (role === "admin") user = await userModel.findAdminById(id);
        else return res.status(400).json({ message: "Invalid role" });

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            role, 
            specialty: user.specialty || null 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
// UPDATE PROFILE
export async function updateProfile(req, res) {
    try {
        const { id, role } = req.user; 
        const { name, email, password, specialty } = req.body;

        let user;
        if (role === "patient") user = await userModel.findPatientById(id);
        else if (role === "doctor") user = await userModel.findDoctorById(id);
        else if (role === "admin") user = await userModel.findAdminById(id);
        else return res.status(400).json({ message: "Invalid role" });

        if (!user) return res.status(404).json({ message: "User not found" });
        const updatedName = name || user.name;
        const updatedEmail = email || user.email;
        let updatedPassword = user.password;
        if (password) {
            updatedPassword = await bcrypt.hash(password, 10);
        }
        const updatedSpecialty = specialty || (user.specialty || null);

        let result;
        if (role === "patient") {
            result = await userModel.updatePatient(id, { name: updatedName, email: updatedEmail, password: updatedPassword });
        } else if (role === "doctor") {
            result = await userModel.updateDoctor(id, { name: updatedName, email: updatedEmail, password: updatedPassword, specialty: updatedSpecialty });
        } else if (role === "admin") {
            result = await userModel.updateAdmin(id, { name: updatedName, email: updatedEmail, password: updatedPassword });
        }

        res.json({ message: "Profile updated successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

