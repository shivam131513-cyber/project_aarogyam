# 🏥 Aarogyam Enhanced Access Guide

## 🚀 **SUPER EASY LOGIN METHODS**

### **1. One-Click Login Buttons**
- **Green Button**: Dr. Sharma (AIIMS) - Instant login
- **Blue Button**: Dr. Priya (PGIMER) - Instant login  
- **Orange Button**: System Admin - Full access

### **2. Quick Login Codes (Type and Press Enter)**
- `aiims` - Login as AIIMS doctor
- `pgimer` - Login as PGIMER doctor
- `admin` - Login as system administrator
- `doctor` - Default doctor login
- `123` - Super quick access
- `transparency` - Admin access for transparency

### **3. Manual Login Credentials**

#### 👨‍⚕️ **Doctor Login (AIIMS)**
```
Email: dr.sharma@aiims.edu
Password: Doctor@123
Hospital: AIIMS New Delhi
Department: Cardiology
```

#### 👩‍⚕️ **Doctor Login (PGIMER)**
```
Email: dr.priya@pgimer.edu.in
Password: Doctor@123
Hospital: PGIMER Chandigarh
Department: Nephrology
```

#### 👨‍💼 **Admin Login (Full Access)**
```
Email: admin@aarogyam.gov.in
Password: AarogyamAdmin@2024
Hospital: Aarogyam Central System
Department: Administration
```

## 🌐 **ACCESS URLS**

### **Hospital Portal**
- **URL**: `http://localhost:3000/hospital-portal`
- **Features**: Patient management, RFID attendance, computer vision
- **Login Required**: Yes (use credentials above)

### **Transparency Dashboard**
- **URL**: `http://localhost:3000/transparency`
- **Features**: Public statistics, real-time data, equity metrics
- **Login Required**: No (public access)
- **Admin Access**: Use admin credentials for advanced features

### **Advanced Transparency**
- **URL**: `http://localhost:3000/transparency-advanced`
- **Features**: Advanced analytics, detailed charts
- **Login Required**: No (public access)

## 🤖 **AI CHATBOT FEATURES**

### **Always Available**
- **Location**: Bottom-right corner (🤖 icon)
- **Features**: 24/7 assistance, quick help, navigation
- **Languages**: English (expandable to 15+ Indian languages)

### **Quick Help Commands**
- **Hospital Login**: Get login help and credentials
- **Transparency**: Access transparency dashboard
- **Find Hospitals**: Search hospital information
- **Patient Status**: Check patient tracking
- **Emergency**: Get emergency assistance
- **Support**: Contact technical support

### **Smart Responses**
- Understands natural language
- Provides contextual help
- Offers quick action buttons
- Redirects to appropriate pages

## 🔧 **DEPLOYMENT COMMANDS**

### **Start Backend Server**
```powershell
cd server
npm run dev
```

### **Start Frontend Client**
```powershell
cd client
npm start
```

### **Quick Fix for Port Issues**
```powershell
.\fix-port.ps1
```

### **Test All Systems**
```powershell
.\test-login.ps1
```

## 📊 **API ENDPOINTS FOR TESTING**

### **Authentication**
- `POST /api/auth/login` - Hospital/Admin login
- `GET /api/auth/demo-users` - Get demo credentials
- `GET /api/auth/ids-reference` - Complete ID reference

### **Transparency**
- `GET /api/transparency/dashboard` - Complete dashboard data
- `GET /api/transparency/hospital-stats` - Hospital statistics
- `GET /api/transparency/real-time-feed` - Live activity feed

### **Hospital Portal**
- `GET /api/hospital-portal/patients/real-time` - Patient data
- `POST /api/hospital-portal/attendance/rfid` - RFID attendance
- `POST /api/hospital-portal/vision/detect` - Computer vision

## 🎯 **ENHANCED FEATURES**

### **Hospital Portal Enhancements**
1. **One-Click Login**: Colored buttons for instant access
2. **Quick Codes**: Type keywords for super-fast login
3. **Auto-Fill**: Click credential cards to fill forms
4. **Visual Feedback**: Real-time status indicators
5. **Mobile Responsive**: Works on all devices

### **Transparency Dashboard**
1. **Public Access**: No login required for viewing
2. **Real-Time Data**: Updates every 30 seconds
3. **Admin Credentials**: Clearly displayed for easy access
4. **Interactive Tabs**: Overview, Hospitals, Activity, Equity
5. **Live Statistics**: Current system performance

### **AI Chatbot**
1. **Context Aware**: Understands user intent
2. **Quick Actions**: Instant help buttons
3. **Navigation**: Direct links to relevant pages
4. **24/7 Support**: Always available assistance
5. **Smart Suggestions**: Proactive help recommendations

## 🔒 **SECURITY FEATURES**

### **Authentication**
- JWT tokens with 8-hour expiration
- HTTP-only cookies for security
- Role-based access control
- Session management

### **Data Protection**
- All patient data anonymized
- Encrypted data transmission
- Privacy-compliant aggregation
- Secure API endpoints

## 🚨 **TROUBLESHOOTING**

### **Server Won't Start**
```powershell
# Kill processes on port 5000
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
cd server
npm run dev
```

### **Login Issues**
1. Check server is running on port 5000
2. Try quick codes: `aiims`, `admin`, `123`
3. Use one-click login buttons
4. Clear browser cache and cookies

### **Chatbot Not Working**
1. Refresh the page
2. Check console for errors
3. Ensure backend APIs are accessible
4. Try different browser

## 📞 **SUPPORT CONTACTS**

### **Technical Support**
- **Email**: support@aarogyam.gov.in
- **Phone**: +91-11-2345-6789
- **Live Chat**: Available via chatbot

### **Emergency Assistance**
- **Hotline**: 1800-ORGAN-HELP
- **Response Time**: <15 minutes
- **24/7 Availability**: Yes

---

## 🎉 **QUICK START CHECKLIST**

- [ ] Backend server running (`cd server && npm run dev`)
- [ ] Frontend client running (`cd client && npm start`)
- [ ] Test login with quick code `123`
- [ ] Access transparency at `/transparency`
- [ ] Try chatbot in bottom-right corner
- [ ] Test admin access with `transparency` code

**Everything is now super accessible and user-friendly!** 🚀
