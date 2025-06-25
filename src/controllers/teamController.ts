import { Request, Response } from 'express';
import prisma from '../config/prisma';
import '../types/express'; // Ensure the type augmentation is loaded


/**
 * @swagger
 * tags:
 *   name: Team
 *   description: Team management endpoints
 */

export const joinTeam = async (req: Request, res: Response) => {
    try {
        const { code } = req.body;
        const userId = req.user?.userId;

        // Ensure userId is defined
        if (!userId) {
            return res.status(400).json({ error: 'User ID is missing' });
        }

        // Find team by code
        const team = await prisma.team.findUnique({
            where: { teamCode: code }
        });

        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        // Add player to team
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