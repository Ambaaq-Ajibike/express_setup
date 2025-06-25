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
        const images = req.files as MulterFile[];
        const pitchOwnerId = req.user?.userId;

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