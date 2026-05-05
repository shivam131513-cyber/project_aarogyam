const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock database for development
const mockDoctors = new Map();
const mockPatients = new Map();
const mockAttendance = new Map();
const mockRFIDTags = new Map();

// Doctor authentication middleware
function authenticateDoctor(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    if (user.userType !== 'doctor') {
      return res.status(403).json({ message: 'Doctor access required' });
    }
    
    req.doctor = user;
    next();
  });
}

/**
 * POST /api/hospital-portal/doctor/login
 * Doctor login with hospital-specific credentials
 */
router.post('/doctor/login', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  body('hospitalId').notEmpty().withMessage('Hospital ID required'),
  body('doctorId').notEmpty().withMessage('Doctor ID required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, hospitalId, doctorId } = req.body;

    // Mock doctor authentication
    const mockDoctor = {
      id: doctorId,
      email,
      hospitalId,
      name: 'Dr. Smith',
      department: 'Cardiology',
      specialization: 'Heart Transplant',
      permissions: ['view_patients', 'update_attendance', 'access_realtime'],
      isActive: true
    };

    // Store doctor session
    mockDoctors.set(doctorId, mockDoctor);

    // Generate JWT token with hospital-specific claims
    const token = jwt.sign(
      { 
        userId: doctorId, 
        userType: 'doctor', 
        email, 
        hospitalId,
        permissions: mockDoctor.permissions
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '8h' } // Shorter session for security
    );

    res.json({
      success: true,
      message: 'Doctor login successful',
      token,
      doctor: {
        id: mockDoctor.id,
        name: mockDoctor.name,
        email: mockDoctor.email,
        hospitalId: mockDoctor.hospitalId,
        department: mockDoctor.department,
        specialization: mockDoctor.specialization,
        permissions: mockDoctor.permissions
      }
    });

  } catch (error) {
    console.error('Doctor login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
});

/**
 * GET /api/hospital-portal/patients/real-time
 * Get real-time patient availability for organ transplant
 */
router.get('/patients/real-time', authenticateDoctor, async (req, res) => {
  try {
    const { hospitalId } = req.doctor;
    const { organType, urgencyLevel, region } = req.query;

    // Mock real-time patient data
    const mockPatientsData = [
      {
        id: 'P001',
        abhaId: '12-3456-7890-1234',
        name: 'Rajesh Kumar',
        age: 45,
        bloodGroup: 'O+',
        organNeeded: 'Heart',
        urgencyScore: 95,
        waitTime: '180 days',
        isPresent: true,
        lastSeen: new Date().toISOString(),
        location: 'Ward 3A, Bed 15',
        attendanceStatus: 'present',
        rfidStatus: 'active',
        vitalSigns: {
          heartRate: 78,
          bloodPressure: '120/80',
          temperature: 98.6,
          oxygenSaturation: 98
        },
        medicalCondition: 'Stable',
        contactInfo: {
          phone: '+91-9876543210',
          emergencyContact: '+91-9876543211'
        },
        region: 'Delhi NCR',
        hospital: hospitalId
      },
      {
        id: 'P002',
        abhaId: '12-3456-7890-1235',
        name: 'Priya Sharma',
        age: 38,
        bloodGroup: 'A+',
        organNeeded: 'Kidney',
        urgencyScore: 87,
        waitTime: '120 days',
        isPresent: false,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        location: 'Unknown',
        attendanceStatus: 'absent',
        rfidStatus: 'inactive',
        vitalSigns: null,
        medicalCondition: 'Requires monitoring',
        contactInfo: {
          phone: '+91-9876543212',
          emergencyContact: '+91-9876543213'
        },
        region: 'Mumbai',
        hospital: hospitalId
      },
      {
        id: 'P003',
        abhaId: '12-3456-7890-1236',
        name: 'Mohammed Ali',
        age: 52,
        bloodGroup: 'B+',
        organNeeded: 'Liver',
        urgencyScore: 92,
        waitTime: '90 days',
        isPresent: true,
        lastSeen: new Date().toISOString(),
        location: 'ICU Ward, Bed 8',
        attendanceStatus: 'present',
        rfidStatus: 'active',
        vitalSigns: {
          heartRate: 82,
          bloodPressure: '130/85',
          temperature: 99.1,
          oxygenSaturation: 96
        },
        medicalCondition: 'Critical - Ready for transplant',
        contactInfo: {
          phone: '+91-9876543214',
          emergencyContact: '+91-9876543215'
        },
        region: 'Bangalore',
        hospital: hospitalId
      }
    ];

    // Filter patients based on query parameters
    let filteredPatients = mockPatientsData;

    if (organType) {
      filteredPatients = filteredPatients.filter(p => 
        p.organNeeded.toLowerCase().includes(organType.toLowerCase())
      );
    }

    if (urgencyLevel) {
      const minScore = urgencyLevel === 'critical' ? 90 : urgencyLevel === 'high' ? 80 : 0;
      filteredPatients = filteredPatients.filter(p => p.urgencyScore >= minScore);
    }

    if (region) {
      filteredPatients = filteredPatients.filter(p => 
        p.region.toLowerCase().includes(region.toLowerCase())
      );
    }

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      hospitalId,
      totalPatients: filteredPatients.length,
      presentPatients: filteredPatients.filter(p => p.isPresent).length,
      absentPatients: filteredPatients.filter(p => !p.isPresent).length,
      patients: filteredPatients,
      filters: { organType, urgencyLevel, region }
    });

  } catch (error) {
    console.error('Real-time patients error:', error);
    res.status(500).json({
      error: 'Failed to fetch real-time patient data',
      message: error.message
    });
  }
});

