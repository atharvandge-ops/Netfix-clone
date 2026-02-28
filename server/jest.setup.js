require('dotenv').config({ path: '.env.test' });

process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/netflix-clone-test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
