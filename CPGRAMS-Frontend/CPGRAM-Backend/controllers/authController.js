const User = require("../models/userModel"); // Keep only if officer functions still use it.
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { getPool } = require("../config/db");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

exports.registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Missing Information",
        errors: errors.array(),
      });
    }

    const {
      fullName,
      gender,
      address,
      city,
      state,
      district,
      pincode,
      phoneNumber,
      email,
      password,
    } = req.body;

    const requiredValues = [
      fullName,
      gender,
      address,
      city,
      state,
      district,
      pincode,
      phoneNumber,
      email,
      password,
    ];

    if (requiredValues.some((value) => !String(value || "").trim())) {
      return res.status(400).json({
        success: false,
        message: "Missing Information",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedMobile = phoneNumber.trim();
    const pool = getPool();

    const [existingUsers] = await pool.execute(
      `SELECT srno FROM signup
       WHERE email = ? OR mobile_number = ?
       LIMIT 1`,
      [normalizedEmail, normalizedMobile]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email or mobile number is already registered.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      `INSERT INTO signup (
        full_name,
        gender,
        address,
        city,
        state,
        district,
        pincode,
        mobile_number,
        email,
        password_hash
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fullName.trim(),
        gender,
        address.trim(),
        city.trim(),
        state.trim(),
        district.trim(),
        pincode.trim(),
        normalizedMobile,
        normalizedEmail,
        passwordHash,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      token: generateToken(result.insertId),
      user: {
  srno: user.srno,
  fullName: user.full_name,
  gender: user.gender,
  address: user.address,
  city: user.city,
  state: user.state,
  district: user.district,
  pincode: user.pincode,
  email: user.email,
  phoneNumber: user.mobile_number,
  role: "user",
},
    });
  } catch (error) {
    console.error("Registration error:", error);
    return next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const pool = getPool();

    const [users] = await pool.execute(
  `SELECT
    srno,
    full_name,
    gender,
    address,
    city,
    state,
    district,
    pincode,
    email,
    mobile_number,
    password_hash
   FROM signup
   WHERE email = ?
   LIMIT 1`,
  [normalizedEmail]
);

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const user = users[0];

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token: generateToken(user.srno),
      role: "user",
      user: {
        srno: user.srno,
        fullName: user.full_name,
        email: user.email,
        phoneNumber: user.mobile_number,
        role: "user",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return next(error);
  }
};
