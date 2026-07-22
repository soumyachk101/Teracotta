import { authService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  const { user, accessToken, refreshToken } = await authService.register({ email, password, name });

  // Set JWT as HttpOnly cookie if requested
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { user, accessToken },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.login({ email, password });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: 'User logged in successfully',
    data: { user, accessToken },
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken');
  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getUserById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    const error = new Error('No refresh token provided');
    error.statusCode = 401;
    throw error;
  }

  try {
    const decoded = authService.verifyRefreshToken(refreshToken);
    const user = await authService.getUserById(decoded.sub);
    if (!user) {
      throw new Error('User not found');
    }

    const accessToken = authService.signAccessToken(user.id, user.role);

    res.status(200).json({
      success: true,
      data: { accessToken },
    });
  } catch (error) {
    const authError = new Error('Invalid refresh token');
    authError.statusCode = 401;
    throw authError;
  }
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    const error = new Error('Email is required');
    error.statusCode = 400;
    throw error;
  }

  await authService.forgotPassword(email);

  res.status(200).json({
    success: true,
    message: 'If an account exists for that email, a reset link has been sent',
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password || password.length < 8) {
    const error = new Error('A valid token and a password of at least 8 characters are required');
    error.statusCode = 400;
    throw error;
  }

  await authService.resetPassword(token, password);

  res.status(200).json({
    success: true,
    message: 'Password has been reset successfully',
  });
});
