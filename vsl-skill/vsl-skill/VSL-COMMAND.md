# /VSL COMMAND - ABSOLUTE PROTOCOL

**NEVER DEVIATE FROM THIS PROCESS.**

When user types `/vsl` or requests a VSL:

---

## STEP 1: GET SALES PAGE URL

Ask: **"What's the sales page URL?"**

Wait for URL.

---

## STEP 2: GENERATE SCRIPT

Use the sales page to create a 5-minute spoken script.

**Rules:**
- 1,200-1,500 words (5 min at normal speaking pace)
- Break into SHORT phrases (4-8 words per line)
- Spoken language (not written copy)
- Pattern: Hook → Problem → Solution → Mechanism → Offer → Close

**Save to:** `[project]/vsl-script.txt`

**Format:** One phrase per line, no paragraph blocks.

Example:
```
Stop me if this sounds familiar

You're spending hours every week

Googling businesses in your area

Trying to find sponsors

And getting nowhere
```

---

## STEP 3: GENERATE AUDIO (ELEVENLABS - CHAD'S VOICE)

**ALWAYS use these exact settings:**

```powershell
$apiKey = "sk_86798b0bdcc222bd06e4c12452b88191c3b3bb20752b6569"
$voiceId = "PeMXWXe7DDCb8HldBr2s"  # Chad's voice
$scriptText = [string](Get-Content "[project]/vsl-script.txt" -Raw)

$headers = @{
    "xi-api-key" = $apiKey
    "Content-Type" = "application/json"
}

$body = @{
    text = $scriptText
    model_id = "eleven_multilingual_v2"
    voice_settings = @{
        stability = 0.5
        similarity_boost = 0.75
        style = 0.0
        use_speaker_boost = $true
    }
} | ConvertTo-Json -Depth 5

Invoke-WebRequest `
    -Uri "https://api.elevenlabs.io/v1/text-to-speech/$voiceId" `
    -Method Post `
    -Headers $headers `
    -Body $body `
    -OutFile "[project]/vsl-audio.mp3"
