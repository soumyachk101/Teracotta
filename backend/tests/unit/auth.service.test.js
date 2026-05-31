import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { hashPassword, comparePassword, signAccessToken, signRefreshToken } from '../../src/services/auth.service.js';

describe('Auth Service', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const hash = await hashPassword('TestPass123');
      expect(hash).toBeDefined();
      expect(hash).not.toBe('TestPass123');
      expect(hash.length).toBeGreaterThan(20);
    });

    it('should produce different hashes for same input', async () => {
      const hash1 = await hashPassword('TestPass123');
      const hash2 = await hashPassword('TestPass123');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password', async () => {
      const hash = await hashPassword('TestPass123');
      const result = await comparePassword('TestPass123', hash);
      expect(result).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const hash = await hashPassword('TestPass123');
      const result = await comparePassword('WrongPass', hash);
      expect(result).toBe(false);
    });
  });

  describe('JWT Tokens', () => {
    const originalEnv = process.env;

    beforeAll(() => {
      process.env.JWT_ACCESS_SECRET = 'test_access_secret_long_enough';
      process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_long_enough';
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it('should sign and verify an access token', () => {
      const token = signAccessToken('user123', 'CUSTOMER');
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    it('should sign and verify a refresh token', () => {
      const token = signRefreshToken('user123');
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });
});
