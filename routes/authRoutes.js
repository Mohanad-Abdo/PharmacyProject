const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController'); // سننشئه لاحقاً

// GET /auth/register: عرض نموذج تسجيل جديد
router.get('/register', authController.registerForm);

// POST /auth/register: معالجة طلب التسجيل
router.post('/register', authController.registerUser);

// GET /auth/login: عرض نموذج تسجيل الدخول
router.get('/login', authController.loginForm);

// POST /auth/login: معالجة طلب تسجيل الدخول
router.post('/login', authController.loginUser);

// GET /auth/logout: تسجيل الخروج
router.get('/logout', authController.logoutUser);


module.exports = router;