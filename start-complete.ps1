Write-Host "🏥 AAROGYAM COMPLETE STARTUP SCRIPT" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

# Function to check if port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

# Step 1: Check Node.js
Write-Host "`n1. Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   ✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Step 2: Kill existing processes
Write-Host "`n2. Cleaning up existing processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Step 3: Install dependencies if needed
Write-Host "`n3. Checking dependencies..." -ForegroundColor Yellow

# Server dependencies
if (!(Test-Path "server/node_modules")) {
    Write-Host "   📦 Installing server dependencies..." -ForegroundColor Cyan
    Set-Location server
    npm install
    Set-Location ..
}

# Client dependencies  
if (!(Test-Path "client/node_modules")) {
    Write-Host "   📦 Installing client dependencies..." -ForegroundColor Cyan
    Set-Location client
    npm install
    Set-Location ..
}

Write-Host "   ✅ Dependencies ready" -ForegroundColor Green

# Step 4: Start backend server
Write-Host "`n4. Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD/server'; Write-Host '🚀 Starting Aarogyam Backend Server...' -ForegroundColor Green; npm run dev" -WindowStyle Normal

# Wait for backend to start
Write-Host "   ⏳ Waiting for backend server to start..." -ForegroundColor Cyan
$backendReady = $false
$attempts = 0
while (!$backendReady -and $attempts -lt 30) {
    Start-Sleep -Seconds 2
    $attempts++
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            $backendReady = $true
            Write-Host "   ✅ Backend server is running on port 5000" -ForegroundColor Green
        }
    } catch {
        Write-Host "   ⏳ Attempt $attempts/30 - Backend starting..." -ForegroundColor Gray
    }
}

if (!$backendReady) {
    Write-Host "   ⚠️  Backend server taking longer than expected" -ForegroundColor Yellow
    Write-Host "   📊 Transparency dashboard will use demo data" -ForegroundColor Cyan
}

# Step 5: Start frontend client
Write-Host "`n5. Starting frontend client..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD/client'; Write-Host '🌐 Starting Aarogyam Frontend Client...' -ForegroundColor Blue; npm start" -WindowStyle Normal

# Step 6: Wait for frontend
Write-Host "   ⏳ Waiting for frontend client to start..." -ForegroundColor Cyan
$frontendReady = $false
$attempts = 0
while (!$frontendReady -and $attempts -lt 20) {
    Start-Sleep -Seconds 3
    $attempts++
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            $frontendReady = $true
            Write-Host "   ✅ Frontend client is running on port 3000" -ForegroundColor Green
        }
    } catch {
        Write-Host "   ⏳ Attempt $attempts/20 - Frontend starting..." -ForegroundColor Gray
    }
}

# Step 7: Display results
Write-Host "`n🎉 AAROGYAM STARTUP COMPLETE!" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green

Write-Host "`n📊 SERVER STATUS:" -ForegroundColor Cyan
if ($backendReady) {
    Write-Host "   🟢 Backend: http://localhost:5000 (Live Data)" -ForegroundColor Green
} else {
    Write-Host "   🔴 Backend: Starting... (Demo Data Available)" -ForegroundColor Yellow
}

if ($frontendReady) {
    Write-Host "   🟢 Frontend: http://localhost:3000 (Ready)" -ForegroundColor Green
} else {
    Write-Host "   🔴 Frontend: Starting... (Please wait)" -ForegroundColor Yellow
}

Write-Host "`n🔐 LOGIN CREDENTIALS:" -ForegroundColor Yellow
Write-Host "=====================" -ForegroundColor Yellow
Write-Host "⚡ QUICK CODES (Type and press Enter):" -ForegroundColor White
Write-Host "   • aiims    - AIIMS Doctor Login" -ForegroundColor Gray
Write-Host "   • pgimer   - PGIMER Doctor Login" -ForegroundColor Gray  
Write-Host "   • admin    - System Administrator" -ForegroundColor Gray
Write-Host "   • doctor   - Default Doctor" -ForegroundColor Gray
Write-Host "   • 123      - Super Quick Access" -ForegroundColor Gray
Write-Host "   • transparency - Admin for Transparency" -ForegroundColor Gray

Write-Host "`n👨‍⚕️ MANUAL CREDENTIALS:" -ForegroundColor White
Write-Host "   Email: dr.sharma@aiims.edu" -ForegroundColor Gray
Write-Host "   Password: Doctor@123" -ForegroundColor Gray
Write-Host "   Email: admin@aarogyam.gov.in" -ForegroundColor Gray
Write-Host "   Password: AarogyamAdmin@2024" -ForegroundColor Gray

Write-Host "`n🌐 ACCESS URLS:" -ForegroundColor Cyan
Write-Host "===============" -ForegroundColor Cyan
Write-Host "   🏥 Hospital Portal: http://localhost:3000/hospital-portal" -ForegroundColor White
Write-Host "   📊 Transparency: http://localhost:3000/transparency" -ForegroundColor White  
Write-Host "   🤖 AI Chatbot: Available on all pages (bottom-right)" -ForegroundColor White
Write-Host "   ❤️  Health Check: http://localhost:5000/health" -ForegroundColor White

Write-Host "`n🚀 FEATURES AVAILABLE:" -ForegroundColor Magenta
Write-Host "======================" -ForegroundColor Magenta
Write-Host "   ✅ One-Click Login Buttons" -ForegroundColor Green
Write-Host "   ✅ Quick Login Codes" -ForegroundColor Green
Write-Host "   ✅ AI Chatbot Assistant" -ForegroundColor Green
Write-Host "   ✅ Real-time Transparency Dashboard" -ForegroundColor Green
Write-Host "   ✅ Demo Data Fallback" -ForegroundColor Green
Write-Host "   ✅ Mobile Responsive Design" -ForegroundColor Green

if ($frontendReady) {
    Write-Host "`n🎯 Ready to use! Open http://localhost:3000 in your browser" -ForegroundColor Green
    
    # Auto-open browser
    Write-Host "`n🌐 Opening browser..." -ForegroundColor Cyan
    Start-Process "http://localhost:3000"
} else {
    Write-Host "`n⏳ Frontend still starting. Please wait a moment and try http://localhost:3000" -ForegroundColor Yellow
}

Write-Host "`nPress any key to exit this script (servers will continue running)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
