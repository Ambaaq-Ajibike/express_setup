import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express';
import prisma from '../config/prisma';

/**
 * @swagger
 * tags:
 *   name: Team
 *   description: Team management endpoints
 */

export const joinTeam = async (req: AuthenticatedRequest & { body: any }, res: Response): Promise<void> => {
    try {
        const { code } = req.body;
        const userId = req.user?.userId;
        if (!userId) {
            res.status(400).json({ error: 'User ID is missing' });
            return;
        }
        const team = await prisma.team.findUnique({ where: { teamCode: code } });
        if (!team) {
            res.status(404).json({ error: 'Team not found' });
            return;
        }
        await prisma.playerTeam.create({
            data: {
                playerId: userId,
                teamId: team.id
            }
        });
        res.json({ message: 'Successfully joined team', team });
    } catch (error) {
        res.status(500).json({ error: 'Failed to join team' });
    }
};