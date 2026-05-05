Write-Host "🏥 AAROGYAM LOGIN TEST" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Green

# Test server health first
Write-Host "`n1. Testing server health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get
    Write-Host "✅ Server Status: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Server not running! Please start with: cd server && npm run dev" -ForegroundColor Red
    Write-Host "   Then run this script again." -ForegroundColor Yellow
    exit
}

# Test credentials
$credentials = @(
    @{
        name = "Dr. Rajesh Sharma (AIIMS)"
        email = "dr.sharma@aiims.edu"
        password = "Doctor@123"
        role = "Doctor"
    },
    @{
        name = "Dr. Priya Gupta (PGIMER)"
        email = "dr.priya@pgimer.edu.in"
        password = "Doctor@123"
        role = "Doctor"
    },
    @{
        name = "System Administrator"
        email = "admin@aarogyam.gov.in"
        password = "AarogyamAdmin@2024"
        role = "Admin"
    }
)

Write-Host "`n2. Testing login credentials..." -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Yellow

foreach ($cred in $credentials) {
    Write-Host "`n👤 Testing: $($cred.name)" -ForegroundColor Cyan
    
    $loginData = @{
        email = $cred.email
        password = $cred.password
    } | ConvertTo-Json -Depth 3
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $loginData -ContentType "application/json"
        
        if ($response.success) {
            Write-Host "   ✅ Login successful!" -ForegroundColor Green
            Write-Host "   📧 Email: $($response.user.email)" -ForegroundColor Gray
            Write-Host "   👤 Name: $($response.user.name)" -ForegroundColor Gray
            Write-Host "   🏥 Hospital: $($response.user.hospitalName)" -ForegroundColor Gray
            Write-Host "   🔑 Token: $($response.token.Substring(0,30))..." -ForegroundColor Gray
        } else {
            Write-Host "   ❌ Login failed: $($response.message)" -ForegroundColor Red
        }
    } catch {
        Write-Host "   ❌ Connection error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n3. Testing transparency APIs..." -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Yellow

try {
    Write-Host "📊 Testing dashboard..." -ForegroundColor Cyan
    $dashboard = Invoke-RestMethod -Uri "http://localhost:5000/api/transparency/dashboard" -Method Get
    Write-Host "   ✅ Dashboard loaded - Hospitals: $($dashboard.data.systemStats.totalHospitals)" -ForegroundColor Green
    
    Write-Host "🏥 Testing hospital stats..." -ForegroundColor Cyan
    $stats = Invoke-RestMethod -Uri "http://localhost:5000/api/transparency/hospital-stats" -Method Get
    Write-Host "   ✅ Hospital stats loaded - Total: $($stats.data.totalHospitals)" -ForegroundColor Green
    
    Write-Host "📡 Testing activity feed..." -ForegroundColor Cyan
    $activities = Invoke-RestMethod -Uri "http://localhost:5000/api/transparency/real-time-feed?limit=3" -Method Get
    Write-Host "   ✅ Activity feed loaded - Activities: $($activities.activities.Count)" -ForegroundColor Green
    
} catch {
    Write-Host "   ❌ API test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 TESTING COMPLETE!" -ForegroundColor Green
Write-Host "=====================" -ForegroundColor Green
Write-Host "🌐 Access the demo login page at:" -ForegroundColor Cyan
Write-Host "   http://localhost:5000/api/auth/demo-login-page" -ForegroundColor White
Write-Host "`n📋 Quick URLs:" -ForegroundColor Cyan
Write-Host "   Demo Users: http://localhost:5000/api/auth/demo-users" -ForegroundColor Gray
Write-Host "   Dashboard:  http://localhost:5000/api/transparency/dashboard" -ForegroundColor Gray
Write-Host "   Health:     http://localhost:5000/health" -ForegroundColor Gray
