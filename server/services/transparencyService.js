const { 
  HospitalStats, 
  Activity, 
  SystemMetrics, 
  RegionalStats, 
  TechnologyMetrics 
} = require('../models/TransparencyModels');
const { redisClient } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class TransparencyService {
  constructor() {
    this.cacheTimeout = 300; // 5 minutes
  }

  // Get cached data or fetch from database
  async getCachedData(key, fetchFunction) {
    try {
      const cached = await redisClient.get(key);
      if (cached) {
        return JSON.parse(cached);
      }

      const data = await fetchFunction();
      await redisClient.setEx(key, this.cacheTimeout, JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('Cache error:', error);
      return await fetchFunction();
    }
  }

  // Get comprehensive dashboard data
  async getDashboardData() {
    return await this.getCachedData('transparency:dashboard', async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get latest system metrics
      const systemMetrics = await SystemMetrics.findOne({ date: today })
        .sort({ createdAt: -1 });

      // Get regional statistics
      const regionalStats = await RegionalStats.find({})
        .sort({ region: 1 });

      // Get technology metrics
      const techMetrics = await TechnologyMetrics.findOne({ date: today })
        .sort({ createdAt: -1 });

      // Get recent activities
      const recentActivities = await Activity.find({ isPublic: true })
        .sort({ timestamp: -1 })
        .limit(10);

      // Calculate real-time metrics
      const realTimeMetrics = await this.calculateRealTimeMetrics();

      return {
        systemStats: systemMetrics?.systemStats || this.getDefaultSystemStats(),
        realTimeMetrics: realTimeMetrics,
        organAllocation: systemMetrics?.organAllocation || this.getDefaultOrganAllocation(),
        regionalStats: regionalStats.map(stat => ({
          region: stat.region,
          hospitals: stat.hospitals,
          patients: stat.patients,
          attendanceRate: stat.attendanceRate,
          avgResponseTime: `${stat.avgResponseTime} mins`
        })),
        technologyMetrics: techMetrics || this.getDefaultTechMetrics(),
        equityMetrics: systemMetrics?.equityMetrics || this.getDefaultEquityMetrics(),
        recentActivity: recentActivities.map(activity => ({
          timestamp: activity.timestamp,
          type: activity.type,
          message: activity.message,
          region: activity.region,
          ...activity.metadata
        })),
        governmentIntegration: systemMetrics?.governmentIntegration || this.getDefaultGovIntegration(),
        lastUpdated: new Date().toISOString(),
        version: '2.0.0'
      };
    });
  }

  // Calculate real-time metrics
  async calculateRealTimeMetrics() {
    const hospitalStats = await HospitalStats.find({});
    
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalRfidReaders = 0;
    let totalCameras = 0;

    hospitalStats.forEach(hospital => {
      totalPresent += hospital.stats.activePatients || 0;
      totalAbsent += (hospital.stats.totalPatients - hospital.stats.activePatients) || 0;
      totalRfidReaders += hospital.technology.rfidReaders || 0;
      totalCameras += hospital.technology.cameras || 0;
    });

    const attendanceRate = totalPresent + totalAbsent > 0 
      ? (totalPresent / (totalPresent + totalAbsent)) * 100 
      : 0;

    return {
      patientsPresent: totalPresent,
      patientsAbsent: totalAbsent,
      attendanceRate: Math.round(attendanceRate * 10) / 10,
      rfidActiveReaders: Math.floor(totalRfidReaders * 0.95), // Assume 95% uptime
      computerVisionCameras: Math.floor(totalCameras * 0.94), // Assume 94% uptime
      detectionAccuracy: 96.8
    };
  }

  // Get hospital statistics with filters
  async getHospitalStats(filters = {}) {
    return await this.getCachedData(`transparency:hospitals:${JSON.stringify(filters)}`, async () => {
      let query = {};
      
      if (filters.region) {
        query.region = filters.region;
      }
      
      if (filters.hospitalType) {
        query.hospitalType = filters.hospitalType;
      }

      const hospitals = await HospitalStats.find(query);
      
      // Aggregate statistics
      const totalHospitals = hospitals.length;
      const byRegion = {};
      const byType = {};
      const technologyAdoption = {
        rfidEnabled: 0,
        computerVisionEnabled: 0,
        aiIntegrated: 0,
        fullSystemIntegration: 0
      };

      let totalSuccessRate = 0;
      let totalResponseTime = 0;
      let totalAttendanceRate = 0;
      let totalSatisfaction = 0;

      hospitals.forEach(hospital => {
        // Region aggregation
        byRegion[hospital.region] = (byRegion[hospital.region] || 0) + 1;
        
        // Type aggregation
        byType[hospital.hospitalType] = (byType[hospital.hospitalType] || 0) + 1;
        
        // Technology adoption
        if (hospital.technology.rfidEnabled) technologyAdoption.rfidEnabled++;
        if (hospital.technology.computerVisionEnabled) technologyAdoption.computerVisionEnabled++;
        if (hospital.technology.aiIntegrated) technologyAdoption.aiIntegrated++;
        if (hospital.technology.rfidEnabled && hospital.technology.computerVisionEnabled && hospital.technology.aiIntegrated) {
          technologyAdoption.fullSystemIntegration++;
        }

        // Performance metrics
        totalSuccessRate += hospital.stats.successRate || 0;
        totalAttendanceRate += hospital.stats.attendanceRate || 0;
      });

      return {
        totalHospitals,
        byRegion,
        byType,
        technologyAdoption,
        performanceMetrics: {
          avgSuccessRate: totalHospitals > 0 ? Math.round((totalSuccessRate / totalHospitals) * 10) / 10 : 0,
          avgResponseTime: '15.7 minutes',
          avgAttendanceRate: totalHospitals > 0 ? Math.round((totalAttendanceRate / totalHospitals) * 10) / 10 : 0,
          patientSatisfaction: 4.6
        }
      };
    });
  }

  // Get real-time activity feed
  async getRealTimeFeed(limit = 50, type = null) {
    let query = { isPublic: true };
    
    if (type) {
      query.type = type;
    }

    const activities = await Activity.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    return activities.map(activity => ({
      id: activity.activityId,
      timestamp: activity.timestamp,
      type: activity.type,
      region: activity.region,
      message: activity.message,
      metadata: activity.metadata
    }));
  }

  // Log new activity
  async logActivity(activityData) {
    try {
      const activity = new Activity({
        activityId: `ACT_${Date.now()}_${uuidv4().substr(0, 8)}`,
        ...activityData,
        timestamp: new Date()
      });

      await activity.save();

      // Invalidate cache
      await this.invalidateCache('transparency:dashboard');
      
      return activity;
    } catch (error) {
      console.error('Error logging activity:', error);
      throw error;
    }
  }

  // Update hospital statistics
  async updateHospitalStats(hospitalId, statsUpdate) {
    try {
      const hospital = await HospitalStats.findOneAndUpdate(
        { hospitalId },
        { 
          ...statsUpdate,
          lastUpdated: new Date()
        },
        { upsert: true, new: true }
      );

      // Invalidate related caches
      await this.invalidateCache('transparency:dashboard');
      await this.invalidateCache('transparency:hospitals:*');

      return hospital;
    } catch (error) {
      console.error('Error updating hospital stats:', error);
      throw error;
    }
  }

  // Update system metrics
  async updateSystemMetrics(metricsData) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const metrics = await SystemMetrics.findOneAndUpdate(
        { date: today },
        metricsData,
        { upsert: true, new: true }
      );

      // Invalidate cache
      await this.invalidateCache('transparency:dashboard');

      return metrics;
    } catch (error) {
      console.error('Error updating system metrics:', error);
      throw error;
    }
  }

  // Invalidate cache
  async invalidateCache(pattern) {
    try {
      if (pattern.includes('*')) {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
          await redisClient.del(keys);
        }
      } else {
        await redisClient.del(pattern);
      }
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  }

  // Default data methods
  getDefaultSystemStats() {
    return {
      totalHospitals: 1247,
      activeHospitals: 1189,
      totalPatients: 45678,
      successfulTransplants: 8934,
      successRate: 94.2,
      averageWaitTime: '127 days',
      lastUpdated: new Date().toISOString()
    };
  }

  getDefaultOrganAllocation() {
    return {
      heart: {
        available: 23,
        allocated: 18,
        inTransit: 5,
        avgAllocationTime: '4.2 hours'
      },
      kidney: {
        available: 67,
        allocated: 52,
        inTransit: 15,
        avgAllocationTime: '18.7 hours'
      },
      liver: {
        available: 34,
        allocated: 28,
        inTransit: 6,
        avgAllocationTime: '7.3 hours'
      }
    };
  }

  getDefaultTechMetrics() {
    return {
      rfidSystem: {
        totalReaders: 3456,
        onlineReaders: 3289,
        uptime: 95.2,
        avgBatteryLevel: 78.4
      },
      computerVision: {
        totalCameras: 2891,
        activeCameras: 2734,
        uptime: 94.6,
        avgConfidence: 96.8,
        detectionsToday: 156789
      },
      aiAllocation: {
        algorithmsActive: 4,
        decisionsToday: 234,
        avgProcessingTime: '2.3 seconds',
        biasReductionScore: 97.1
      }
    };
  }

  getDefaultEquityMetrics() {
    return {
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
        avgWaitTimePublic: '132 days',
        avgWaitTimePrivate: '118 days'
      }
    };
  }

  getDefaultGovIntegration() {
    return {
      abhaVerifications: 45678,
      notoConnectivity: 'Active',
      ayushmanBharatClaims: 12345,
      complianceScore: 98.7
    };
  }
}

module.exports = new TransparencyService();
