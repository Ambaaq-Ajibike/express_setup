import { Router } from 'express';
import { linkChild, createChild } from '../controllers/childController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/link', authMiddleware, linkChild);
router.post('/create', authMiddleware, createChild);

export default router; 