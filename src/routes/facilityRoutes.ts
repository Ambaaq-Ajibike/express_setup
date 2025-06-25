import { Router } from 'express';
import { addFacility } from '../controllers/facilityController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/add', authMiddleware, addFacility);

export default router; 