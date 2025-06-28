import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { createReferee } from '../controllers/refereeController';

const router = Router();

router.post('/add-qualification', authMiddleware, createReferee);

export default router; 