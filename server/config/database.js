const mongoose = require('mongoose');
const { Pool } = require('pg');
const redis = require('redis');

// MongoDB Connection
const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aarogyam', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// PostgreSQL Connection Pool
const pgPool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'aarogyam',
  password: process.env.PG_PASSWORD || 'password',
  port: process.env.PG_PORT || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Redis Connection
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('connect', () => {
  console.log('✅ Redis Connected');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

// Initialize Redis connection
const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
  }
};

// Test PostgreSQL connection
const testPgConnection = async () => {
  try {
    const client = await pgPool.connect();
    console.log('✅ PostgreSQL Connected');
    client.release();
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error);
  }
};

module.exports = {
  connectMongoDB,
  connectRedis,
  testPgConnection,
  pgPool,
  redisClient
};
