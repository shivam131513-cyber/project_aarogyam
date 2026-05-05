@echo off
echo ========================================
echo    Aarogyam Setup Script
echo ========================================

echo Installing root dependencies...
call npm install

echo Installing server dependencies...
cd server
call npm install
cd ..

echo Installing client dependencies...
cd client
call npm install
cd ..

echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo To start the application:
echo   npm run dev    (starts both frontend and backend)
echo   npm run server (starts only backend)
echo   npm run client (starts only frontend)
echo.
pause
