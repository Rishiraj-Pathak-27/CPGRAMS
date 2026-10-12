const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');
const { getWelcomeEmailTemplate } = require('../utils/emailTemplates');
const { validationResult } = require('express-validator');

const generateToken = (id) =>
    jwt.sign({ id: String(id) }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        fullName,
        gender,
        phoneNumber,
        role = 'user',
        address,
        city,
        state,
        district,
        pincode,
        email,
        password,
    } = req.body;

    try {
        const normalizedEmail = String(email || '').trim().toLowerCase();

        if (!normalizedEmail) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const requestedRole = role.toLowerCase();

        if (['officer', 'lead_officer', 'admin'].includes(requestedRole)) {
            if (!req.user || !req.user.role) {
                return res.status(403).json({ message: 'Not authorized to assign this role' });
            }

            const requesterRole = req.user.role.toLowerCase();

            if (requestedRole === 'officer' && !['admin', 'lead_officer'].includes(requesterRole)) {
                return res.status(403).json({ message: 'Only Admin or Lead Officer can register an Officer' });
            }

            if (requestedRole === 'lead_officer' && requesterRole !== 'admin') {
                return res.status(403).json({ message: 'Only Admin can register a Lead Officer' });
            }

            if (requestedRole === 'admin') {
                return res.status(403).json({ message: 'Cannot register Admin via API' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            gender,
            phoneNumber,
            role: requestedRole,
            address,
            city,
            state,
            district,
            pincode,
            email: normalizedEmail,
            password: hashedPassword,
        });

        // Send welcome email (non-blocking — don't fail registration if email fails)
        try {
            const subject = 'Welcome to CPGRAMS Grievance Redressal System';
            const html = getWelcomeEmailTemplate(user.fullName);
            await sendEmail(user.email, subject, html);
        } catch (emailErr) {
            console.error('Welcome email failed (non-fatal):', emailErr.message);
        }

        const token = requestedRole === 'user' ? generateToken(user._id) : null;

        res.status(201).json({
            _id: user._id,
            name: user.fullName,
            email: user.email,
            role: user.role,
            ...(token && { token }),
            message: 'User registered successfully',
        });
    } catch (error) {
        console.error('Registration Error:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email or phone number already exists' });
        }

        res.status(500).json({ message: 'Server error' });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const normalizedEmail = String(email || '').trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);
        const safeUser = user.select('-password');

        res.status(200).json({
            _id: user._id,
            name: user.fullName,
            email: user.email,
            role: user.role,
            user: safeUser,
            token,
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
