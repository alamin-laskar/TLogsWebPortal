import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export async function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function verifyPassword(password: string, hash: string) {
  return crypto.createHash('sha256').update(password).digest('hex') === hash;
}

export function signJwt(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
}

export function verifyJwt(token: string) {
  return jwt.verify(token, JWT_SECRET) as { sub?: string; email?: string; role?: string };
}
