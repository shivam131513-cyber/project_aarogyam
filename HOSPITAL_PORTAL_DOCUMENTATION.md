# Hospital Portal System - Aarogyam

## Overview

The Hospital Portal System is a comprehensive module within the Aarogyam organ allocation platform that provides real-time patient tracking, attendance management, and regional patient coordination for hospital staff and doctors.

## 🏥 Key Features

### 1. **Doctor Authentication & Access Control**
- Hospital-specific doctor login with unique credentials
- Role-based access permissions
- Secure JWT token-based authentication
- Session management with 8-hour expiry for security

### 2. **Real-Time Patient Availability Tracking**
- Live patient status monitoring (present/absent)
- Organ-specific filtering (Heart, Kidney, Liver)
- Urgency level categorization (Critical 90+, High 80+)
- Regional patient filtering
- Vital signs monitoring integration
- Contact information management

### 3. **RFID Attendance System**
- Automatic patient detection via RFID tags
- Real-time location tracking
- Battery level monitoring
- Signal strength indicators
- Manual override capabilities
- Attendance history and analytics

### 4. **Computer Vision Integration**
- AI-powered patient detection through camera feeds
- Facial recognition for patient identification
- Movement pattern analysis
- Multi-camera network support
- Confidence scoring and validation
- Real-time alerts and notifications

### 5. **Regional Patient Network**
- Cross-hospital patient visibility
- Distance-based filtering
- Travel time estimation
- Availability status coordination
- Emergency contact management

## 🔧 Technical Architecture

### Backend Components

#### 1. Hospital Portal Routes (`/api/hospital-portal/`)
- **POST** `/doctor/login` - Doctor authentication
- **GET** `/patients/real-time` - Live patient data
- **GET** `/patients/regional` - Regional patient search
- **POST** `/attendance/rfid` - RFID attendance marking
- **POST** `/attendance/manual` - Manual attendance recording
- **POST** `/vision/detect` - Computer vision detection
- **GET** `/dashboard` - Hospital dashboard data

#### 2. RFID Service (`services/rfidService.js`)
```javascript
// Key Methods:
- connect() - Initialize RFID system
- registerTag(tagId, patientId, patientName) - Register new RFID tag
- readTag(tagId, readerId, hospitalId) - Process RFID reading
- getPatientLocation(patientId) - Get real-time location
- monitorReaderHealth() - Check RFID reader status
- generateAttendanceAnalytics() - Create attendance reports
```

#### 3. Computer Vision Service (`services/computerVision.js`)
```javascript
// Key Methods:
- detectPatients(imageData, cameraId, knownPatients) - Detect patients in image
- analyzeMovementPatterns(cameraId, timeRange) - Analyze patient movement
- trackPatientRealTime(patientId, cameraNetwork) - Real-time tracking
- generateAttendanceReport(hospitalId, dateRange) - CV-based attendance
```

### Frontend Components

#### 1. Hospital Portal Dashboard (`components/HospitalPortal.js`)
- **Login Interface** - Doctor authentication form
- **Dashboard Tab** - Hospital statistics and overview
- **Real-time Patients Tab** - Live patient monitoring
- **Regional Patients Tab** - Cross-hospital patient search
- **Attendance Tab** - RFID and manual attendance management
- **Computer Vision Tab** - AI detection controls

## 🚀 Setup Instructions

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies (already included in package.json)
npm install

# Environment variables (.env file)
JWT_SECRET=your_jwt_secret_key
CV_API_ENDPOINT=https://your-cv-api.com
CV_API_KEY=your_computer_vision_api_key
RFID_CONNECTION_STRING=your_rfid_system_connection
```

### 2. Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install axios

# Environment variables (.env file)
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start the System

```bash
# Start backend server
cd server
npm run dev

