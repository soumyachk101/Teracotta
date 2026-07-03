import './src/config/loadEnv.js';
import app from './src/app.js';
import { validateEnv } from './src/config/env.js';
import { connectRedis } from './src/config/redis.js';

// Validate env vars
validateEnv();

// Connect to Redis gracefully
connectRedis().catch((err) => {
  console.warn(`[Redis] Setup warning: ${err.message}`);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});

