import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import teamRoutes from './teamRoutes';
import childRoutes from './childRoutes';
import refereeRoutes from './refereeRoutes';
import facilityRoutes from './facilityRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/teams', teamRoutes);
router.use('/children', childRoutes);
router.use('/referees', refereeRoutes);
router.use('/facilities', facilityRoutes);

export default router;