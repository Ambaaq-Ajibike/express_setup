import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express';
import prisma from '../config/prisma';

/**
 * @swagger
 * tags:
 *   name: Facility
 *   description: Facility management endpoints
 */

export const addFacility = async (req: AuthenticatedRequest & { body: any }, res: Response): Promise<void> => {
    try {
        const { facilityName, address } = req.body;
        if (!facilityName || !address) {
            res.status(400).json({ error: 'Missing required fields: facilityName, address' });
            return;
        }
        const images = req.files as Express.Multer.File[] || [];
        const pitchOwnerId = req.user?.userId;
        if (!pitchOwnerId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const imageUrls = images.map(img => img.path);
        const facility = await prisma.pitchOwnerFacility.create({
            data: {
                name: facilityName,
                address,
                images: imageUrls,
                pitchOwnerId
            }
        });
        res.status(201).json({ facility });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add facility' });
    }
};