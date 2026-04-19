import { Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';

export const generateToken = (userId: string, res: Response, role?: string): string => {
  const payload = { id: userId };
  const token = jwt.sign(payload, config.jwt_secret as string, {
    expiresIn: config.jwt_expire as any,
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Non-httpOnly so Next.js middleware can read it
  if (role) {
    res.cookie('role', role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  return token;
};
