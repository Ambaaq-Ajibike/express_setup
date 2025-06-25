import { Request, Response } from 'express';
import type { File as MulterFile } from 'multer';
import prisma from '../config/prisma';

/**
 * @swagger
 * tags:
 *   name: Facility
 *   description: Facility management endpoints
 */

export const addFacility = async (req: Request, res: Response) => {
    try {
        const { facilityName, address } = req.body;
        if (!facilityName || !address) {
            return res.status(400).json({ error: 'Missing required fields: facilityName, address' });
        }
        const images = req.files as MulterFile[] || [];
        const pitchOwnerId = req.user?.userId;
        if (!pitchOwnerId) {
            return res.status(401).json({ error: 'Unauthorized' });
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