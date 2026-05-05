# 🏥 Aarogyam API Testing Guide

## 🚀 Quick Start

### 1. Deploy the Application
```bash
# Run the deployment script
deploy-aarogyam.bat

# Or start quickly
start-aarogyam.bat
```

### 2. Server URLs
- **API Base URL**: `http://localhost:5000`
- **Client URL**: `http://localhost:3000`
- **Health Check**: `http://localhost:5000/health`

---

## 🔐 Authentication & Login

### Demo Login Credentials

#### 👨‍⚕️ Doctor Login (AIIMS)
```json
{
  "email": "dr.sharma@aiims.edu",
  "password": "Doctor@123"
}
```

#### 👩‍⚕️ Doctor Login (PGIMER)
```json
{
  "email": "dr.priya@pgimer.edu.in", 
  "password": "Doctor@123"
}
```

#### 👨‍💼 Admin Login
```json
{
  "email": "admin@aarogyam.gov.in",
  "password": "AarogyamAdmin@2024"
}
```

### Login API Call

**POST** `/api/auth/login`

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dr.sharma@aiims.edu",
    "password": "Doctor@123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "DOC_001",
    "email": "dr.sharma@aiims.edu",
    "name": "Dr. Rajesh Sharma",
    "role": "doctor",
    "hospitalId": "HOSP_AIIMS_001",
    "hospitalName": "AIIMS New Delhi",
    "department": "Cardiology",
    "permissions": ["view_patients", "manage_attendance", "access_transparency"]
  }
}
```

---

## 📊 Transparency Dashboard APIs

### 1. Get Dashboard Data

**GET** `/api/transparency/dashboard`

```bash
curl -X GET http://localhost:5000/api/transparency/dashboard
```

**Response:** Complete transparency dashboard with:
- System statistics
- Real-time metrics
- Organ allocation data
- Regional statistics
- Technology metrics
- Equity metrics
- Recent activities
- Government integration status

### 2. Get Hospital Statistics

**GET** `/api/transparency/hospital-stats`

```bash
# Get all hospital stats
curl -X GET http://localhost:5000/api/transparency/hospital-stats

# Filter by region
curl -X GET "http://localhost:5000/api/transparency/hospital-stats?region=Delhi NCR"

# Filter by hospital type
curl -X GET "http://localhost:5000/api/transparency/hospital-stats?hospitalType=Government"
```

### 3. Get Real-time Activity Feed

**GET** `/api/transparency/real-time-feed`

```bash
# Get latest 50 activities
curl -X GET http://localhost:5000/api/transparency/real-time-feed

# Get latest 10 activities
curl -X GET "http://localhost:5000/api/transparency/real-time-feed?limit=10"

# Filter by activity type
curl -X GET "http://localhost:5000/api/transparency/real-time-feed?type=allocation&limit=20"
```

### 4. Log New Activity (Authenticated)

**POST** `/api/transparency/activity`

```bash
curl -X POST http://localhost:5000/api/transparency/activity \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "allocation",
    "region": "Delhi NCR",
    "message": "Heart successfully allocated to patient in AIIMS",
    "hospitalId": "HOSP_AIIMS_001",
    "metadata": {
      "urgencyScore": 95.2,
      "processingTime": "1.8 seconds",
      "confidence": 98
    },
    "isPublic": true
  }'
```

---

## 🏥 Hospital Portal APIs

### 1. Get Real-time Patient Data (Authenticated)

**GET** `/api/hospital-portal/patients/real-time`

```bash
curl -X GET http://localhost:5000/api/hospital-portal/patients/real-time \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Doctor Login (Hospital Portal Specific)

**POST** `/api/hospital-portal/doctor/login`

```bash
curl -X POST http://localhost:5000/api/hospital-portal/doctor/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dr.sharma@aiims.edu",
    "password": "Doctor@123"
  }'
```

---

## 🔧 Utility APIs

### 1. Health Check

**GET** `/health`

```bash
curl -X GET http://localhost:5000/health
```

### 2. Get Demo Users (Development Only)

**GET** `/api/auth/demo-users`

```bash
curl -X GET http://localhost:5000/api/auth/demo-users
```

### 3. Get User Profile (Authenticated)

**GET** `/api/auth/profile`

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Logout

**POST** `/api/auth/logout`

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🧪 Testing Workflow

### Step 1: Login and Get Token
```bash
# Login as doctor
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "dr.sharma@aiims.edu", "password": "Doctor@123"}' \
  | jq -r '.token'
```

### Step 2: Use Token for Authenticated Requests
```bash
# Set token variable
TOKEN="your_jwt_token_here"

# Get patient data
curl -X GET http://localhost:5000/api/hospital-portal/patients/real-time \
  -H "Authorization: Bearer $TOKEN"
```

### Step 3: Test Transparency APIs
```bash
# Get dashboard data
curl -X GET http://localhost:5000/api/transparency/dashboard | jq

# Get hospital stats
curl -X GET http://localhost:5000/api/transparency/hospital-stats | jq

# Get activity feed
curl -X GET http://localhost:5000/api/transparency/real-time-feed | jq
```

---

## 🌐 Frontend Integration

### Hospital Portal Access
- **URL**: `http://localhost:3000/hospital-portal`
- **Login**: Use doctor credentials above
- **Features**: Patient management, RFID attendance, computer vision

### Transparency Dashboard Access
- **URL**: `http://localhost:3000/transparency`
- **Access**: Public (no login required)
- **Features**: Real-time statistics, activity feed, hospital data

---

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```bash
   # Check MongoDB
   mongosh --eval "db.runCommand('ping')"
   
   # Check PostgreSQL
   psql -U postgres -c "SELECT version();"
   ```

2. **Redis Connection Error**
   ```bash
   # Check Redis (optional)
   redis-cli ping
   ```

3. **Port Already in Use**
   ```bash
   # Kill process on port 5000
   netstat -ano | findstr :5000
   taskkill /PID <PID_NUMBER> /F
   ```

### Reset Database
```bash
cd server
node scripts/setup-database.js
```

---

## 📝 API Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message",
  "details": [ ... ]
}
```

---

## 🔒 Security Notes

- JWT tokens expire in 8 hours
- Cookies are HTTP-only and secure in production
- Rate limiting: 30 requests per minute for transparency APIs
- CORS enabled for `http://localhost:3000`

---

## 📞 Support

For issues or questions:
1. Check server logs in console
2. Verify database connections
3. Ensure all dependencies are installed
4. Run `deploy-aarogyam.bat` to reset everything
