import { Request, Response, NextFunction } from 'express';
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

export const authMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // 1. Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // 2. Verify token
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

        // 3. Check if user still exists
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, role: true }
        });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // 4. Attach user to request
        req.user = {
            userId: user.id,
            role: user.role
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error);

        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: 'Token expired' });
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: 'Invalid token' });
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