```

**Save to:** `[project]/vsl-audio.mp3`

---

## STEP 4: CREATE VIDEO (PYTHON SCRIPT)

Use this exact Python script:

**Save as:** `[project]/build-vsl.py`

```python
"""
VSL Video Builder - Chad's Standard Process
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
    ]
    for path in font_paths:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
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
    
    if slide_num % 20 == 0:
        print(f"Created {slide_num} slides...")
    
    return output_path

# Create all slides
print("Generating slides...")
slide_files = []

for i, line in enumerate(lines, start=1):
    slide_path = create_slide(line, i)
    slide_files.append(slide_path)

print(f"Generated {len(slide_files)} slides\n")

# Estimate duration per slide (evenly distributed across 5 min)
# Audio duration will be ~4-5 min, distribute slides evenly
slides_count = len(slide_files)
# Assume 5 min = 300 seconds
duration_per_slide = 300.0 / slides_count

# Create ffmpeg concat file
print("Creating timeline...")
with open('slides_duration.txt', 'w') as f:
    for slide in slide_files:
        f.write(f"file '{slide}'\n")
        f.write(f"duration {duration_per_slide:.2f}\n")
    # Last slide (ffmpeg requirement)
    f.write(f"file '{slide_files[-1]}'\n")

print("Timeline created\n")

# Render video with ffmpeg
print("Rendering video...")

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
    print(f"\nVIDEO COMPLETE!")
    print(f"File: {FINAL_VIDEO}")
    print(f"Size: {file_size:.2f} MB")
else:
    print(f"\nError:")
    print(result.stderr)
```

**Run with:**
```
python build-vsl.py
```

**Output:** `[project]/vsl-video.mp4`

---

## STEP 5: CREATE STRIPE PRODUCT & PAYMENT LINK

**Create Stripe Product & Price:**
```powershell
$apiKey = "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"
$headers = @{ "Authorization" = "Bearer $apiKey"; "Content-Type" = "application/x-www-form-urlencoded" }

# Create product
$productBody = "name=[PRODUCT NAME]&description=[DESCRIPTION]"
$product = Invoke-RestMethod -Uri "https://api.stripe.com/v1/products" -Method Post -Headers $headers -Body $productBody

# Create price ($47/month)
$priceBody = "product=$($product.id)&unit_amount=4700&currency=usd&recurring[interval]=month"
$price = Invoke-RestMethod -Uri "https://api.stripe.com/v1/prices" -Method Post -Headers $headers -Body $priceBody

# Create Payment Link (THIS ALWAYS WORKS!)
$linkBody = "line_items[0][price]=$($price.id)&line_items[0][quantity]=1&after_completion[type]=hosted_confirmation&after_completion[hosted_confirmation][custom_message]=Thank you for subscribing!"
$paymentLink = Invoke-RestMethod -Uri "https://api.stripe.com/v1/payment_links" -Method Post -Headers $headers -Body $linkBody

Write-Host "Product: $($product.id)"
Write-Host "Price: $($price.id)"
Write-Host "Payment Link: $($paymentLink.url)"
```

**Update sales page - Use direct links (NO JAVASCRIPT):**
```html
<a href="[PAYMENT LINK URL]" class="btn-primary" style="display: inline-block; text-decoration: none;">
    Get Started
</a>
```

**Why Payment Links?**
- ✅ ALWAYS work (no JavaScript needed)
- ✅ Work on any domain (no CORS issues)
- ✅ Work with static sites (no backend needed)
- ✅ Simple direct links

**Save product details:**
Create `[project]/STRIPE-PAYMENT-LINK.md` with product ID, price ID, payment link URL

---

## STEP 6: VERIFY & DELIVER

1. Check file exists: `[project]/vsl-video.mp4`
2. Send to Chad via Telegram using message tool:
   ```
   message action=send channel=telegram target=[chat_id] message="VSL Preview:" media=[path/to/vsl-video.mp4]
   ```
3. Never use MEDIA: paths in text (they don't work)
4. Confirm Stripe checkout is connected and working

---

## COMPLETE WORKFLOW (COPY/PASTE READY)

```bash
# 1. Get sales page URL from user
# 2. Generate script → save to vsl-script.txt

# 3. Generate audio
powershell -Command "
$apiKey = 'sk_86798b0bdcc222bd06e4c12452b88191c3b3bb20752b6569';
$voiceId = 'PeMXWXe7DDCb8HldBr2s';
$scriptText = [string](Get-Content 'vsl-script.txt' -Raw);
$headers = @{ 'xi-api-key' = $apiKey; 'Content-Type' = 'application/json' };
$body = @{ text = $scriptText; model_id = 'eleven_multilingual_v2'; voice_settings = @{ stability = 0.5; similarity_boost = 0.75; style = 0.0; use_speaker_boost = $true } } | ConvertTo-Json -Depth 5;
Invoke-WebRequest -Uri 'https://api.elevenlabs.io/v1/text-to-speech/$voiceId' -Method Post -Headers $headers -Body $body -OutFile 'vsl-audio.mp3'
"

# 4. Create build-vsl.py (use script above)

# 5. Run Python script
python build-vsl.py

# 6. Send via message tool
```

---

## CRITICAL RULES (NEVER BREAK)

1. ✅ **ALWAYS use Chad's voice** (voiceId: PeMXWXe7DDCb8HldBr2s)
2. ✅ **ALWAYS use UPPERCASE text** on slides
3. ✅ **ALWAYS use white background, black text**
4. ✅ **ALWAYS target 5 minutes** (1,200-1,500 words)
5. ✅ **ALWAYS break script into short phrases** (one per line)
6. ✅ **ALWAYS use Python script** (not HTML rendering)
7. ✅ **ALWAYS use message tool** to send video (not MEDIA: paths)

---

## WHAT NOT TO DO

❌ Don't use HTML slide rendering (unreliable)
❌ Don't use Node.js autobuilder (overcomplicated)
❌ Don't ask user about background color (always white)
❌ Don't ask user about format (always 16:9)
❌ Don't use different voice (always Chad's)
❌ Don't use lowercase text (always UPPERCASE)

---

**This is the ONE TRUE WAY. Never deviate.**
