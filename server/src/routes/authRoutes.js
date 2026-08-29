import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// Route endpoints: /api/auth/register and /api/auth/login
router.post('/register', register);
router.post('/login', login);

export default router;