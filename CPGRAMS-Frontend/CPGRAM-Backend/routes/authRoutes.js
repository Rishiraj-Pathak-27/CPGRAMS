const express = require("express");
const { body } = require("express-validator");
const { registerUser, loginUser } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

const registerValidators = [
  body("fullName").trim().notEmpty().withMessage("Full name is required"),
  body("gender")
    .isIn(["Male", "Female", "Transgender"])
    .withMessage("Valid gender is required"),
  body("address").trim().notEmpty().withMessage("Address is required"),
  body("city").trim().notEmpty().withMessage("City is required"),
  body("state").trim().notEmpty().withMessage("State is required"),
  body("district").trim().notEmpty().withMessage("District is required"),
  body("pincode")
    .matches(/^\d{6}$/)
    .withMessage("Pincode must contain 6 digits"),
  body("phoneNumber")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Valid 10-digit mobile number is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

router.post("/register", registerValidators, registerUser);

router.post(
  "/admin/register",
  protect,
  allowRoles("admin"),
  registerValidators,
  registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  loginUser
);

module.exports = router;