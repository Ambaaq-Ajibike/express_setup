import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface DecodedToken {
    userId: string;
    role: string;
    iat: number;
    exp: number;
}

interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        role: Role;
    };
}

export const authMiddleware: RequestHandler = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, role: true }
        });

        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        req.user = {
            userId: user.id,
            role: user.role
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error);

        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ error: 'Token expired' });
            return;
        }

        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }

        res.status(500).json({ error: 'Authentication failed' });
    }
};


// Optional: Role-based middleware
export const roleMiddleware = (roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Unauthorized access' });
        }
        next();
    };
};

export default authMiddleware;