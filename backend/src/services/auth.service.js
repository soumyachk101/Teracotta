import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { emailService } from './email.service.js';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';
const ACCESS_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '7d';

export const hashPassword = async (plain) => {
  return bcrypt.hash(plain, 12);
};

export const comparePassword = async (plain, hash) => {
  return bcrypt.compare(plain, hash);
};

export const signAccessToken = (userId, role) => {
  return jwt.sign({ sub: userId, role }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
};

export const signRefreshToken = (userId) => {
  return jwt.sign({ sub: userId }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
};

export const verifyRefreshToken = (refreshToken) => {
  return jwt.verify(refreshToken, REFRESH_SECRET);
};

export const authService = {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,

  async getUserById(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        avatar: true,
        role: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
      },
    });
    return user;
  },

  async register({ email, password, name }) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: 'CUSTOMER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    const accessToken = signAccessToken(user.id, user.role);
    const refreshToken = signRefreshToken(user.id);

    return { user, accessToken, refreshToken };
  },

  async login({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await comparePassword(password, user.passwordHash))) {
      throw new Error('Invalid email or password');
    }

    const accessToken = signAccessToken(user.id, user.role);
    const refreshToken = signRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  },

  async forgotPassword(email) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return; // don't reveal whether the account exists

    const resetToken = jwt.sign({ sub: user.id, purpose: 'password-reset' }, ACCESS_SECRET, {
      expiresIn: '1h',
    });
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

    try {
      await emailService.sendPasswordReset({ to: user.email, resetLink });
    } catch (err) {
      console.error('Password reset email failed:', err.message);
    }
  },

  async resetPassword(token, password) {
    let decoded;
    try {
      decoded = jwt.verify(token, ACCESS_SECRET);
    } catch {
      decoded = null;
    }
    if (!decoded || decoded.purpose !== 'password-reset') {
      const error = new Error('Invalid or expired reset link');
      error.statusCode = 400;
      throw error;
    }

    const passwordHash = await hashPassword(password);
    await prisma.user.update({ where: { id: decoded.sub }, data: { passwordHash } });
  },
};
