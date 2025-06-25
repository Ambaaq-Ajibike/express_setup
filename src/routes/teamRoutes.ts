import { Router } from 'express';
import { joinTeam } from '../controllers/teamController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/join', authMiddleware, joinTeam);

export default router; 