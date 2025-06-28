import { Role } from '@prisma/client';
import { Request, Response } from 'express';
import prisma from '../config/prisma';
import bcrypt from 'bcrypt';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated user ID
 *         firstName:
 *           type: string
 *           description: User's first name
 *         lastName:
 *           type: string
 *           description: User's last name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         imageUrl:
 *           type: string
 *           nullable: true
 *           description: User's profile image URL
 *         role:
 *           type: string
 *           enum: [COACH, PLAYER, PARENT, REFEREE, PITCH_OWNER]
 *           description: User's role
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: User creation timestamp
 *         emailVerified:
 *           type: boolean
 *           description: Whether email is verified
 *       example:
 *         id: "d5fE_asz"
 *         firstName: "John"
 *         lastName: "Doe"
 *         email: "john@example.com"
 *         imageUrl: "https://example.com/image.jpg"
 *         role: "PLAYER"
 *         createdAt: "2024-01-01T00:00:00Z"
 *         emailVerified: false
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
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
 *           example: "john@example.com"
 *         password:
 *           type: string
 *           description: User's password
 *           example: "password123"
 *         imageUrl:
 *           type: string
 *           description: Optional profile image URL
 *           example: "https://example.com/image.jpg"
 *         role:
 *           type: string
 *           enum: [COACH, PLAYER, PARENT, REFEREE, PITCH_OWNER]
 *           description: User's role
 *           example: "PLAYER"
 *     UsersResponse:
 *       type: object
 *       properties:
 *         users:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *     CreateUserResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "User created successfully"
 *         user:
 *           $ref: '#/components/schemas/User'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *         details:
 *           type: string
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users in the system
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: Create a new user
 *     description: Create a new user account with the provided information
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserResponse'
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email already in use
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
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                imageUrl: true,
                role: true,
                createdAt: true
            }
        });
        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, password, imageUrl, role } = req.body;
        if (!email || !password || !firstName || !lastName) {
            res.status(400).json({
                error: 'Missing required fields: firstName, lastName, email, password'
            });
            return;
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            res.status(409).json({
                error: 'Email already in use'
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                imageUrl: imageUrl || null,
                role: role || Role.PLAYER
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                imageUrl: true,
                role: true,
                createdAt: true
            }
        });

        res.status(201).json({
            message: 'User created successfully',
            user
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : undefined
        });
    }
};