const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Database connections
const { connectMongoDB, connectRedis, testPgConnection } = require('./config/database');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/organs', require('./routes/organs'));
app.use('/api/allocation', require('./routes/allocation'));
app.use('/api/transparency', require('./routes/transparency'));
app.use('/api/government', require('./routes/government'));
app.use('/api/hospital-portal', require('./routes/hospitalPortal'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Aarogyam Organ Allocation System'
  });
});

// Real-time organ allocation updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join-hospital', (hospitalId) => {
    socket.join(`hospital-${hospitalId}`);
  });
  
  socket.on('join-patient', (patientId) => {
    socket.join(`patient-${patientId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Initialize database connections
const initializeDatabase = async () => {
  try {
    await connectMongoDB();
    await connectRedis();
    await testPgConnection();
    console.log('✅ All database connections established');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
};

server.listen(PORT, async () => {
  console.log(`🏥 Aarogyam Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Client URL: ${process.env.CLIENT_URL}`);
  
  // Initialize databases
  await initializeDatabase();
  
  console.log('\n📋 Demo Login Credentials:');
  console.log('👨‍⚕️ Doctor Login:');
  console.log('   Email: dr.sharma@aiims.edu');
  console.log('   Password: Doctor@123');
  console.log('👩‍⚕️ Another Doctor:');
  console.log('   Email: dr.priya@pgimer.edu.in');
  console.log('   Password: Doctor@123');
  console.log('👨‍💼 Admin Login:');
  console.log('   Email: admin@aarogyam.gov.in');
  console.log('   Password: AarogyamAdmin@2024');
  console.log('\n🌐 Access URLs:');
  console.log(`   Hospital Portal: ${process.env.CLIENT_URL}/hospital-portal`);
  console.log(`   Transparency Dashboard: ${process.env.CLIENT_URL}/transparency`);
  console.log(`   API Health Check: http://localhost:${PORT}/health`);
});

module.exports = { app, io };
