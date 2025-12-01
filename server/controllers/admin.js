import generateToken from '../utils/jwt.js';
import { loginAdmin } from "../models/admin.js";

// Admin Login Controller
export async function adminLogin(req, res) {
    try {
        const { email, password } = req.body;
        const admin = await loginAdmin(email);

        if (!admin) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const [dbEmail, dbPassword] = admin;

        if (password !== dbPassword) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = generateToken(admin);

        res.status(200).json({ message: "Admin login successful", token });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Server error during login" });
    }
};
