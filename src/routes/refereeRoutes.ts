import { Router } from 'express';
import { addRefereeQualification } from '../controllers/refereeController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/add-qualification', authMiddleware, addRefereeQualification);

export default router; 