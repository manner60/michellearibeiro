# New-VSL - Complete VSL Creation Pipeline
# Bulletproof automation following VSL-COMMAND.md protocol

<#
.SYNOPSIS
Create complete VSL (script → audio → video) in one command

.DESCRIPTION
Automates the entire VSL creation process:
1. Generates script from sales page
2. Creates audio with ElevenLabs (Chad's voice)
3. Renders video with Python (text slides + audio)
4. Creates Stripe product + payment link
5. Outputs video file ready for embedding

.PARAMETER SalesPageUrl
URL of the sales page to generate VSL from

.PARAMETER ProductName
Name for the product (used in Stripe)

.PARAMETER ProductDescription
Description for Stripe product

.PARAMETER Price
Price in dollars (e.g., 47 for $47/month)

.PARAMETER ProjectFolder
Folder to save all files (defaults to current directory)

.PARAMETER SkipStripe
Skip Stripe product creation

.EXAMPLE
New-VSL -SalesPageUrl "https://example.com/sales" -ProductName "My Product" -Price 47

.NOTES
All settings follow VSL-COMMAND.md protocol:
- Chad's voice ID: PeMXWXe7DDCb8HldBr2s
- White background, black UPPERCASE text
- Target 5 minutes (1,200-1,500 words)
- Python rendering (reliable)
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$SalesPageUrl,
    
    [Parameter(Mandatory=$false)]
    [string]$ProductName,
    
    [Parameter(Mandatory=$false)]
    [string]$ProductDescription,
    
    [Parameter(Mandatory=$false)]
    [int]$Price = 47,
    
    [Parameter(Mandatory=$false)]
    [string]$ProjectFolder = ".",
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipStripe,
    
    [Parameter(Mandatory=$false)]
    [string]$ScriptFile  # If you already have a script, skip generation
)

# Configuration
$ELEVENLABS_API_KEY = "sk_86798b0bdcc222bd06e4c12452b88191c3b3bb20752b6569"
$CHAD_VOICE_ID = "PeMXWXe7DDCb8HldBr2s"
$STRIPE_API_KEY = "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"

# File paths
$scriptPath = Join-Path $ProjectFolder "vsl-script.txt"
$audioPath = Join-Path $ProjectFolder "vsl-audio.mp3"
$pythonScriptPath = Join-Path $ProjectFolder "build-vsl.py"
$videoPath = Join-Path $ProjectFolder "vsl-video.mp4"
$stripeDetailsPath = Join-Path $ProjectFolder "STRIPE-PAYMENT-LINK.md"

# Ensure project folder exists
if (!(Test-Path $ProjectFolder)) {
    New-Item -ItemType Directory -Path $ProjectFolder | Out-Null
}

Write-Host "`n🎬 VSL Creation Pipeline" -ForegroundColor Cyan
Write-Host "========================`n" -ForegroundColor Cyan

# ===================
# STEP 1: GET SCRIPT
# ===================

