import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express';
import { Sport } from '@prisma/client';
import prisma from '../config/prisma';

/**
 * @swagger
 * tags:
 *   name: Child
 *   description: Child management endpoints
 */

export const linkChild = async (req: AuthenticatedRequest & { body: any }, res: Response): Promise<void> => {
    try {
        const { code } = req.body;
        const parentId = req.user?.userId;
        const child = await prisma.child.findUnique({ where: { code } });
        if (!child) {
            res.status(404).json({ error: 'Child not found' });
            return;
        }
        await prisma.child.update({ where: { id: child.id }, data: { parentId } });
        res.json({ message: 'Child linked successfully', child });
    } catch (error) {
        res.status(500).json({ error: 'Failed to link child' });
    }
};

export const createChild = async (req: AuthenticatedRequest & { body: any }, res: Response): Promise<void> => {
    try {
        const { fullName, age, sport } = req.body;
        const parentId = req.user?.userId;
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const data: any = {
            fullName,
            age: parseInt(age),
            sport: sport as Sport,
            code
        };
        if (parentId) data.parentId = parentId;
        const child = await prisma.child.create({ data });
        res.status(201).json({ message: 'Child created', child });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create child' });
    }
};