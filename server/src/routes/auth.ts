import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database/init.js';
import { validate, loginSchema } from '../utils/validation.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import type { User, LoginRequest, ApiResponse, LoginResponse } from '../../../shared/src/types.js';

const router = express.Router();

// Login
router.post('/login', validate(loginSchema), (req, res) => {
  try {
    const { username, password } = req.body as LoginRequest;

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      } as ApiResponse);
    }

    const validPassword = bcrypt.compareSync(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      } as ApiResponse);
    }

    const secret = process.env.JWT_SECRET || 'dev-secret-key';
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      secret,
      { expiresIn: '7d' }
    );

    const userData: User = {
      id: user.id,
      username: user.username,
      role: user.role,
      created_at: user.created_at
    };

    res.json({
      success: true,
      data: { token, user: userData }
    } as ApiResponse<LoginResponse>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    } as ApiResponse);
  }
});

// Verify token
router.get('/verify', authenticateToken, (req: AuthRequest, res) => {
  res.json({
    success: true,
    data: req.user
  } as ApiResponse<User>);
});

export default router;
