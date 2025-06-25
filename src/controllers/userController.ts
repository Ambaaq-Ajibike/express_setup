import { Role } from '@prisma/client';
import { Request, Response } from 'express';
import prisma from '../config/prisma';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id
 *         email:
 *           type: string
 *           description: User email
 *         name:
 *           type: string
 *           description: User name
 *       example:
 *         id: d5fE_asz
 *         email: john@example.com
 *         name: John Doe
 */

export const getUsers = async (req: Request, res: Response) => {
    try {
        // const users = await prisma.user.findMany();
        res.json({});
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password, imageUrl, role } = req.body;

        // Basic validation
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({
                error: 'Missing required fields: firstName, lastName, email, password'
            });
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
                error: 'Email already in use'
            });
        }

        // Create user with validated data
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password, // Note: In production, you should hash the password first
                imageUrl: imageUrl || null,
                role: role || Role.PLAYER, // Default role
                createdAt: new Date(),
                updatedAt: new Date()
            },
            select: { // Only return these fields in response
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                imageUrl: true,
                role: true,
                createdAt: true
            }
        });

        // Return success response
        res.status(201).json({
            message: 'User created successfully',
            user
        });

    } catch (error) {
        console.error('Error creating user:', error);

        if (error instanceof Error) {
            res.status(500).json({
                error: 'Internal server error',
                details: error.message
            });
        } else {
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }
};