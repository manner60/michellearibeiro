# PopLinks Manager - Setup Wizard (PowerShell)
# Guides user through credential setup with API validation

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "PopLinks Manager - Setup Wizard" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This wizard will help you set up your PopLinks API credentials." -ForegroundColor White
Write-Host ""
Write-Host "💡 Tip: Keep your PopLinks/MintBird dashboard open for reference." -ForegroundColor Yellow
Write-Host ""

# Step 1: API Token
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Step 1: API Token" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Get your API token from:" -ForegroundColor White
Write-Host "   PopLinks/MintBird Dashboard → Settings → API Access" -ForegroundColor Gray
Write-Host ""

$API_TOKEN = Read-Host "Enter your API Token"

if ([string]::IsNullOrWhiteSpace($API_TOKEN)) {
    Write-Host ""
    Write-Host "❌ API Token is required. Exiting." -ForegroundColor Red
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "✅ Token saved (${API_TOKEN.Substring(0, [Math]::Min(10, $API_TOKEN.Length))}...)" -ForegroundColor Green

# Test API connection
Write-Host ""
Write-Host "🔗 Testing API connection..." -ForegroundColor Yellow

try {
    $testResponse = Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/me" `
        -Headers @{"Authorization"="Bearer $API_TOKEN"} `
        -TimeoutSec 10
    
    Write-Host "✅ API connection successful!" -ForegroundColor Green
    
    if ($testResponse.data.email) {
        Write-Host "   Account: $($testResponse.data.email)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ API connection failed!" -ForegroundColor Red
    Write-Host "   Your token may be invalid or expired." -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    
    if ($continue -ne "y" -and $continue -ne "yes") {
        Write-Host ""
        Write-Host "Setup cancelled." -ForegroundColor Yellow
        Write-Host ""
        exit 1
    }
}

# Step 2: Domain ID
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Step 2: Domain ID" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Fetching your domains..." -ForegroundColor Yellow

try {
    $domainsResponse = Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/domains" `
        -Headers @{"Authorization"="Bearer $API_TOKEN"} `
        -TimeoutSec 10
    
    Write-Host ""
    Write-Host "Your domains:" -ForegroundColor White
    
    foreach ($domain in $domainsResponse.data) {
        $status = if ($domain.status -eq "active") { "✅" } else { "⚠️ " }
        Write-Host "   $status ID: $($domain.id) - $($domain.domain)" -ForegroundColor Gray
    }
    
    Write-Host ""
} catch {
    Write-Host "⚠️  Failed to fetch domains. You'll need to find this manually." -ForegroundColor Yellow
    Write-Host ""
}

$DOMAIN_ID = Read-Host "Enter your default Domain ID"

if ([string]::IsNullOrWhiteSpace($DOMAIN_ID)) {
    Write-Host ""
    Write-Host "❌ Domain ID is required. Exiting." -ForegroundColor Red
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "✅ Domain ID: $DOMAIN_ID" -ForegroundColor Green

# Step 3: Category ID (optional)
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Step 3: Category ID (Optional)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Fetching your categories..." -ForegroundColor Yellow

try {
    $categoriesResponse = Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/categories?type=2" `
        -Headers @{"Authorization"="Bearer $API_TOKEN"} `
        -TimeoutSec 10
    
    Write-Host ""
    
    if ($categoriesResponse.data.Count -gt 0) {
        Write-Host "Your categories:" -ForegroundColor White
        
        foreach ($category in $categoriesResponse.data) {
            Write-Host "   ID: $($category.id) - $($category.name)" -ForegroundColor Gray
        }
        
        Write-Host ""
    } else {
        Write-Host "No categories found. You can skip this." -ForegroundColor Gray
        Write-Host ""
    }
} catch {
    Write-Host "⚠️  Failed to fetch categories." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "💡 Press Enter to skip if you don't use categories." -ForegroundColor Yellow
Write-Host ""
$CATEGORY_ID = Read-Host "Enter your default Category ID (optional)"

if ([string]::IsNullOrWhiteSpace($CATEGORY_ID)) {
    $CATEGORY_ID = "null"
    Write-Host ""
    Write-Host "⏭️  Skipping category ID" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "✅ Category ID: $CATEGORY_ID" -ForegroundColor Green
}

# Create credentials file
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Saving Credentials" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:sszzz"
$credContent = @"
# PopLinks API Credentials
# Generated: $timestamp

API_TOKEN=$API_TOKEN
DEFAULT_DOMAIN_ID=$DOMAIN_ID
DEFAULT_CATEGORY_ID=$CATEGORY_ID
DEFAULT_LEADPAGE_TEMPLATE=5
DEFAULT_BRIDGEPAGE_TEMPLATE=3
"@

$credPath = "..\..\credentials\poplinks-api.txt"
$credDir = Split-Path -Parent $credPath

# Create credentials directory if it doesn't exist
if (-not (Test-Path $credDir)) {
    New-Item -ItemType Directory -Force -Path $credDir | Out-Null
}

# Write credentials file
$credContent | Out-File -FilePath $credPath -Encoding UTF8 -Force

Write-Host "✅ Credentials saved to: $credPath" -ForegroundColor Green

# Security reminder
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🔒 Security Reminder" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  NEVER commit credentials to git" -ForegroundColor Yellow
Write-Host "⚠️  NEVER share your API token publicly" -ForegroundColor Yellow
Write-Host "✅ Your credentials folder is already in .gitignore" -ForegroundColor Green
Write-Host ""

# Next steps
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🚀 Setup Complete!" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now use PopLinks Manager commands:" -ForegroundColor White
Write-Host ""
Write-Host "   📋 List PopLinks:" -ForegroundColor Gray
Write-Host "      node example-commands.js list-poplinks" -ForegroundColor Gray
Write-Host ""
Write-Host "   📋 List Bridge Pages:" -ForegroundColor Gray
Write-Host "      node example-commands.js list-bridges" -ForegroundColor Gray
Write-Host ""
Write-Host "   ✨ Create PopLink:" -ForegroundColor Gray
Write-Host '      node example-commands.js create-poplink "Name" "https://url.com" "slug"' -ForegroundColor Gray
Write-Host ""
Write-Host "📖 For more commands, see:" -ForegroundColor White
Write-Host "   • QUICK_REFERENCE.md - Common tasks" -ForegroundColor Gray
Write-Host "   • EXAMPLES.md - Real-world workflows" -ForegroundColor Gray
Write-Host "   • SKILL.md - Complete API reference" -ForegroundColor Gray
Write-Host ""
Write-Host "Happy automating! 🎬" -ForegroundColor Cyan
Write-Host ""
