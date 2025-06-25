import { Request, Response } from 'express';
import prisma from '../config/prisma';

/**
 * @swagger
 * tags:
 *   name: Referee
 *   description: Referee qualification endpoints
 */

export const addRefereeQualification = async (req: Request, res: Response) => {
    try {
        const { qualificationName } = req.body;
        const images = req.files as Express.Multer.File[];
        const userId = req.user?.userId;

        const imageUrls = images.map(img => img.path);

        const qualification = await prisma.refereeCertification.create({
            data: {
                certification: qualificationName,
                certificates: imageUrls,
                refereeId: userId
            }
        });

        res.status(201).json({ qualification });

    } catch (error) {
        res.status(500).json({ error: 'Failed to add qualification' });
    }
};