if ($ScriptFile -and (Test-Path $ScriptFile)) {
    Write-Host "✓ Using existing script: $ScriptFile" -ForegroundColor Green
    Copy-Item $ScriptFile $scriptPath
} elseif (Test-Path $scriptPath) {
    Write-Host "✓ Using existing script: $scriptPath" -ForegroundColor Green
} else {
    Write-Host "❌ No script found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Yellow
    Write-Host "1. Create $scriptPath manually (one phrase per line)"
    Write-Host "2. Run: New-VSL -ScriptFile 'path/to/script.txt'"
    Write-Host "3. Generate script with OpenClaw and save to $scriptPath"
    Write-Host ""
    Write-Host "Script format (example):" -ForegroundColor Gray
    Write-Host "  Stop me if this sounds familiar" -ForegroundColor Gray
    Write-Host "  You're spending hours every week" -ForegroundColor Gray
    Write-Host "  Googling businesses in your area" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

# Validate script
$script = Get-Content $scriptPath -Raw
$wordCount = ($script -split '\s+').Count

Write-Host "📝 Script loaded: $wordCount words" -ForegroundColor White

if ($wordCount -lt 1000) {
    Write-Host "⚠️  Warning: Script is short (< 1000 words). Target is 1,200-1,500 for 5 minutes." -ForegroundColor Yellow
} elseif ($wordCount -gt 1700) {
    Write-Host "⚠️  Warning: Script is long (> 1700 words). May exceed 5 minutes." -ForegroundColor Yellow
}

# ===================
# STEP 2: GENERATE AUDIO
# ===================

Write-Host "`n🎙️  Generating audio (ElevenLabs - Chad's voice)..." -ForegroundColor Cyan

$headers = @{
    "xi-api-key" = $ELEVENLABS_API_KEY
    "Content-Type" = "application/json"
}

$body = @{
    text = $script
    model_id = "eleven_multilingual_v2"
    voice_settings = @{
        stability = 0.5
        similarity_boost = 0.75
        style = 0.0
        use_speaker_boost = $true
    }
} | ConvertTo-Json -Depth 5

try {
    Invoke-WebRequest `
        -Uri "https://api.elevenlabs.io/v1/text-to-speech/$CHAD_VOICE_ID" `
        -Method Post `
        -Headers $headers `
        -Body $body `
        -OutFile $audioPath
    
    $audioSize = (Get-Item $audioPath).Length / 1MB
    Write-Host "✓ Audio generated: $([math]::Round($audioSize, 2)) MB" -ForegroundColor Green
    
    # Get audio duration (using ffprobe if available)
    try {
        $durationInfo = ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $audioPath 2>$null
        $duration = [math]::Round([double]$durationInfo)
        Write-Host "✓ Duration: $duration seconds" -ForegroundColor Green
    } catch {
        Write-Host "  (Duration check requires ffprobe)" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "❌ Audio generation failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# ===================
# STEP 3: CREATE PYTHON SCRIPT
# ===================

Write-Host "`n🐍 Creating Python video builder..." -ForegroundColor Cyan

$pythonScript = @'
"""
VSL Video Builder - Chad's Standard Process
Follows VSL-COMMAND.md protocol exactly
"""

import json
import os
import subprocess
from PIL import Image, ImageDraw, ImageFont

# Config
WIDTH = 1920
HEIGHT = 1080
BG_COLOR = (255, 255, 255)  # White
TEXT_COLOR = (0, 0, 0)  # Black
OUTPUT_DIR = "slide_images"
AUDIO_PATH = "vsl-audio.mp3"
SCRIPT_PATH = "vsl-script.txt"
FINAL_VIDEO = "vsl-video.mp4"

# Create output directory
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Load script and break into slides
with open(SCRIPT_PATH, 'r', encoding='utf-8') as f:
    lines = [line.strip() for line in f.readlines() if line.strip()]

print(f"Loaded {len(lines)} slide phrases")

# Font setup
def get_font(size):
    font_paths = [
        "C:/Windows/Fonts/arialbd.ttf",
        "C:/Windows/Fonts/segoeuib.ttf",
        "C:/Windows/Fonts/ariblk.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ]
    for path in font_paths:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    print("Warning: Using default font (bold fonts not found)")
    return ImageFont.load_default()

# Calculate font size based on word count
def get_font_size(word_count):
    if word_count <= 4:
        return 140
    elif word_count <= 8:
        return 100
    elif word_count <= 14:
        return 72
    else:
        return 55

# Generate slide image
def create_slide(text, slide_num):
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    # ALWAYS USE UPPERCASE
    text = text.upper()
    
    word_count = len(text.split())
    font_size = get_font_size(word_count)
    font = get_font(font_size)
    
    # Word wrap
    max_width = WIDTH - 300
    lines = []
    words_list = text.split()
    current_line = ""
    
    for word in words_list:
        test_line = current_line + " " + word if current_line else word
        bbox = draw.textbbox((0, 0), test_line, font=font)
        line_width = bbox[2] - bbox[0]
        
        if line_width <= max_width:
            current_line = test_line
        else:
            if current_line:
                lines.append(current_line)
            current_line = word
    
    if current_line:
        lines.append(current_line)
    
    # Center vertically
    line_height = font_size + 20
    total_height = len(lines) * line_height
    start_y = (HEIGHT - total_height) // 2
    
    # Draw centered text
    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=font)
        line_width = bbox[2] - bbox[0]
        x = (WIDTH - line_width) // 2
        y = start_y + (i * line_height)
        draw.text((x, y), line, font=font, fill=TEXT_COLOR)
    
    output_path = f"{OUTPUT_DIR}/slide_{slide_num:03d}.png"
    img.save(output_path)
    
    if slide_num % 20 == 0 or slide_num == len(lines):
        print(f"Created {slide_num}/{len(lines)} slides...")
    
    return output_path

# Create all slides
print("\nGenerating slides...")
slide_files = []

for i, line in enumerate(lines, start=1):
    slide_path = create_slide(line, i)
    slide_files.append(slide_path)

print(f"✓ Generated {len(slide_files)} slides\n")

# Calculate duration per slide (evenly distributed)
slides_count = len(slide_files)

# Get actual audio duration
try:
    result = subprocess.run(
        ['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
         '-of', 'default=noprint_wrappers=1:nokey=1', AUDIO_PATH],
        capture_output=True, text=True, check=True
    )
    audio_duration = float(result.stdout.strip())
    print(f"Audio duration: {audio_duration:.1f} seconds")
except:
    # Fallback to 5 minutes if ffprobe fails
    audio_duration = 300.0
    print("Warning: Could not detect audio duration, using 300s")

duration_per_slide = audio_duration / slides_count

# Create ffmpeg concat file
print("Creating timeline...")
with open('slides_duration.txt', 'w') as f:
    for slide in slide_files:
        f.write(f"file '{slide}'\n")
        f.write(f"duration {duration_per_slide:.3f}\n")
    # Last slide (ffmpeg requirement)
    f.write(f"file '{slide_files[-1]}'\n")

print("✓ Timeline created\n")

# Render video with ffmpeg
print("Rendering video (this may take 1-2 minutes)...")

cmd = [
    'ffmpeg', '-y',
    '-f', 'concat',
    '-safe', '0',
    '-i', 'slides_duration.txt',
    '-i', AUDIO_PATH,
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-pix_fmt', 'yuv420p',
    '-preset', 'medium',
    '-crf', '23',
    '-b:a', '192k',
    '-shortest',
    FINAL_VIDEO
]

result = subprocess.run(cmd, capture_output=True, text=True)

if result.returncode == 0:
    file_size = os.path.getsize(FINAL_VIDEO) / (1024 * 1024)
    print(f"\n✓ VIDEO COMPLETE!")
    print(f"  File: {FINAL_VIDEO}")
    print(f"  Size: {file_size:.2f} MB")
    print(f"  Slides: {len(slide_files)}")
    print(f"  Duration: ~{audio_duration:.0f}s")
else:
    print(f"\n❌ Error rendering video:")
    print(result.stderr)
    exit(1)
'@

$pythonScript | Set-Content $pythonScriptPath -Encoding UTF8
Write-Host "✓ Python script created" -ForegroundColor Green

# ===================
# STEP 4: RUN PYTHON (RENDER VIDEO)
# ===================

Write-Host "`n🎥 Rendering video..." -ForegroundColor Cyan
Write-Host "   (This takes 1-2 minutes - generating slides + encoding video)`n" -ForegroundColor Gray

Push-Location $ProjectFolder

try {
    $output = python build-vsl.py 2>&1
    $output | ForEach-Object { Write-Host $_ -ForegroundColor White }
    
    if (Test-Path $videoPath) {
        $videoSize = (Get-Item $videoPath).Length / 1MB
        Write-Host "`n✓ Video rendered: $([math]::Round($videoSize, 2)) MB" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Video file not created!" -ForegroundColor Red
        Pop-Location
        exit 1
    }
} catch {
    Write-Host "`n❌ Video rendering failed: $($_.Exception.Message)" -ForegroundColor Red
    Pop-Location
    exit 1
}

Pop-Location

# ===================
# STEP 5: STRIPE (OPTIONAL)
# ===================

if (!$SkipStripe -and $ProductName) {
    Write-Host "`n💳 Creating Stripe product..." -ForegroundColor Cyan
    
    $stripeHeaders = @{
        "Authorization" = "Bearer $STRIPE_API_KEY"
        "Content-Type" = "application/x-www-form-urlencoded"
    }
    
    try {
        # Create product
        $productBody = "name=$([uri]::EscapeDataString($ProductName))"
        if ($ProductDescription) {
            $productBody += "&description=$([uri]::EscapeDataString($ProductDescription))"
        }
        
        $product = Invoke-RestMethod -Uri "https://api.stripe.com/v1/products" -Method Post -Headers $stripeHeaders -Body $productBody
        Write-Host "✓ Product created: $($product.id)" -ForegroundColor Green
        
        # Create price
        $priceBody = "product=$($product.id)&unit_amount=$($Price * 100)&currency=usd&recurring[interval]=month"
        $priceObj = Invoke-RestMethod -Uri "https://api.stripe.com/v1/prices" -Method Post -Headers $stripeHeaders -Body $priceBody
        Write-Host "✓ Price created: `$$Price/month ($($priceObj.id))" -ForegroundColor Green
        
        # Create Payment Link
        $linkBody = "line_items[0][price]=$($priceObj.id)&line_items[0][quantity]=1&after_completion[type]=hosted_confirmation&after_completion[hosted_confirmation][custom_message]=Thank you for subscribing!"
        $paymentLink = Invoke-RestMethod -Uri "https://api.stripe.com/v1/payment_links" -Method Post -Headers $stripeHeaders -Body $linkBody
        Write-Host "✓ Payment link created" -ForegroundColor Green
        
        # Save details
        $stripeDetails = @"
# Stripe Product Details

**Product:** $ProductName
**Price:** `$$Price/month

## IDs
- **Product ID:** $($product.id)
- **Price ID:** $($priceObj.id)

## Payment Link
$($paymentLink.url)

## HTML for Sales Page

Use this direct link (NO JAVASCRIPT):

``````html
<a href="$($paymentLink.url)" class="btn-primary" style="display: inline-block; text-decoration: none;">
    Get Started
</a>
``````

## Why Payment Links?
- ✅ Work on any domain (no CORS)
- ✅ Work with static sites (no backend)
- ✅ Simple direct links
- ✅ Always reliable

Created: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
"@
        
        $stripeDetails | Set-Content $stripeDetailsPath -Encoding UTF8
        Write-Host "✓ Details saved: $stripeDetailsPath" -ForegroundColor Green
        
        Write-Host "`nPayment Link: $($paymentLink.url)" -ForegroundColor Cyan
        
    } catch {
        Write-Host "❌ Stripe setup failed: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "   (Video still created successfully)" -ForegroundColor Yellow
    }
} elseif (!$SkipStripe) {
    Write-Host "`n⏭️  Skipping Stripe (no product name provided)" -ForegroundColor Yellow
    Write-Host "   Run with -ProductName to create Stripe product + payment link" -ForegroundColor Gray
}

# ===================
# SUMMARY
# ===================

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "✓ VSL CREATION COMPLETE!" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "📁 Output Files:" -ForegroundColor White
Write-Host "   Script:  $scriptPath" -ForegroundColor Gray
Write-Host "   Audio:   $audioPath" -ForegroundColor Gray
Write-Host "   Video:   $videoPath" -ForegroundColor Gray

if (!$SkipStripe -and $ProductName) {
    Write-Host "   Stripe:  $stripeDetailsPath" -ForegroundColor Gray
}

Write-Host "`n📺 Next Steps:" -ForegroundColor White
Write-Host "   1. Review video: $videoPath" -ForegroundColor Gray
Write-Host "   2. Embed on sales page (use <video> tag)" -ForegroundColor Gray

if (!$SkipStripe -and $ProductName) {
    Write-Host "   3. Add payment link to page (see $stripeDetailsPath)" -ForegroundColor Gray
}

Write-Host ""
