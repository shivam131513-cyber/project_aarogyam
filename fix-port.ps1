Write-Host "🔧 FIXING PORT 5000 ISSUE" -ForegroundColor Yellow
Write-Host "=========================" -ForegroundColor Yellow

# Step 1: Find processes using port 5000
Write-Host "`n1. Checking what's using port 5000..." -ForegroundColor Cyan
$portProcesses = netstat -ano | Select-String ":5000"

if ($portProcesses) {
    Write-Host "Found processes using port 5000:" -ForegroundColor Red
    $portProcesses | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
    
    # Extract PIDs and kill them
    $pids = $portProcesses | ForEach-Object {
        $line = $_.ToString()
        $parts = $line -split '\s+'
        $parts[-1]  # Last part is PID
    } | Sort-Object -Unique
    
    Write-Host "`n2. Killing processes..." -ForegroundColor Yellow
    foreach ($pid in $pids) {
        try {
            Stop-Process -Id $pid -Force -ErrorAction Stop
            Write-Host "   ✅ Killed process $pid" -ForegroundColor Green
        } catch {
            Write-Host "   ⚠️  Could not kill process $pid (might not exist)" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "   ✅ Port 5000 is free" -ForegroundColor Green
}

# Step 2: Kill any remaining Node.js processes
Write-Host "`n3. Cleaning up Node.js processes..." -ForegroundColor Cyan
try {
    Get-Process node -ErrorAction Stop | Stop-Process -Force
    Write-Host "   ✅ Killed remaining Node.js processes" -ForegroundColor Green
} catch {
    Write-Host "   ✅ No Node.js processes found" -ForegroundColor Green
}

# Step 3: Wait a moment
Write-Host "`n4. Waiting for cleanup..." -ForegroundColor Cyan
Start-Sleep -Seconds 2

# Step 4: Start the server
Write-Host "`n5. Starting Aarogyam server..." -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

Set-Location server

# Check if port is now free
$check = netstat -ano | Select-String ":5000"
if ($check) {
    Write-Host "⚠️  Port 5000 still in use. Using port 5001 instead..." -ForegroundColor Yellow
    $env:PORT = "5001"
    Write-Host "🌐 Server will start on: http://localhost:5001" -ForegroundColor Cyan
} else {
    Write-Host "✅ Port 5000 is free. Starting server..." -ForegroundColor Green
    Write-Host "🌐 Server will start on: http://localhost:5000" -ForegroundColor Cyan
}

Write-Host "`n📋 DEMO CREDENTIALS:" -ForegroundColor Yellow
Write-Host "===================" -ForegroundColor Yellow
Write-Host "👨‍⚕️ Doctor: dr.sharma@aiims.edu / Doctor@123" -ForegroundColor Gray
Write-Host "👩‍⚕️ Doctor: dr.priya@pgimer.edu.in / Doctor@123" -ForegroundColor Gray
Write-Host "👨‍💼 Admin: admin@aarogyam.gov.in / AarogyamAdmin@2024" -ForegroundColor Gray

Write-Host "`n🚀 Starting server..." -ForegroundColor Green
npm run dev