/**
 * POST /api/hospital-portal/attendance/rfid
 * Mark attendance using RFID tag
 */
router.post('/attendance/rfid', authenticateDoctor, [
  body('rfidTag').notEmpty().withMessage('RFID tag required'),
  body('location').notEmpty().withMessage('Location required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rfidTag, location } = req.body;
    const { hospitalId } = req.doctor;

    // Mock RFID tag to patient mapping
    const rfidToPatient = {
      'RFID001': 'P001',
      'RFID002': 'P002',
      'RFID003': 'P003'
    };

    const patientId = rfidToPatient[rfidTag];
    
    if (!patientId) {
      return res.status(404).json({
        success: false,
        message: 'RFID tag not registered'
      });
    }

    // Record attendance
    const attendanceRecord = {
      patientId,
      rfidTag,
      location,
      timestamp: new Date().toISOString(),
      method: 'rfid',
      hospitalId,
      recordedBy: req.doctor.userId
    };

    // Store attendance record
    const attendanceKey = `${patientId}-${Date.now()}`;
    mockAttendance.set(attendanceKey, attendanceRecord);

    // Update patient status
    if (mockPatients.has(patientId)) {
      const patient = mockPatients.get(patientId);
      patient.isPresent = true;
      patient.lastSeen = attendanceRecord.timestamp;
      patient.location = location;
      patient.attendanceStatus = 'present';
      patient.rfidStatus = 'active';
      mockPatients.set(patientId, patient);
    }

    res.json({
      success: true,
      message: 'Attendance marked successfully via RFID',
      attendance: attendanceRecord,
      patientStatus: 'present'
    });

  } catch (error) {
    console.error('RFID attendance error:', error);
    res.status(500).json({
      error: 'Failed to mark RFID attendance',
      message: error.message
    });
  }
});

/**
 * POST /api/hospital-portal/attendance/manual
 * Manual attendance marking by doctor
 */
router.post('/attendance/manual', authenticateDoctor, [
  body('patientId').notEmpty().withMessage('Patient ID required'),
  body('status').isIn(['present', 'absent']).withMessage('Valid status required'),
  body('location').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { patientId, status, location, notes } = req.body;
    const { hospitalId } = req.doctor;

    // Record manual attendance
    const attendanceRecord = {
      patientId,
      status,
      location: location || 'Not specified',
      notes: notes || '',
      timestamp: new Date().toISOString(),
      method: 'manual',
      hospitalId,
      recordedBy: req.doctor.userId
    };

    // Store attendance record
    const attendanceKey = `${patientId}-${Date.now()}`;
    mockAttendance.set(attendanceKey, attendanceRecord);

    res.json({
      success: true,
      message: 'Manual attendance recorded successfully',
      attendance: attendanceRecord
    });

  } catch (error) {
    console.error('Manual attendance error:', error);
    res.status(500).json({
      error: 'Failed to record manual attendance',
      message: error.message
    });
  }
});

/**
 * POST /api/hospital-portal/vision/detect
 * Computer vision patient detection
 */
