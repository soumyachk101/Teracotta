import dotenv from 'dotenv';
import app from './src/app.js';

// Load environment variables for development
dotenv.config({ path: '.env.development' });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});