# Start frontend (in new terminal)
cd client
npm start
```

## 📱 Usage Guide

### Doctor Login Process

1. **Access Portal**: Navigate to `/hospital` route
2. **Enter Credentials**:
   - Email: doctor@hospital.com
   - Password: secure_password
   - Hospital ID: HOSP_001
   - Doctor ID: DOC_001
3. **Authentication**: System validates credentials and issues JWT token
4. **Dashboard Access**: Redirected to hospital-specific dashboard

### Real-Time Patient Monitoring

1. **Navigate to Real-time Tab**
2. **Apply Filters**:
   - Organ Type: Heart, Kidney, Liver
   - Urgency Level: Critical, High
   - Region: Geographic filter
3. **View Patient Cards**:
   - Present/Absent status
   - Vital signs (if available)
   - Contact information
   - Last seen timestamp

### RFID Attendance Management

1. **Navigate to Attendance Tab**
2. **RFID Method**:
   - Enter RFID tag ID (e.g., RFID001)
   - Specify location (e.g., Ward 3A)
   - System automatically identifies patient
3. **Manual Method**:
   - Enter Patient ID
   - Select Present/Absent status
   - Add location and notes

### Computer Vision Detection

1. **Navigate to Computer Vision Tab**
2. **Trigger Detection**: Click "Trigger Detection" button
3. **View Results**: System displays detected patients with confidence scores
4. **Camera Status**: Monitor camera network health

### Regional Patient Search

1. **Navigate to Regional Tab**
2. **Set Search Criteria**:
   - Region: Delhi NCR, Mumbai, etc.
   - Radius: Distance in kilometers
   - Organ Type: Filter by needed organ
3. **View Results**: Available patients in nearby hospitals
4. **Contact Information**: Hospital details and travel time

## 🔒 Security Features

### Authentication & Authorization
- JWT token-based authentication
- Hospital-specific access control
- Doctor role verification
- Session timeout (8 hours)
- Secure password handling with bcrypt

### Data Protection
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS protection
- Helmet.js security headers
- Encrypted patient data transmission

### Privacy Compliance
- ABHA ID integration for patient verification
- Anonymized patient data in logs
- Secure API endpoints
- Data retention policies

## 🔄 Real-Time Features

### WebSocket Integration
```javascript
// Real-time updates via Socket.IO
io.on('connection', (socket) => {
  socket.on('join-hospital', (hospitalId) => {
    socket.join(`hospital-${hospitalId}`);
  });
  
  // Emit real-time updates
  io.to(`hospital-${hospitalId}`).emit('patientUpdate', data);
});
```

### Live Data Streams
- Patient status changes
- RFID tag readings
- Computer vision detections
- Emergency alerts
- System notifications

## 📊 Analytics & Reporting

### Attendance Analytics
- Daily attendance rates
- Patient movement patterns
- Location-based statistics
- Time-based analysis
- Compliance reporting

### Performance Metrics
- System response times
- Detection accuracy rates
- RFID reader health
- Camera network status
- User activity logs

## 🔧 Integration Points

### Government Systems
- ABHA (Ayushman Bharat Health Account) integration
- NOTTO (National Organ & Tissue Transplant Organisation) connectivity
- Ayushman Bharat scheme integration

### Hospital Systems
- HIS (Hospital Information System) integration
- EMR (Electronic Medical Records) connectivity
- Laboratory system integration
- Pharmacy system coordination

### External APIs
- Computer Vision APIs (Azure Cognitive Services, AWS Rekognition)
- Mapping services for distance calculation
- SMS/Email notification services
- Government database APIs

## 🚨 Emergency Protocols

### Critical Patient Alerts
- Automatic notifications for critical patients
- Emergency contact activation
- Priority escalation procedures
- Real-time status updates

### System Failover
- RFID system backup procedures
- Computer vision fallback methods
- Manual attendance override
- Emergency communication channels

## 📈 Scalability Considerations

### Horizontal Scaling
- Load balancer configuration
- Database sharding strategies
- Redis clustering for sessions
- Microservices architecture

### Performance Optimization
- Database indexing strategies
- Caching mechanisms
- Image processing optimization
- Real-time data compression

## 🔍 Troubleshooting

### Common Issues

1. **RFID Reader Offline**
   - Check network connectivity
   - Verify power supply
   - Restart reader service
   - Contact technical support

2. **Computer Vision Detection Failure**
   - Verify camera connectivity
   - Check lighting conditions
   - Validate API credentials
   - Review image quality

3. **Patient Not Found**
   - Verify ABHA ID format
   - Check patient registration
   - Confirm hospital assignment
   - Update patient database

### Support Contacts
- Technical Support: support@aarogyam.gov.in
- Emergency Hotline: 1800-XXX-XXXX
- System Administrator: admin@hospital.com

## 📋 API Documentation

### Authentication Headers
```javascript
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Sample API Calls

#### Get Real-Time Patients
```javascript
GET /api/hospital-portal/patients/real-time?organType=heart&urgencyLevel=critical

Response:
{
  "success": true,
  "timestamp": "2024-01-15T10:30:00Z",
  "hospitalId": "HOSP_001",
  "totalPatients": 15,
  "presentPatients": 12,
  "absentPatients": 3,
  "patients": [...]
}
```

#### Mark RFID Attendance
```javascript
POST /api/hospital-portal/attendance/rfid
{
  "rfidTag": "RFID001",
  "location": "Ward 3A"
}

Response:
{
  "success": true,
  "message": "Attendance marked successfully via RFID",
  "attendance": {...},
  "patientStatus": "present"
}
```

## 🎯 Future Enhancements

### Planned Features
- AI-powered patient risk assessment
- Predictive analytics for organ allocation
- Mobile app for doctors
- Voice command integration
- Blockchain-based audit trail

### Technology Upgrades
- 5G connectivity for real-time data
- Edge computing for faster processing
- Advanced ML models for detection
- IoT sensor integration
- Augmented reality interfaces

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Maintained By**: Aarogyam Development Team
