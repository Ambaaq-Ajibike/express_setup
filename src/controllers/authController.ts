import { Request, Response } from 'express';
import { loginService, registerService, verifyEmailService } from '../services/authService';
import { AuthenticatedRequest } from '../types/express';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import prisma from '../config/prisma';

/**
 * @swagger
 * tags:
 *   name: Auth

 *   description: Authentication endpoints
 */

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const login = async (req: Request, res: Response) => {
    try {
        const result = await loginService(req.body);
        res.json(result);
    } catch (error) {
        const err = error as any;
        res.status(err.status || 500).json({ error: err.message || 'Login failed' });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const result = await registerService(req.body);
        res.status(201).json(result);
    } catch (error) {
        const err = error as any;
        res.status(err.status || 500).json({ error: err.message || 'Registration failed' });
    }
};

export const verifyEmail = async (req: AuthenticatedRequest & { body: any }, res: Response) => {
    try {
        const result = await verifyEmailService(req.body, req.user?.userId);
        res.json(result);
    } catch (error) {
        const err = error as any;
        res.status(err.status || 500).json({ error: err.message || 'Verification failed' });
    }
};