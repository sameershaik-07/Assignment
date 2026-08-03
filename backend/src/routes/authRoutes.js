const express = require('express');
const router = express.Router();
const { register, login, getMe, registerSchema, loginSchema } = require('../controllers/authController');
const validate = require('../middleware/validate');
const authenticateToken = require('../middleware/authMiddleware');

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "user@example.com" }
 *               password: { type: string, example: "securePassword123" }
 *     responses:
 *       201:
 *         description: User registered successfully (returns unique Platform ID)
 *       400:
 *         description: Validation error or email already taken
 */
router.post('/register', validate(registerSchema), register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Log in user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "user@example.com" }
 *               password: { type: string, example: "securePassword123" }
 *     responses:
 *       200:
 *         description: Login successful (returns JWT token & user profile)
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validate(loginSchema), login);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user details
 *       401:
 *         description: Missing or invalid token
 */
router.get('/me', authenticateToken, getMe);

module.exports = router;
