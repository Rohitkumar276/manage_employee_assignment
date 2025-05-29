import express, { Router } from 'express';
const router = Router();
import { signUp, login } from '../controllers/userController.js';

// Sign Up Route
router.post('/signup', signUp);

// Login Route (already exists)
router.post('/login', login);

export default router;
