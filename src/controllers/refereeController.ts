import { Request, Response } from 'express';
import prisma from '../config/prisma';

/**
 * @swagger
 * tags:
 *   name: Referee
 *   description: Referee qualification endpoints
 */

export const createReferee = async (req: Request, res: Response) => {
    try {
        const { qualificationName } = req.body;
        const images = req.files as Express.Multer.File[];
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required.' });
        }

        const imageUrls = images.map(img => img.path);
        
        const qualification = await prisma.referee.create({
            data: {
                certification: qualificationName,
                certificates: imageUrls,
                userId: userId,
            }
        });

        res.status(201).json({ qualification });

    } catch (error) {
        res.status(500).json({ error: 'Failed to add qualification' });
    }
};