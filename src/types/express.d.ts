import { Role } from '@prisma/client';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: Role;
            };
        }
    }
}

export type AuthenticatedRequest = Express.Request & {
    user?: {
        userId: string;
        role: import('@prisma/client').Role;
    };
    body: any;
};