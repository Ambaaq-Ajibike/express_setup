import { Request, Response } from 'express';

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
        const { email, password } = req.body;

        // Find user by email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Return user data (excluding password) and token
        const { password: _, ...userData } = user;
        res.json({ user: userData, token });

    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password, imageUrl, role } = req.body;

        // Validate input
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if email exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                imageUrl: imageUrl || null,
                role: role || Role.PLAYER
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                imageUrl: true,
                role: true,
                createdAt: true
            }
        });

        // Generate verification code (simplified)
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        await prisma.oTP.create({
            data: {
                code: verificationCode,
                userId: user.id,
                expiry: new Date(Date.now() + 3600000) // 1 hour expiry
            }
        });

        // In real app: Send email with verification code
        res.status(201).json({
            message: 'User registered. Verification code sent to email.',
            user
        });

    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
};

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { code } = req.body;
        const userId = req.user?.userId; // Assuming middleware sets this

        // Find valid OTP
        const otp = await prisma.oTP.findFirst({
            where: {
                code,
                userId,
                expiry: { gt: new Date() }
            }
        });

        if (!otp) {
            return res.status(400).json({ error: 'Invalid or expired code' });
        }

        // Mark user as verified
        await prisma.user.update({
            where: { id: userId },
            data: { emailVerified: true }
        });

        // Delete used OTP
        await prisma.oTP.delete({ where: { id: otp.id } });

        res.json({ message: 'Email verified successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Verification failed' });
    }
};