const mongoose = require('mongoose');
const { Pool } = require('pg');
require('dotenv').config();

// Import models
const {
  HospitalStats,
  Activity,
  SystemMetrics,
  RegionalStats,
  TechnologyMetrics
} = require('../models/TransparencyModels');

// PostgreSQL setup queries
const pgSetupQueries = [
  `CREATE DATABASE IF NOT EXISTS aarogyam;`,
  `CREATE TABLE IF NOT EXISTS hospitals (
    id SERIAL PRIMARY KEY,
    hospital_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,
  `CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(50) UNIQUE NOT NULL,
    abha_id VARCHAR(20) UNIQUE,
    name VARCHAR(255) NOT NULL,
    hospital_id VARCHAR(50) REFERENCES hospitals(hospital_id),
    organ_needed VARCHAR(50),
    urgency_score INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,
  `CREATE TABLE IF NOT EXISTS organ_allocations (
    id SERIAL PRIMARY KEY,
    allocation_id VARCHAR(50) UNIQUE NOT NULL,
    patient_id VARCHAR(50),
    organ_type VARCHAR(50) NOT NULL,
    hospital_id VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    allocated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`
];

// Sample data for MongoDB
const sampleHospitalStats = [
  {
    hospitalId: 'HOSP_AIIMS_001',
    hospitalName: 'AIIMS New Delhi',
    region: 'Delhi NCR',
    hospitalType: 'Government',
    stats: {
      totalPatients: 1234,
      activePatients: 987,
      successfulTransplants: 156,
      successRate: 94.2,
      averageWaitTime: 120,
      attendanceRate: 87.3
    },
    technology: {
      rfidEnabled: true,
      computerVisionEnabled: true,
      aiIntegrated: true,
      rfidReaders: 45,
      cameras: 38
    }
  },
  {
    hospitalId: 'HOSP_PGIMER_001',
    hospitalName: 'PGIMER Chandigarh',
    region: 'Punjab',
    hospitalType: 'Government',
    stats: {
      totalPatients: 892,
      activePatients: 734,
      successfulTransplants: 98,
      successRate: 92.8,
      averageWaitTime: 135,
      attendanceRate: 85.1
    },
    technology: {
      rfidEnabled: true,
      computerVisionEnabled: true,
      aiIntegrated: true,
      rfidReaders: 32,
      cameras: 28
    }
  }
];

const sampleRegionalStats = [
  { region: 'Delhi NCR', hospitals: 89, patients: 5678, attendanceRate: 87.3, avgResponseTime: 15, successRate: 94.2 },
  { region: 'Mumbai', hospitals: 156, patients: 8934, attendanceRate: 82.1, avgResponseTime: 18, successRate: 93.8 },
  { region: 'Bangalore', hospitals: 134, patients: 7234, attendanceRate: 89.5, avgResponseTime: 12, successRate: 95.1 },
  { region: 'Chennai', hospitals: 98, patients: 5432, attendanceRate: 85.7, avgResponseTime: 16, successRate: 92.9 }
];

const sampleSystemMetrics = {
  date: new Date(),
  systemStats: {
    totalHospitals: 1247,
    activeHospitals: 1189,
    totalPatients: 45678,
    successfulTransplants: 8934,
    successRate: 94.2,
    averageWaitTime: 127
  },
  realTimeMetrics: {
    patientsPresent: 38542,
    patientsAbsent: 7136,
    attendanceRate: 84.4,
    rfidActiveReaders: 3456,
    computerVisionCameras: 2891,
    detectionAccuracy: 96.8
  },
  organAllocation: {
    heart: { available: 23, allocated: 18, inTransit: 5, avgAllocationTime: 4.2 },
    kidney: { available: 67, allocated: 52, inTransit: 15, avgAllocationTime: 18.7 },
    liver: { available: 34, allocated: 28, inTransit: 6, avgAllocationTime: 7.3 }
  },
  equityMetrics: {
    genderDistribution: {
      maleRecipients: 52.3,
      femaleRecipients: 47.7,
      improvement: '+12.7% female recipients vs last year'
    },
    geographicEquity: {
      ruralPatients: 34.2,
      urbanPatients: 65.8,
      ruralSuccessRate: 93.8,
      urbanSuccessRate: 94.5
    },
    economicEquity: {
      publicHospitals: 67.8,
      privateHospitals: 32.2,
      avgWaitTimePublic: 132,
      avgWaitTimePrivate: 118
    }
  },
  governmentIntegration: {
    abhaVerifications: 45678,
    notoConnectivity: 'Active',
    ayushmanBharatClaims: 12345,
    complianceScore: 98.7
  }
};

