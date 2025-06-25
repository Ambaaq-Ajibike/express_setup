import { Request, Response } from 'express';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id
 *         email:
 *           type: string
 *           description: User email
 *         name:
 *           type: string
 *           description: User name
 *       example:
 *         id: d5fE_asz
 *         email: john@example.com
 *         name: John Doe
 */

export const getUsers = async (req: Request, res: Response) => {
    try {
        // const users = await prisma.user.findMany();
        res.json({});
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        // const user = await prisma.user.create({
        //     data: req.body,
        // });
        res.status(201).json({});
    } catch (error) {
        res.status(400).json({ error: 'Failed to create user' });
    }
};