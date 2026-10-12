const express = require('express');
const {registerUser, loginUser} = require('../controllers/authController');
const{body} = require('express-validator');
const { protect } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');
const router = express.Router();

const registerValidators = [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

router.post('/register', registerValidators, registerUser);
router.post('/admin/register', protect, allowRoles('admin'), registerValidators, registerUser);

router.post('/login', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
], loginUser);



module.exports = router