async function setupMongoDB() {
  try {
    console.log('🔄 Setting up MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aarogyam');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await HospitalStats.deleteMany({});
    await RegionalStats.deleteMany({});
    await SystemMetrics.deleteMany({});
    await Activity.deleteMany({});
    
    // Insert sample data
    await HospitalStats.insertMany(sampleHospitalStats);
    console.log('✅ Hospital stats inserted');
    
    await RegionalStats.insertMany(sampleRegionalStats);
    console.log('✅ Regional stats inserted');
    
    await SystemMetrics.create(sampleSystemMetrics);
    console.log('✅ System metrics inserted');

    // Create some sample activities
    const sampleActivities = [
      {
        activityId: `ACT_${Date.now()}_001`,
        type: 'allocation',
        region: 'Delhi NCR',
        message: 'Heart successfully allocated to patient in AIIMS New Delhi',
        metadata: { urgencyScore: 94.2, processingTime: '2.3 seconds', confidence: 97 },
        isPublic: true
      },
      {
        activityId: `ACT_${Date.now()}_002`,
        type: 'detection',
        region: 'Mumbai',
        message: 'Computer vision detected 15 patients in Mumbai hospitals',
        metadata: { confidence: 96.8, patientsDetected: 15, accuracy: 97 },
        isPublic: true
      }
    ];
    
    await Activity.insertMany(sampleActivities);
    console.log('✅ Sample activities inserted');
    
    console.log('✅ MongoDB setup completed');
    
  } catch (error) {
    console.error('❌ MongoDB setup failed:', error);
    throw error;
  }
}

async function setupPostgreSQL() {
  try {
    console.log('🔄 Setting up PostgreSQL...');
    
    const pool = new Pool({
      user: process.env.PG_USER || 'postgres',
      host: process.env.PG_HOST || 'localhost',
      database: 'postgres', // Connect to default database first
      password: process.env.PG_PASSWORD || 'password',
      port: process.env.PG_PORT || 5432,
    });

    // Create database if it doesn't exist
    try {
      await pool.query('CREATE DATABASE aarogyam');
      console.log('✅ Database created');
    } catch (error) {
      if (error.code === '42P04') {
        console.log('✅ Database already exists');
      } else {
        throw error;
      }
    }

    await pool.end();

    // Connect to the aarogyam database
    const aarogyamPool = new Pool({
      user: process.env.PG_USER || 'postgres',
      host: process.env.PG_HOST || 'localhost',
      database: process.env.PG_DATABASE || 'aarogyam',
      password: process.env.PG_PASSWORD || 'password',
      port: process.env.PG_PORT || 5432,
    });

    // Create tables
    for (const query of pgSetupQueries.slice(1)) { // Skip CREATE DATABASE
      try {
        await aarogyamPool.query(query);
      } catch (error) {
        console.log(`Table might already exist: ${error.message}`);
      }
    }

    // Insert sample data
    const sampleHospitals = [
      ['HOSP_AIIMS_001', 'AIIMS New Delhi', 'Delhi NCR', 'Government'],
      ['HOSP_PGIMER_001', 'PGIMER Chandigarh', 'Punjab', 'Government'],
      ['HOSP_FORTIS_001', 'Fortis Hospital Gurgaon', 'Delhi NCR', 'Private']
    ];

    for (const hospital of sampleHospitals) {
      try {
        await aarogyamPool.query(
          'INSERT INTO hospitals (hospital_id, name, region, type) VALUES ($1, $2, $3, $4) ON CONFLICT (hospital_id) DO NOTHING',
          hospital
        );
      } catch (error) {
        console.log(`Hospital might already exist: ${error.message}`);
      }
    }

    await aarogyamPool.end();
    console.log('✅ PostgreSQL setup completed');
    
  } catch (error) {
    console.error('❌ PostgreSQL setup failed:', error);
    throw error;
  }
}

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...');
    
    await setupMongoDB();
    await setupPostgreSQL();
    
    console.log('🎉 Database setup completed successfully!');
    console.log('\n📋 Demo Login Credentials:');
    console.log('👨‍⚕️ Doctor: dr.sharma@aiims.edu / Doctor@123');
    console.log('👩‍⚕️ Doctor: dr.priya@pgimer.edu.in / Doctor@123');
    console.log('👨‍💼 Admin: admin@aarogyam.gov.in / AarogyamAdmin@2024');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
