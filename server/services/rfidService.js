const EventEmitter = require('events');

class RFIDService extends EventEmitter {
  constructor() {
    super();
    this.activeReaders = new Map();
    this.tagDatabase = new Map();
    this.attendanceHistory = new Map();
    this.isConnected = false;
    
    this.initializeMockData();
  }

  /**
   * Initialize mock RFID data for development
   */
  initializeMockData() {
    // Mock RFID tag to patient mapping
    const mockTags = [
      {
        tagId: 'RFID001',
        patientId: 'P001',
        patientName: 'Rajesh Kumar',
        isActive: true,
        batteryLevel: 85,
        lastSeen: new Date().toISOString()
      },
      {
        tagId: 'RFID002',
        patientId: 'P002',
        patientName: 'Priya Sharma',
        isActive: false,
        batteryLevel: 12,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        tagId: 'RFID003',
        patientId: 'P003',
        patientName: 'Mohammed Ali',
        isActive: true,
        batteryLevel: 92,
        lastSeen: new Date().toISOString()
      }
    ];

    mockTags.forEach(tag => {
      this.tagDatabase.set(tag.tagId, tag);
    });

    // Mock RFID readers
    const mockReaders = [
      {
        readerId: 'READER_001',
        location: 'Ward 3A Entrance',
        isOnline: true,
        signalStrength: 95,
        lastHeartbeat: new Date().toISOString()
      },
      {
        readerId: 'READER_002',
        location: 'ICU Ward Entrance',
        isOnline: true,
        signalStrength: 88,
        lastHeartbeat: new Date().toISOString()
      },
      {
        readerId: 'READER_003',
        location: 'Cafeteria',
        isOnline: false,
        signalStrength: 0,
        lastHeartbeat: new Date(Date.now() - 10 * 60 * 1000).toISOString()
      }
    ];

    mockReaders.forEach(reader => {
      this.activeReaders.set(reader.readerId, reader);
    });
  }

  /**
   * Connect to RFID system
   */
  async connect() {
    try {
      // Mock connection for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.isConnected = true;
      this.emit('connected');
      
      // Start mock data simulation
      this.startMockDataSimulation();
      
      console.log('RFID Service connected successfully');
      return { success: true, message: 'RFID system connected' };

    } catch (error) {
      console.error('RFID connection error:', error);
      throw new Error(`RFID connection failed: ${error.message}`);
    }
  }

  /**
   * Disconnect from RFID system
   */
  async disconnect() {
    try {
      this.isConnected = false;
      this.emit('disconnected');
      console.log('RFID Service disconnected');
      return { success: true, message: 'RFID system disconnected' };

    } catch (error) {
      console.error('RFID disconnection error:', error);
      throw new Error(`RFID disconnection failed: ${error.message}`);
    }
  }

  /**
   * Register new RFID tag for patient
   */
  async registerTag(tagId, patientId, patientName) {
    try {
      const tagData = {
        tagId,
        patientId,
        patientName,
        isActive: true,
        batteryLevel: 100,
        registeredAt: new Date().toISOString(),
        lastSeen: null
      };

      this.tagDatabase.set(tagId, tagData);
      
      this.emit('tagRegistered', tagData);
      
      return {
        success: true,
        message: 'RFID tag registered successfully',
        tag: tagData
      };

    } catch (error) {
      console.error('Tag registration error:', error);
      throw new Error(`Tag registration failed: ${error.message}`);
    }
  }

  /**
   * Read RFID tag and mark attendance
   */
  async readTag(tagId, readerId, hospitalId) {
    try {
      const tag = this.tagDatabase.get(tagId);
      const reader = this.activeReaders.get(readerId);

      if (!tag) {
        return {
          success: false,
          message: 'RFID tag not found',
          tagId
        };
      }

      if (!reader) {
        return {
          success: false,
          message: 'RFID reader not found',
          readerId
        };
      }

      if (!reader.isOnline) {
        return {
          success: false,
          message: 'RFID reader is offline',
          readerId
        };
      }

      // Create attendance record
      const attendanceRecord = {
        tagId,
        patientId: tag.patientId,
        patientName: tag.patientName,
        readerId,
        location: reader.location,
        timestamp: new Date().toISOString(),
        hospitalId,
        signalStrength: reader.signalStrength,
        batteryLevel: tag.batteryLevel
      };

      // Store attendance record
      const recordKey = `${tag.patientId}-${Date.now()}`;
      this.attendanceHistory.set(recordKey, attendanceRecord);

      // Update tag last seen
      tag.lastSeen = attendanceRecord.timestamp;
      this.tagDatabase.set(tagId, tag);

      // Emit attendance event
      this.emit('attendanceMarked', attendanceRecord);

      return {
        success: true,
        message: 'Attendance marked successfully',
        attendance: attendanceRecord
      };

    } catch (error) {
      console.error('Tag reading error:', error);
      throw new Error(`Tag reading failed: ${error.message}`);
    }
  }

  /**
   * Get all registered RFID tags
   */
  getAllTags() {
    return Array.from(this.tagDatabase.values());
  }

  /**
   * Get all active RFID readers
   */
  getAllReaders() {
    return Array.from(this.activeReaders.values());
  }

