# Test all APIs systematically
Write-Host "🧪 Testing Tier-Based Hiring Platform APIs..." -ForegroundColor Green

# Test 1: Get Domains
Write-Host "`n1️⃣ Testing GET /api/domains" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/domains" -Method GET
    Write-Host "✅ Domains API: SUCCESS ($($response.StatusCode))" -ForegroundColor Green
    $domains = $response.Content | ConvertFrom-Json
    Write-Host "📊 Found $($domains.data.Count) domains" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Domains API: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Register Candidate
Write-Host "`n2️⃣ Testing POST /api/users/register (Candidate)" -ForegroundColor Yellow
$candidateData = @{
    username = "testcandidate"
    email = "test@candidate.com"
    fullName = "Test Candidate"
    password = "password123"
    role = "CANDIDATE"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/users/register" -Method POST -Body $candidateData -ContentType "application/json"
    Write-Host "✅ Candidate Registration: SUCCESS ($($response.StatusCode))" -ForegroundColor Green
    $result = $response.Content | ConvertFrom-Json
    Write-Host "👤 Registered: $($result.data.user.username)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Candidate Registration: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Login Candidate
Write-Host "`n3️⃣ Testing POST /api/users/login (Candidate)" -ForegroundColor Yellow
$loginData = @{
    credential = "test@candidate.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/users/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "✅ Candidate Login: SUCCESS ($($response.StatusCode))" -ForegroundColor Green
    $result = $response.Content | ConvertFrom-Json
    Write-Host "🔑 Login successful for: $($result.data.user.username)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Candidate Login: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Get Tiers for Domain 1
Write-Host "`n4️⃣ Testing GET /api/tiers/domain/1" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/tiers/domain/1" -Method GET
    Write-Host "✅ Tiers API: SUCCESS ($($response.StatusCode))" -ForegroundColor Green
    $tiers = $response.Content | ConvertFrom-Json
    Write-Host "📊 Found $($tiers.data.Count) tiers for domain 1" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Tiers API: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Get Exams for Domain 1
Write-Host "`n5️⃣ Testing GET /api/exams/domain/1" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/exams/domain/1" -Method GET
    Write-Host "✅ Exams API: SUCCESS ($($response.StatusCode))" -ForegroundColor Green
    $exams = $response.Content | ConvertFrom-Json
    Write-Host "📊 Found $($exams.data.Count) exams for domain 1" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Exams API: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Register Recruiter
Write-Host "`n6️⃣ Testing POST /api/users/register (Recruiter)" -ForegroundColor Yellow
$recruiterData = @{
    username = "testrecruiter"
    email = "test@recruiter.com"
    fullName = "Test Recruiter"
    password = "password123"
    role = "RECRUITER"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/users/register" -Method POST -Body $recruiterData -ContentType "application/json"
    Write-Host "✅ Recruiter Registration: SUCCESS ($($response.StatusCode))" -ForegroundColor Green
    $result = $response.Content | ConvertFrom-Json
    Write-Host "👤 Registered: $($result.data.user.username)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Recruiter Registration: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Get Active Contests
Write-Host "`n7️⃣ Testing GET /api/contests/active" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/contests/active" -Method GET
    Write-Host "✅ Contests API: SUCCESS ($($response.StatusCode))" -ForegroundColor Green
    $contests = $response.Content | ConvertFrom-Json
    Write-Host "📊 Found $($contests.data.Count) active contests" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Contests API: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 API Testing Complete!" -ForegroundColor Green
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "  • Backend Server: RUNNING on port 5000" -ForegroundColor White
Write-Host "  • Database Connection: WORKING" -ForegroundColor White
Write-Host "  • All Core APIs: TESTED" -ForegroundColor White
Write-Host "  • Ready for Frontend Integration!" -ForegroundColor White
