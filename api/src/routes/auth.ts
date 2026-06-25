import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getOne } from '../config/database';
import { env } from '../config/env';
import { AdminRow } from '../types';

const router = Router();

router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const admin = getOne<AdminRow>('SELECT * FROM admins WHERE email = ?', [email]);

  if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const token = jwt.sign(
    { id: admin.id, email: admin.email },
    env.jwtSecret,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
    },
  });
});

export default router;
