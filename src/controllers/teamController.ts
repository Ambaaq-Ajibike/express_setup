import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express';
import prisma from '../config/prisma';

/**
 * @swagger
 * tags:
 *   name: Team
 *   description: Team management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     JoinTeamRequest:
 *       type: object
 *       required:
 *         - code
 *       properties:
 *         code:
 *           type: string
 *           description: Team code to join
 *           example: "TEAM123"
 *     Team:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Team ID
 *         name:
 *           type: string
 *           description: Team name
 *         teamCode:
 *           type: string
 *           description: Unique team code
 *         ageGroup:
 *           type: string
 *           enum: [U15, U16, U17, U18, Above]
 *           description: Age group category
 *         sport:
 *           type: string
 *           enum: [BASEBALL, BASKETBALL, CRICKET, FOOTBALL, FUTSAL, HANDBALL, HOCKEY, RUGBY, SOFTBALL, VOLLEYBALL, OTHER]
 *           description: Sport type
 *         tier:
 *           type: string
 *           enum: [COMMUNITY, INSTITUTIONS, ACADEMY, PROFESSIONAL, OTHERS]
 *           description: Team tier level
 *         location:
 *           type: string
 *           nullable: true
 *           description: Team location
 *       example:
 *         id: "team-uuid"
 *         name: "Red Dragons"
 *         teamCode: "TEAM123"
 *         ageGroup: "U16"
 *         sport: "FOOTBALL"
 *         tier: "ACADEMY"
 *         location: "New York"
 *     JoinTeamResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Successfully joined team"
 *         team:
 *           $ref: '#/components/schemas/Team'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */

/**
 * @swagger
 * /api/teams/join:
 *   post:
 *     summary: Join a team
 *     description: Join a team using the team code
 *     tags: [Team]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JoinTeamRequest'
 *     responses:
 *       200:
 *         description: Successfully joined team
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JoinTeamResponse'
 *       400:
 *         description: Bad request - User ID is missing
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
 *       404:
 *         description: Team not found
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