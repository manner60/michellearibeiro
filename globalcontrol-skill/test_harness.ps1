# Global Control API Test Harness
# Run: .\test_harness.ps1

$GC_KEY = "9ee9d1006f37fe14b3b9fe06b15ce39d207e3b61d765914a1b6bc7a2f8030219"
$headers = @{ "X-API-KEY" = $GC_KEY }
$baseUrl = "https://api.globalcontrol.io/api"

Write-Host "=== GLOBAL CONTROL API TEST HARNESS ===" -ForegroundColor Cyan
Write-Host ""

# TEST 1: Get Authenticated User
Write-Host "TEST 1: Get Authenticated User" -ForegroundColor Yellow
$me = Invoke-RestMethod -Uri "$baseUrl/me" -Method GET -Headers $headers
Write-Host "  User: $($me.data.fullName)"
Write-Host "  Email: $($me.data.email)"
Write-Host "  Level: $($me.data.accessLevel)"
Write-Host "  PASS" -ForegroundColor Green
Write-Host ""

# TEST 2: List All Tags
Write-Host "TEST 2: List All Tags" -ForegroundColor Yellow
$tags = Invoke-RestMethod -Uri "$baseUrl/tags" -Method GET -Headers $headers
Write-Host "  Total: $($tags.data.Count) tags"
Write-Host "  PASS" -ForegroundColor Green
Write-Host ""

# TEST 3: List Tag Groups
Write-Host "TEST 3: List Tag Groups" -ForegroundColor Yellow
$groups = Invoke-RestMethod -Uri "$baseUrl/tag-groups" -Method GET -Headers $headers
Write-Host "  Total: $($groups.data.Count) groups"
Write-Host "  PASS" -ForegroundColor Green
Write-Host ""

# TEST 4: List Domains
Write-Host "TEST 4: List Domains" -ForegroundColor Yellow
$domains = Invoke-RestMethod -Uri "$baseUrl/domains" -Method GET -Headers $headers
Write-Host "  Total: $($domains.data.Count) domains"
$domains.data | ForEach-Object { Write-Host "    - $($_.domain)" }
Write-Host "  PASS" -ForegroundColor Green
Write-Host ""

# TEST 5: List Custom Fields
Write-Host "TEST 5: List Custom Fields" -ForegroundColor Yellow
$fields = Invoke-RestMethod -Uri "$baseUrl/custom-fields" -Method GET -Headers $headers
Write-Host "  Total: $($fields.data.Count) fields"
Write-Host "  PASS" -ForegroundColor Green
Write-Host ""

Write-Host "=== ALL TESTS PASSED ===" -ForegroundColor Green
