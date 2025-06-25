import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import prisma from '../config/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function loginService({ email, password }: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        const error = new Error('Invalid credentials');
        (error as any).status = 401;
        throw error;
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        const error = new Error('Invalid credentials');
        (error as any).status = 401;
        throw error;
    }
    const token = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '1d' }
    );
    const { password: _, ...userData } = user;
    return { user: userData, token };
}

export async function registerService({ firstName, lastName, email, password, imageUrl, role }: any) {
    if (!email || !password || !firstName || !lastName) {
        const error = new Error('Missing required fields');
        (error as any).status = 400;
        throw error;
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        const error = new Error('Email already in use');
        (error as any).status = 409;
        throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
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
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.oTP.create({
        data: {
            code: verificationCode,
            userId: user.id,
            expiry: new Date(Date.now() + 3600000)
        }
    });
    return {
        message: 'User registered. Verification code sent to email.',
        user
    };
}

export async function verifyEmailService({ code }: { code: string }, userId?: string) {
    if (!userId) {
        const error = new Error('Unauthorized');
        (error as any).status = 401;
        throw error;
    }
    const otp = await prisma.oTP.findFirst({
        where: {
            code,
            userId,
            expiry: { gt: new Date() }
        }
    });
    if (!otp) {
        const error = new Error('Invalid or expired code');
        (error as any).status = 400;
        throw error;
    }
    await prisma.user.update({
        where: { id: userId },
        data: { emailVerified: true }
    });
    await prisma.oTP.delete({ where: { id: otp.id } });
    return { message: 'Email verified successfully' };
} 