  /**
   * Get attendance history for a patient
   */
  getPatientAttendance(patientId, dateRange = null) {
    const allRecords = Array.from(this.attendanceHistory.values());
    let patientRecords = allRecords.filter(record => record.patientId === patientId);

    if (dateRange) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      
      patientRecords = patientRecords.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate >= startDate && recordDate <= endDate;
      });
    }

    return patientRecords.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  /**
   * Get real-time location of patient based on RFID
   */
  getPatientLocation(patientId) {
    const patientRecords = this.getPatientAttendance(patientId);
    
    if (patientRecords.length === 0) {
      return {
        patientId,
        location: 'Unknown',
        lastSeen: null,
        status: 'not_detected'
      };
    }

    const latestRecord = patientRecords[0];
    const timeDiff = Date.now() - new Date(latestRecord.timestamp).getTime();
    const isRecent = timeDiff < 30 * 60 * 1000; // 30 minutes

    return {
      patientId,
      location: latestRecord.location,
      lastSeen: latestRecord.timestamp,
      status: isRecent ? 'present' : 'possibly_absent',
      readerId: latestRecord.readerId,
      signalStrength: latestRecord.signalStrength
    };
  }

  /**
   * Monitor RFID reader health
   */
  async monitorReaderHealth() {
    const healthReport = {
      timestamp: new Date().toISOString(),
      totalReaders: this.activeReaders.size,
      onlineReaders: 0,
      offlineReaders: 0,
      readers: []
    };

    for (const [readerId, reader] of this.activeReaders) {
      const timeSinceHeartbeat = Date.now() - new Date(reader.lastHeartbeat).getTime();
      const isOnline = timeSinceHeartbeat < 5 * 60 * 1000; // 5 minutes

      // Update reader status
      reader.isOnline = isOnline;
      this.activeReaders.set(readerId, reader);

      if (isOnline) {
        healthReport.onlineReaders++;
      } else {
        healthReport.offlineReaders++;
      }

      healthReport.readers.push({
        readerId,
        location: reader.location,
        isOnline,
        signalStrength: reader.signalStrength,
        lastHeartbeat: reader.lastHeartbeat,
        timeSinceHeartbeat: `${Math.floor(timeSinceHeartbeat / 1000)}s`
      });
    }

    return healthReport;
  }

  /**
   * Start mock data simulation for development
   */
  startMockDataSimulation() {
    if (!this.isConnected) return;

    // Simulate RFID tag readings every 30 seconds
    setInterval(() => {
      if (!this.isConnected) return;

      const activeTags = Array.from(this.tagDatabase.values()).filter(tag => tag.isActive);
      const activeReaders = Array.from(this.activeReaders.values()).filter(reader => reader.isOnline);

      if (activeTags.length > 0 && activeReaders.length > 0) {
        // Randomly select a tag and reader
        const randomTag = activeTags[Math.floor(Math.random() * activeTags.length)];
        const randomReader = activeReaders[Math.floor(Math.random() * activeReaders.length)];

        // Simulate tag reading
        this.readTag(randomTag.tagId, randomReader.readerId, 'HOSPITAL_001')
          .then(result => {
            if (result.success) {
              console.log(`Mock RFID: ${randomTag.patientName} detected at ${randomReader.location}`);
            }
          })
          .catch(error => {
            console.error('Mock RFID simulation error:', error);
          });
      }
    }, 30000); // Every 30 seconds

    // Simulate battery level updates
    setInterval(() => {
      if (!this.isConnected) return;

      for (const [tagId, tag] of this.tagDatabase) {
        if (tag.isActive && tag.batteryLevel > 0) {
          // Randomly decrease battery level
          tag.batteryLevel = Math.max(0, tag.batteryLevel - Math.random() * 2);
          
          if (tag.batteryLevel < 20) {
            this.emit('lowBattery', {
              tagId,
              patientId: tag.patientId,
              batteryLevel: tag.batteryLevel
            });
          }

          if (tag.batteryLevel === 0) {
            tag.isActive = false;
            this.emit('tagInactive', {
              tagId,
              patientId: tag.patientId,
              reason: 'battery_dead'
            });
          }

          this.tagDatabase.set(tagId, tag);
        }
      }
    }, 60000); // Every minute
  }

  /**
   * Generate attendance analytics
   */
  generateAttendanceAnalytics(hospitalId, dateRange) {
    const allRecords = Array.from(this.attendanceHistory.values())
      .filter(record => record.hospitalId === hospitalId);

    let filteredRecords = allRecords;
    if (dateRange) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      
      filteredRecords = allRecords.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate >= startDate && recordDate <= endDate;
      });
    }

    // Calculate analytics
    const uniquePatients = new Set(filteredRecords.map(r => r.patientId));
    const locationStats = {};
    const hourlyStats = {};

    filteredRecords.forEach(record => {
      // Location statistics
      if (!locationStats[record.location]) {
        locationStats[record.location] = 0;
      }
      locationStats[record.location]++;

      // Hourly statistics
      const hour = new Date(record.timestamp).getHours();
      if (!hourlyStats[hour]) {
        hourlyStats[hour] = 0;
      }
      hourlyStats[hour]++;
    });

    return {
      summary: {
        totalRecords: filteredRecords.length,
        uniquePatients: uniquePatients.size,
        dateRange: dateRange || 'All time',
        hospitalId
      },
      locationStats,
      hourlyStats,
      mostActiveLocation: Object.keys(locationStats).reduce((a, b) => 
        locationStats[a] > locationStats[b] ? a : b, 'None'
      ),
      peakHour: Object.keys(hourlyStats).reduce((a, b) => 
        hourlyStats[a] > hourlyStats[b] ? a : b, 'None'
      )
    };
  }
}

module.exports = new RFIDService();
