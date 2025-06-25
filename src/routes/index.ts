import { Router } from 'express';
import {
    login,
    register,
    verifyEmail
} from '../controllers/authController';
// Ensure that 'register' is exported as a function like: export const register = async (req, res) => { ... }
import { joinTeam } from '../controllers/teamController';
import { linkChild, createChild } from '../controllers/childController';
import { addRefereeQualification } from '../controllers/refereeController';
import { addFacility } from '../controllers/facilityController';
import authMiddleware from '../middlewares/auth';

const router = Router();

// Auth routes
router.post('/login', login);
router.post('/register', register);
router.post('/verify-email', authMiddleware, verifyEmail);

// Team routes
router.post('/join-team', authMiddleware, joinTeam);

// Child routes
router.post('/link-child', authMiddleware, linkChild);
router.post('/create-child', authMiddleware, createChild);

// Referee routes
router.post('/add-qualification', authMiddleware, addRefereeQualification);

// Facility routes
router.post('/add-facility', authMiddleware, addFacility);

export default router;