@echo off
echo ========================================
echo    Aarogyam Hospital Portal Setup
echo ========================================
echo.

echo [1/4] Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install server dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Installing client dependencies...
cd ..\client
call npm install
call npm install axios
if %errorlevel% neq 0 (
    echo ERROR: Failed to install client dependencies
    pause
    exit /b 1
)

echo.
echo [3/4] Setting up environment files...
cd ..\server
if not exist .env (
    echo Creating server .env file...
    echo JWT_SECRET=aarogyam_hospital_portal_secret_key_2024 > .env
    echo CV_API_ENDPOINT=https://api.example-cv.com >> .env
    echo CV_API_KEY=demo-key >> .env
    echo RFID_CONNECTION_STRING=mock_rfid_connection >> .env
    echo NODE_ENV=development >> .env
    echo PORT=5000 >> .env
    echo CLIENT_URL=http://localhost:3000 >> .env
)

cd ..\client
if not exist .env (
    echo Creating client .env file...
    echo REACT_APP_API_URL=http://localhost:5000/api > .env
)

echo.
echo [4/4] Setup complete!
echo.
echo ========================================
echo           Quick Start Guide
echo ========================================
echo.
echo To start the Hospital Portal system:
echo.
echo 1. Start the backend server:
echo    cd server
echo    npm run dev
echo.
echo 2. Start the frontend (in new terminal):
echo    cd client
echo    npm start
echo.
echo 3. Access the Hospital Portal:
echo    http://localhost:3000/hospital
echo.
echo Default Doctor Login Credentials:
echo    Email: doctor@hospital.com
echo    Password: password123
echo    Hospital ID: HOSP_001
echo    Doctor ID: DOC_001
echo.
echo ========================================
echo        System Features Available
echo ========================================
echo.
echo ✓ Real-time Patient Monitoring
echo ✓ RFID Attendance Tracking
echo ✓ Computer Vision Patient Detection
echo ✓ Regional Patient Search
echo ✓ Hospital Dashboard Analytics
echo ✓ Manual Attendance Management
echo.
echo For detailed documentation, see:
echo HOSPITAL_PORTAL_DOCUMENTATION.md
echo.
echo ========================================
pause
