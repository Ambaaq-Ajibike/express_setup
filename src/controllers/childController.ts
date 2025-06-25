import { Request, Response } from 'express';
import { Sport } from '@prisma/client';
import prisma from '../config/prisma';

/**
 * @swagger
 * tags:
 *   name: Child
 *   description: Child management endpoints
 */

export const linkChild = async (req: Request, res: Response) => {
    try {
        const { code } = req.body;
        const parentId = req.user?.userId;

        const child = await prisma.child.findUnique({
            where: { code }
        });

        if (!child) {
            return res.status(404).json({ error: 'Child not found' });
        }

        await prisma.child.update({
            where: { id: child.id },
            data: { parentId }
        });

        res.json({ message: 'Child linked successfully', child });

    } catch (error) {
        res.status(500).json({ error: 'Failed to link child' });
    }
};

export const createChild = async (req: Request, res: Response) => {
    try {
        const { fullName, age, sport } = req.body;
        const parentId = req.user?.userId;

        const code = Math.random().toString(36).substring(2, 8).toUpperCase();

        const child = await prisma.child.create({
            data: {
                fullName,
                age: parseInt(age),
                sport: sport as Sport,
                ...(parentId ? { parentId } : {}),
                code
            }
        });

        res.status(201).json({ message: 'Child created', child });

    } catch (error) {
        res.status(500).json({ error: 'Failed to create child' });
    }
};