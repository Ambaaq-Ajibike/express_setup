import { Router } from 'express';
import { createChild } from '../controllers/childController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/create', authMiddleware, createChild);

export default router; 