import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Student from '../models/student.js';
import Admin from '../models/admin.js';

dotenv.config();
const router = express.Router();

//Admin
const generateAdminToken = (admin) => {
    return jwt.sign({ userId: admin._id, role: 'admin' }, process.env.JWT_SECRET,{ expiresIn: '60d' });
};

router.post('/alogin', async (req, res) => {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: 'Admin not found' });

    if (admin.password !== password) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateAdminToken(admin);
    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 300000});
    res.json({ message: 'Admin login successful', admin: {id: admin._id} });
});

router.post('/alogout', (req, res) => {
    res.clearCookie("token");
    res.json({ message: 'Logged out of Admin' });
});

router.post('/admincreate', async (req, res) => {
    const { username, password } = req.body;

    try {
        const newAdmin = new Admin({ username, password })
        await newAdmin.save();

        res.status(201).json(newAdmin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//Student
const generateToken = (student) => {
    return jwt.sign({ userId: student._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

router.post('/slogin', async (req, res) => {
    const { username, password } = req.body;

    const number = username;

    const student = await Student.findOne({ number });
    if (!student) return res.status(400).json({ message: 'Student not found' });

    if (student.password !== password) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(student);
    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 300000});
    res.json({ message: 'Login successful', student: {id: student._id, name: student.firstName} });
});

router.post('/slogout', (req, res) => {
    res.clearCookie("token");
    res.json({ message: 'Logged out' });
});

export default router;