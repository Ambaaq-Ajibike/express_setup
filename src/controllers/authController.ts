import { Request, Response } from 'express';
import { loginService, registerService, verifyEmailService } from '../services/authService';
import { AuthenticatedRequest } from '../types/express';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "user@example.com"
 *         password:
 *           type: string
 *           description: User's password
 *           example: "password123"
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - role
 *       properties:
 *         firstName:
 *           type: string
 *           description: User's first name
 *           example: "John"
 *         lastName:
 *           type: string
 *           description: User's last name
 *           example: "Doe"
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "user@example.com"
 *         password:
 *           type: string
 *           description: User's password
 *           example: "password123"
 *         role:
 *           type: string
 *           enum: [COACH, PLAYER, PARENT, REFEREE, PITCH_OWNER]
 *           description: User's role
 *           example: "PLAYER"
 *         imageUrl:
 *           type: string
 *           description: Optional profile image URL
 *           example: "https://example.com/image.jpg"
 *     VerifyEmailRequest:
 *       type: object
 *       required:
 *         - code
 *       properties:
 *         code:
 *           type: string
 *           description: Email verification code
 *           example: "123456"
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT authentication token
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             email:
 *               type: string
 *             role:
 *               type: string
 *             emailVerified:
 *               type: boolean
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await loginService(req.body);
        res.json(result);
    } catch (error) {
        const err = error as any;
        res.status(err.status || 500).json({ error: err.message || 'Login failed' });
    }
};

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: User registration
 *     description: Register a new user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await registerService(req.body);
        res.status(201).json(result);
    } catch (error) {
        const err = error as any;
        res.status(err.status || 500).json({ error: err.message || 'Registration failed' });
    }
};

/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     summary: Verify email address
 *     description: Verify user's email address with verification code
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyEmailRequest'
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email verified successfully"
 *       400:
 *         description: Invalid verification code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const verifyEmail = async (req: AuthenticatedRequest & { body: any }, res: Response): Promise<void> => {
    try {
        const result = await verifyEmailService(req.body, req.user?.userId);
        res.json(result);
    } catch (error) {
        const err = error as any;
        res.status(err.status || 500).json({ error: err.message || 'Verification failed' });
    }
};