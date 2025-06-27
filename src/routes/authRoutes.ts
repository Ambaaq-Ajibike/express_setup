import { Router } from 'express';
import { login, register, verifyEmail } from '../controllers/authController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/login', login);
router.post('/register', register);
// router.post('/verify-email', authMiddleware, verifyEmail);

export default router; 