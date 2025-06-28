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

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateChildRequest:
 *       type: object
 *       required:
 *         - fullName
 *         - age
 *         - sport
 *       properties:
 *         fullName:
 *           type: string
 *           description: Child's full name
 *           example: "John Smith"
 *         age:
 *           type: integer
 *           minimum: 1
 *           maximum: 18
 *           description: Child's age
 *           example: 15
 *         sport:
 *           type: string
 *           enum: [BASEBALL, BASKETBALL, CRICKET, FOOTBALL, FUTSAL, HANDBALL, HOCKEY, RUGBY, SOFTBALL, VOLLEYBALL, OTHER]
 *           description: Sport the child plays
 *           example: "FOOTBALL"
 *     Child:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Child ID
 *         fullName:
 *           type: string
 *           description: Child's full name
 *         age:
 *           type: integer
 *           description: Child's age
 *         sport:
 *           type: string
 *           enum: [BASEBALL, BASKETBALL, CRICKET, FOOTBALL, FUTSAL, HANDBALL, HOCKEY, RUGBY, SOFTBALL, VOLLEYBALL, OTHER]
 *           description: Sport the child plays
 *         code:
 *           type: string
 *           description: Unique child code
 *         parentId:
 *           type: string
 *           format: uuid
 *           description: Parent's user ID
 *       example:
 *         id: "child-uuid"
 *         fullName: "John Smith"
 *         age: 15
 *         sport: "FOOTBALL"
 *         code: "ABC123"
 *         parentId: "parent-uuid"
 *     CreateChildResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Child created"
 *         child:
 *           $ref: '#/components/schemas/Child'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */

/**
 * @swagger
 * /api/children:
 *   post:
 *     summary: Create a new child
 *     description: Create a new child profile for a parent
 *     tags: [Child]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateChildRequest'
 *     responses:
 *       201:
 *         description: Child created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateChildResponse'
 *       400:
 *         description: Bad request - validation error
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