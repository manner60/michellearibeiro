# PopLinks API Test Harness
# Run these commands to verify API understanding

$apiKey = "YOUR_API_KEY_HERE"
$baseUrl = "https://api.poplinks.io/api/ai"
$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Content-Type" = "application/json"
}

Write-Host "=== PopLinks API Test Harness ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: List PopLinks
Write-Host "TEST 1: List PopLinks" -ForegroundColor Yellow
Write-Host "Endpoint: GET /poplinks"
Write-Host "Request: Invoke-RestMethod -Uri '$baseUrl/poplinks' -Headers @{Authorization='Bearer ***'}"
Write-Host "Expected Response: { success: true, data: { poplinks: [...] } }"
try {
    $result = Invoke-RestMethod -Uri "$baseUrl/poplinks" -Headers $headers
    Write-Host "Result: SUCCESS - Found $($result.data.poplinks.Count) poplinks" -ForegroundColor Green
} catch {
    Write-Host "Result: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Create PopLink (dry run - just show what would be sent)
Write-Host "TEST 2: Create PopLink (DRY RUN)" -ForegroundColor Yellow
Write-Host "Endpoint: POST /poplinks"
$createBody = @{
    name = "Test Link - API Harness"
    destination_url = "https://example.com"
    domain_type = "personal"
    domain_id = 1638
    visible_url = "test-harness-$(Get-Random -Maximum 9999)"
    status = 1
} | ConvertTo-Json
Write-Host "Request Body:"
Write-Host $createBody
Write-Host "Expected Response: { success: true, data: { poplink: { id: X, name: '...', ... } } }"
Write-Host "(Skipping actual creation to avoid creating test data)" -ForegroundColor Gray
Write-Host ""

# Test 3: Get PopLink Clicks
Write-Host "TEST 3: Get PopLink Clicks" -ForegroundColor Yellow
Write-Host "Endpoint: GET /poplinks/:id/clicks?page=1"
try {
    $poplinks = Invoke-RestMethod -Uri "$baseUrl/poplinks" -Headers $headers
    $firstId = $poplinks.data.poplinks[0].id
    Write-Host "Request: GET /poplinks/$firstId/clicks?page=1"
    $clicks = Invoke-RestMethod -Uri "$baseUrl/poplinks/$firstId/clicks?page=1" -Headers $headers
    Write-Host "Result: SUCCESS - Retrieved click data" -ForegroundColor Green
} catch {
    Write-Host "Result: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: List Lead Pages
Write-Host "TEST 4: List Lead Pages" -ForegroundColor Yellow
Write-Host "Endpoint: GET /lead-pages"
Write-Host "Request: Invoke-RestMethod -Uri '$baseUrl/lead-pages' -Headers @{Authorization='Bearer ***'}"
try {
    $result = Invoke-RestMethod -Uri "$baseUrl/lead-pages" -Headers $headers
    Write-Host "Result: SUCCESS - Found $($result.data.lead_pages.Count) lead pages" -ForegroundColor Green
} catch {
    Write-Host "Result: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: List Bridge Pages
Write-Host "TEST 5: List Bridge Pages" -ForegroundColor Yellow
Write-Host "Endpoint: GET /bridge-pages"
Write-Host "Request: Invoke-RestMethod -Uri '$baseUrl/bridge-pages' -Headers @{Authorization='Bearer ***'}"
try {
    $result = Invoke-RestMethod -Uri "$baseUrl/bridge-pages" -Headers $headers
    Write-Host "Result: SUCCESS - Found $($result.data.bridge_pages.Count) bridge pages" -ForegroundColor Green
} catch {
    Write-Host "Result: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 6 (Bonus): Get Ad Campaign Insights
Write-Host "TEST 6: Get Ad Campaign Insights (yesterday)" -ForegroundColor Yellow
Write-Host "Endpoint: GET /ad-stats/campaigns/118/insights?date_range=yesterday"
try {
    $result = Invoke-RestMethod -Uri "$baseUrl/ad-stats/campaigns/118/insights?date_range=yesterday" -Headers $headers
    Write-Host "Result: SUCCESS - Spend: `$$($result.data.totals.spend), Clicks: $($result.data.totals.clicks)" -ForegroundColor Green
} catch {
    Write-Host "Result: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "=== Test Harness Complete ===" -ForegroundColor Cyan
