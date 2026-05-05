@echo off
title Aarogyam - Organ Allocation System
color 0A

echo.
echo  █████╗  █████╗ ██████╗  ██████╗  ██████╗██╗   ██╗ █████╗ ███╗   ███╗
echo ██╔══██╗██╔══██╗██╔══██╗██╔═══██╗██╔════╝╚██╗ ██╔╝██╔══██╗████╗ ████║
echo ███████║███████║██████╔╝██║   ██║██║  ███╗╚████╔╝ ███████║██╔████╔██║
echo ██╔══██║██╔══██║██╔══██╗██║   ██║██║   ██║ ╚██╔╝  ██╔══██║██║╚██╔╝██║
echo ██║  ██║██║  ██║██║  ██║╚██████╔╝╚██████╔╝  ██║   ██║  ██║██║ ╚═╝ ██║
echo ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝   ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝
echo.
echo                    🏥 ORGAN ALLOCATION SYSTEM 🏥
echo                        Transparency Dashboard
echo.
echo ========================================================================

:: Check if server directory exists
if not exist "server" (
    echo ❌ Server directory not found. Please run deploy-aarogyam.bat first.
    pause
    exit /b 1
)

:: Navigate to server directory
cd /d "%~dp0server"

:: Check if node_modules exists
if not exist "node_modules" (
    echo ❌ Dependencies not installed. Please run deploy-aarogyam.bat first.
    pause
    exit /b 1
)

echo 🔄 Starting Aarogyam Server...
echo.
echo 📋 DEMO LOGIN CREDENTIALS:
echo ========================================================================
echo 👨‍⚕️ DOCTOR LOGIN (AIIMS):
echo    📧 Email: dr.sharma@aiims.edu
echo    🔑 Password: Doctor@123
echo    🏥 Hospital: AIIMS New Delhi
echo.
echo 👩‍⚕️ DOCTOR LOGIN (PGIMER):
echo    📧 Email: dr.priya@pgimer.edu.in
echo    🔑 Password: Doctor@123
echo    🏥 Hospital: PGIMER Chandigarh
echo.
echo 👨‍💼 ADMIN LOGIN:
echo    📧 Email: admin@aarogyam.gov.in
echo    🔑 Password: AarogyamAdmin@2024
echo    🏢 Role: System Administrator
echo.
echo 🌐 ACCESS URLS:
echo ========================================================================
echo    🖥️  Server API: http://localhost:5000
echo    🌍 Client App: http://localhost:3000
echo    🏥 Hospital Portal: http://localhost:3000/hospital-portal
echo    📊 Transparency Dashboard: http://localhost:3000/transparency
echo    ❤️  Health Check: http://localhost:5000/health
echo    👥 Demo Users: http://localhost:5000/api/auth/demo-users
echo.
echo 🔧 API ENDPOINTS FOR TESTING:
echo ========================================================================
echo    🔐 POST /api/auth/login - Login (Hospital/Admin)
echo    📊 GET  /api/transparency/dashboard - Public Dashboard Data
echo    🏥 GET  /api/transparency/hospital-stats - Hospital Statistics
echo    📡 GET  /api/transparency/real-time-feed - Real-time Activity Feed
echo    📝 POST /api/transparency/activity - Log New Activity
echo    🩺 GET  /api/hospital-portal/patients/real-time - Patient Data
echo.
echo 🚀 STARTING SERVER...
echo ========================================================================

:: Start the development server
npm run dev

:: If npm run dev fails, try npm start
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  npm run dev failed, trying npm start...
    npm start
)

:: If both fail, show error
if %errorlevel% neq 0 (
    echo.
    echo ❌ Failed to start server. Please check the error messages above.
    echo    Make sure all dependencies are installed by running deploy-aarogyam.bat
    pause
)

pause
