const requests = new Map();

export function rateLimiter({ windowMs = 60000, max = 100 } = {}) {
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!requests.has(key)) {
      requests.set(key, []);
    }

    const timestamps = requests.get(key).filter((t) => t > windowStart);
    requests.set(key, timestamps);

    if (timestamps.length >= max) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
      });
    }

    timestamps.push(now);
    next();
  };
}

export const generalLimiter = rateLimiter({ windowMs: 60000, max: 100 });
export const authLimiter = rateLimiter({ windowMs: 900000, max: 5 });
export const aiLimiter = rateLimiter({ windowMs: 60000, max: 30 });
