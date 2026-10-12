const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

exports.createOfficer = async (req, res, next) => {
    try {
        const { fullName, email, password, department } = req.body;
        const normalizedEmail = String(email || '').trim().toLowerCase();
        const existing = await User.findOne({
            email: normalizedEmail,
        });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Officer already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            email: normalizedEmail,
            password: hashedPassword,
            department,
            role: "officer",
        });
        const token = generateToken(user._id);
        res.status(201).json({
            success: true,
            message: "Officer created successfully",
            user,
            token,
        });
    } catch (error) {
       next(error);
    }
};

exports.promoteOfficer = async (req, res, next) => {
    try {
        const { officerId } = req.params;
        const officer = await User.findById(officerId);
        if (!officer) {
            return res.status(404).json({
                success: false,
                message: "Officer not found",
            });
        }
        officer.role = "lead_officer";
        await officer.save();
        res.status(200).json({
            success: true,
            message: "Officer promoted to lead officer",
            officer,
        });
    } catch (error) {
        next(error);
    }
}
