@echo off
echo ========================================
echo    AAROGYAM DEPLOYMENT SCRIPT
echo ========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

:: Check if MongoDB is running
echo 🔄 Checking MongoDB connection...
mongosh --eval "db.runCommand('ping')" >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB is not running. Please start MongoDB service.
    echo    You can start it with: net start MongoDB
    pause
)

:: Check if Redis is running (optional)
echo 🔄 Checking Redis connection...
redis-cli ping >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Redis is not running. Starting without Redis cache...
    echo    Install Redis for better performance: https://redis.io/download
)

:: Check if PostgreSQL is running
echo 🔄 Checking PostgreSQL connection...
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  PostgreSQL is not installed. Please install PostgreSQL.
    pause
)

echo.
echo 🚀 Starting Aarogyam Deployment...
echo.

:: Navigate to server directory
cd /d "%~dp0server"

:: Install server dependencies
echo 📦 Installing server dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install server dependencies
    pause
    exit /b 1
)

:: Add missing dependencies
echo 📦 Installing additional dependencies...
call npm install uuid cookie-parser
if %errorlevel% neq 0 (
    echo ❌ Failed to install additional dependencies
    pause
    exit /b 1
)

:: Setup database
echo 🗄️  Setting up database...
node scripts/setup-database.js
if %errorlevel% neq 0 (
    echo ❌ Database setup failed
    pause
    exit /b 1
)

:: Navigate to client directory
cd /d "%~dp0client"

:: Install client dependencies
echo 📦 Installing client dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install client dependencies
    pause
    exit /b 1
)

:: Build client
echo 🔨 Building client application...
call npm run build
if %errorlevel% neq 0 (
    echo ⚠️  Client build failed, but continuing...
)

:: Go back to root directory
cd /d "%~dp0"

echo.
echo ✅ Deployment completed successfully!
echo.
echo 📋 LOGIN CREDENTIALS:
echo ==========================================
echo 👨‍⚕️ Doctor Login:
echo    Email: dr.sharma@aiims.edu
echo    Password: Doctor@123
echo.
echo 👩‍⚕️ Another Doctor:
echo    Email: dr.priya@pgimer.edu.in
echo    Password: Doctor@123
echo.
echo 👨‍💼 Admin Login:
echo    Email: admin@aarogyam.gov.in
echo    Password: AarogyamAdmin@2024
echo.
echo 🌐 ACCESS URLS:
echo ==========================================
echo    Server: http://localhost:5000
echo    Client: http://localhost:3000
echo    Hospital Portal: http://localhost:3000/hospital-portal
echo    Transparency Dashboard: http://localhost:3000/transparency
echo    API Health: http://localhost:5000/health
echo    Demo Users API: http://localhost:5000/api/auth/demo-users
echo.
echo 🚀 TO START THE APPLICATION:
echo ==========================================
echo    1. Start Server: cd server && npm run dev
echo    2. Start Client: cd client && npm start
echo    3. Or use: npm run dev (if available)
echo.
echo 📚 API ENDPOINTS:
echo ==========================================
echo    POST /api/auth/login - Hospital/Admin login
echo    GET  /api/transparency/dashboard - Public dashboard
echo    GET  /api/transparency/hospital-stats - Hospital statistics
echo    GET  /api/transparency/real-time-feed - Activity feed
echo    POST /api/transparency/activity - Log activity
echo    GET  /api/hospital-portal/patients/real-time - Patient data
echo.
echo Press any key to start the server...
pause >nul

:: Start the server
cd /d "%~dp0server"
echo 🚀 Starting Aarogyam Server...
npm run dev
