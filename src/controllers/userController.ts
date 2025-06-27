import { Role } from '@prisma/client';
import { Request, Response } from 'express';
import prisma from '../config/prisma';
import bcrypt from 'bcrypt';

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