router.post('/vision/detect', authenticateDoctor, async (req, res) => {
  try {
    const { cameraId, imageData } = req.body;
    const { hospitalId } = req.doctor;

    // Mock computer vision API response
    const mockDetection = {
      detected: true,
      confidence: 0.92,
      patients: [
        {
          patientId: 'P001',
          name: 'Rajesh Kumar',
          boundingBox: {
            x: 150,
            y: 200,
            width: 180,
            height: 220
          },
          confidence: 0.95,
          location: `Camera-${cameraId}`,
          timestamp: new Date().toISOString()
        }
      ],
      cameraInfo: {
        id: cameraId,
        location: 'Ward 3A',
        hospitalId
      }
    };

    // Update patient location based on detection
    if (mockDetection.detected) {
      mockDetection.patients.forEach(detectedPatient => {
        const attendanceRecord = {
          patientId: detectedPatient.patientId,
          location: detectedPatient.location,
          timestamp: detectedPatient.timestamp,
          method: 'computer_vision',
          confidence: detectedPatient.confidence,
          cameraId,
          hospitalId,
          recordedBy: 'system'
        };

        const attendanceKey = `${detectedPatient.patientId}-${Date.now()}`;
        mockAttendance.set(attendanceKey, attendanceRecord);
      });
    }

    res.json({
      success: true,
      detection: mockDetection,
      message: mockDetection.detected ? 
        `Detected ${mockDetection.patients.length} patient(s)` : 
        'No patients detected'
    });

  } catch (error) {
    console.error('Computer vision detection error:', error);
    res.status(500).json({
      error: 'Computer vision detection failed',
      message: error.message
    });
  }
});

/**
 * GET /api/hospital-portal/patients/regional
 * Get patients available in specific region
 */
router.get('/patients/regional', authenticateDoctor, async (req, res) => {
  try {
    const { region, radius, organType } = req.query;
    const { hospitalId } = req.doctor;

    // Mock regional patient data
    const regionalPatients = [
      {
        id: 'P004',
        name: 'Anita Desai',
        age: 41,
        organNeeded: 'Heart',
        urgencyScore: 88,
        location: 'AIIMS Delhi',
        distance: '5.2 km',
        isAvailable: true,
        region: 'Delhi NCR',
        contactHospital: 'AIIMS Delhi',
        estimatedTravelTime: '15 mins'
      },
      {
        id: 'P005',
        name: 'Vikram Singh',
        age: 35,
        organNeeded: 'Kidney',
        urgencyScore: 85,
        location: 'Fortis Hospital Gurgaon',
        distance: '12.8 km',
        isAvailable: true,
        region: 'Delhi NCR',
        contactHospital: 'Fortis Hospital Gurgaon',
        estimatedTravelTime: '25 mins'
      },
      {
        id: 'P006',
        name: 'Sunita Patel',
        age: 48,
        organNeeded: 'Liver',
        urgencyScore: 91,
        location: 'Max Hospital Saket',
        distance: '8.5 km',
        isAvailable: false,
        region: 'Delhi NCR',
        contactHospital: 'Max Hospital Saket',
        estimatedTravelTime: '20 mins',
        unavailableReason: 'In surgery'
      }
    ];

    // Filter by region and organ type
    let filteredPatients = regionalPatients;

    if (region) {
      filteredPatients = filteredPatients.filter(p => 
        p.region.toLowerCase().includes(region.toLowerCase())
      );
    }

    if (organType) {
      filteredPatients = filteredPatients.filter(p => 
        p.organNeeded.toLowerCase().includes(organType.toLowerCase())
      );
    }

    if (radius) {
      const maxRadius = parseFloat(radius);
      filteredPatients = filteredPatients.filter(p => 
        parseFloat(p.distance) <= maxRadius
      );
    }

    res.json({
      success: true,
      region: region || 'All regions',
      totalFound: filteredPatients.length,
      availableCount: filteredPatients.filter(p => p.isAvailable).length,
      patients: filteredPatients,
      searchCriteria: { region, radius, organType }
    });

  } catch (error) {
    console.error('Regional patients error:', error);
    res.status(500).json({
      error: 'Failed to fetch regional patients',
      message: error.message
    });
  }
});

/**
 * GET /api/hospital-portal/dashboard
 * Hospital-specific dashboard data
 */
router.get('/dashboard', authenticateDoctor, async (req, res) => {
  try {
    const { hospitalId } = req.doctor;

    // Mock dashboard data
    const dashboardData = {
      hospitalInfo: {
        id: hospitalId,
        name: 'Apollo Hospital Delhi',
        location: 'New Delhi',
        totalBeds: 500,
        availableBeds: 45
      },
      patientStats: {
        totalPatients: 23,
        presentPatients: 18,
        absentPatients: 5,
        criticalPatients: 7
      },
      organRequests: {
        heart: 8,
        kidney: 12,
        liver: 3
      },
      recentActivity: [
        {
          type: 'attendance',
          message: 'Patient P001 marked present via RFID',
          timestamp: new Date().toISOString()
        },
        {
          type: 'detection',
          message: 'Computer vision detected patient in Ward 3A',
          timestamp: new Date(Date.now() - 300000).toISOString()
        }
      ],
      alerts: [
        {
          level: 'high',
          message: 'Patient P003 requires immediate attention',
          patientId: 'P003'
        }
      ]
    };

    res.json({
      success: true,
      dashboard: dashboardData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      error: 'Failed to load dashboard',
      message: error.message
    });
  }
});

module.exports = router;
