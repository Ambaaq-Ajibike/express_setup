import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express';
import prisma from '../config/prisma';

/**
 * @swagger
 * tags:
 *   name: Facility
 *   description: Facility management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AddFacilityRequest:
 *       type: object
 *       required:
 *         - facilityName
 *         - address
 *       properties:
 *         facilityName:
 *           type: string
 *           description: Name of the facility
 *           example: "Central Sports Complex"
 *         address:
 *           type: string
 *           description: Facility address
 *           example: "123 Sports Street, New York, NY 10001"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *           description: Facility images/files
 *     Facility:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Facility ID
 *         name:
 *           type: string
 *           description: Facility name
 *         address:
 *           type: string
 *           description: Facility address
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Facility image URLs
 *         pitchOwnerId:
 *           type: string
 *           format: uuid
 *           description: Pitch owner's user ID
 *       example:
 *         id: "facility-uuid"
 *         name: "Central Sports Complex"
 *         address: "123 Sports Street, New York, NY 10001"
 *         images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *         pitchOwnerId: "owner-uuid"
 *     AddFacilityResponse:
 *       type: object
 *       properties:
 *         facility:
 *           $ref: '#/components/schemas/Facility'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */

/**
 * @swagger
 * /api/facilities:
 *   post:
 *     summary: Add a new facility
 *     description: Add a new sports facility for a pitch owner
 *     tags: [Facility]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - facilityName
 *               - address
 *             properties:
 *               facilityName:
 *                 type: string
 *                 description: Name of the facility
 *                 example: "Central Sports Complex"
 *               address:
 *                 type: string
 *                 description: Facility address
 *                 example: "123 Sports Street, New York, NY 10001"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Facility images/files
 *     responses:
 *       201:
 *         description: Facility added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddFacilityResponse'
 *       400:
 *         description: Bad request - missing required fields
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