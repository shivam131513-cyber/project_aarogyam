Write-Host "========================================" -ForegroundColor Green
Write-Host "    AAROGYAM SETUP SCRIPT" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Navigate to server directory
Write-Host "Installing server dependencies..." -ForegroundColor Yellow
Set-Location server

# Install dependencies
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Install additional dependencies
npm install uuid cookie-parser
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install additional dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green

# Setup database (if MongoDB is available)
Write-Host "Setting up database..." -ForegroundColor Yellow
try {
    node scripts/setup-database.js
    Write-Host "✅ Database setup completed" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Database setup failed - continuing without sample data" -ForegroundColor Yellow
}

# Go back to root
Set-Location ..

Write-Host "" 
Write-Host "🎉 SETUP COMPLETED!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 LOGIN CREDENTIALS:" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "👨‍⚕️ Doctor Login:" -ForegroundColor White
Write-Host "   Email: dr.sharma@aiims.edu" -ForegroundColor Gray
Write-Host "   Password: Doctor@123" -ForegroundColor Gray
Write-Host ""
Write-Host "👩‍⚕️ Another Doctor:" -ForegroundColor White
Write-Host "   Email: dr.priya@pgimer.edu.in" -ForegroundColor Gray
Write-Host "   Password: Doctor@123" -ForegroundColor Gray
Write-Host ""
Write-Host "👨‍💼 Admin Login:" -ForegroundColor White
Write-Host "   Email: admin@aarogyam.gov.in" -ForegroundColor Gray
Write-Host "   Password: AarogyamAdmin@2024" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 TO START THE SERVER:" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "cd server" -ForegroundColor Yellow
Write-Host "npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 ACCESS URLS:" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "   Server: http://localhost:5000" -ForegroundColor Gray
Write-Host "   Health Check: http://localhost:5000/health" -ForegroundColor Gray
Write-Host "   Demo Users: http://localhost:5000/api/auth/demo-users" -ForegroundColor Gray
Write-Host "   Transparency API: http://localhost:5000/api/transparency/dashboard" -ForegroundColor Gray
