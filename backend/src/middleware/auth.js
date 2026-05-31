import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import prisma from '../config/db.js';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    const error = new Error('Not authorized to access this route');
    error.statusCode = 401;
    throw error;
  }

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    req.user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!req.user) {
      const error = new Error('User not found');
      error.statusCode = 401;
      throw error;
    }

    next();
  } catch (error) {
    if (error.statusCode) throw error;
    const authError = new Error('Not authorized to access this route');
    authError.statusCode = 401;
    throw authError;
  }
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = new Error(`User role ${req.user.role} is not authorized to access this route`);
      error.statusCode = 403;
      throw error;
    }
    next();
  };
};
