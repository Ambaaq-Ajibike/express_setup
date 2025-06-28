import { Request, Response } from 'express';
import prisma from '../config/prisma';

/**
 * @swagger
 * tags:
 *   name: Referee
 *   description: Referee qualification endpoints
 */

/**
 * @swagger
 * /api/referees/add-qualification:
 *   post:
 *     summary: Add referee qualification
 *     description: Add a new referee qualification with certificate images
 *     tags: [Referee]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - qualificationName
 *             properties:
 *               qualificationName:
 *                 type: string
 *                 description: Name of the referee qualification/certification
 *                 example: "FIFA Referee License"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Certificate images/files
 *     responses:
 *       201:
 *         description: Qualification added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefereeResponse'
 *       400:
 *         description: Bad request - User ID is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Authentication required
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



export const createReferee = async (req: Request, res: Response): Promise<void> => {
    try {
        const { qualificationName } = req.body;
        const images = req.files as Express.Multer.File[];
        const userId = req.user?.userId;

        if (!userId) {
            res.status(400).json({ error: 'User ID is required.' });
            return;
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