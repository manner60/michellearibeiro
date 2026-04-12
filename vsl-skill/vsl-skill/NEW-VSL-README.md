# New-VSL - Bulletproof VSL Automation

**Complete VSL creation in one command.**

## Quick Start

```powershell
# 1. Create your script (one phrase per line)
"Stop me if this sounds familiar" | Out-File vsl-script.txt
"You're spending hours every week" | Add-Content vsl-script.txt
"Trying to find local sponsors" | Add-Content vsl-script.txt
# ... etc

# 2. Run the automation
.\New-VSL.ps1 -ProductName "My Product" -Price 47

# Done! Video created + Stripe payment link generated
```

## What It Does

This script automates the entire VSL creation workflow from VSL-COMMAND.md:

1. ✅ **Validates script** (checks word count for 5-minute target)
2. ✅ **Generates audio** with ElevenLabs (Chad's voice)
3. ✅ **Creates text slides** (white bg, black UPPERCASE text)
4. ✅ **Renders video** with Python + FFmpeg
5. ✅ **Creates Stripe product** + payment link
6. ✅ **Saves all details** for deployment

**Total time:** ~2-3 minutes (audio generation + video rendering)

## Parameters

### Required
- **Script file:** Must exist as `vsl-script.txt` in project folder

### Optional
```powershell
-ProductName "Product Name"       # For Stripe product creation
-ProductDescription "Description" # Stripe product description
-Price 47                         # Price in dollars (default: $47/month)
-ProjectFolder "path/to/folder"   # Where to save files (default: current dir)
-SkipStripe                       # Skip Stripe product creation
-ScriptFile "path/to/script.txt"  # Use existing script from different location
```

## Examples

### Basic Usage (No Stripe)
```powershell
# Just create video from existing script
.\New-VSL.ps1 -SkipStripe
```

### Full Product Setup
```powershell
# Create video + Stripe product + payment link
.\New-VSL.ps1 -ProductName "Newsletter Sponsor Finder" -ProductDescription "Find local sponsors for your newsletter" -Price 47
```

### Custom Project Folder
```powershell
# Save everything to specific folder
.\New-VSL.ps1 -ProjectFolder "C:\projects\my-vsl" -ProductName "My Product" -Price 97
```

### Use Existing Script from Elsewhere
```powershell
# Copy script from another location and use it
.\New-VSL.ps1 -ScriptFile "C:\scripts\my-vsl-script.txt" -ProductName "Product" -Price 47
```

## Output Files

After running, you'll have:

```
project-folder/
├── vsl-script.txt              # Your script (input)
├── vsl-audio.mp3               # Generated audio (~5min)
├── vsl-video.mp4               # Final video (ready to embed)
├── build-vsl.py                # Python script used for rendering
├── STRIPE-PAYMENT-LINK.md      # Stripe details (if created)
├── slide_images/               # Individual slide PNGs
└── slides_duration.txt         # FFmpeg timeline file
```

## Requirements

### Software
- ✅ **PowerShell** 5.1+ (built-in on Windows)
- ✅ **Python** 3.8+ with PIL (Pillow)
- ✅ **FFmpeg** (video encoding)

### API Keys (Already Configured)
- ✅ ElevenLabs (Chad's voice)
- ✅ Stripe (product creation)

### Install Python Dependencies
```bash
pip install pillow
```

### Install FFmpeg
**Windows:**
```powershell
winget install Gyan.FFmpeg
```

**Mac:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt install ffmpeg
```

## Script Format

Your `vsl-script.txt` should have **one phrase per line**:

✅ **Good:**
```
Stop me if this sounds familiar
You're spending hours every week
Googling businesses in your area
Trying to find sponsors
And getting nowhere
```

❌ **Bad:**
```
Stop me if this sounds familiar. You're spending hours every week. Googling businesses in your area.
```

**Target length:** 1,200-1,500 words (5 minutes)

## How It Works

### Step 1: Script Validation
- Checks if script exists
- Counts words
- Warns if too short/long for 5-minute target

### Step 2: Audio Generation
- Sends script to ElevenLabs API
- Uses Chad's voice (ID: PeMXWXe7DDCb8HldBr2s)
- Settings: stability 0.5, similarity 0.75
- Saves as `vsl-audio.mp3`

### Step 3: Python Script Creation
- Generates `build-vsl.py` with exact protocol
- White background, black text
- UPPERCASE text (always)
- Auto-sizing based on word count
- Centered, word-wrapped

### Step 4: Video Rendering
- Creates PNG slide for each phrase
- Calculates slide duration (evenly distributed across audio length)
- Combines with FFmpeg
- Output: H.264 MP4 (web-optimized)

### Step 5: Stripe Product (Optional)
- Creates Stripe product
- Creates recurring price ($X/month)
- Generates payment link (always works, no JavaScript)
- Saves details to markdown file

## Error Handling

The script validates each step:

- ❌ **No script found** → Clear instructions on what to do
- ❌ **Audio generation fails** → Shows ElevenLabs error
- ❌ **Video rendering fails** → Shows Python/FFmpeg error
- ❌ **Stripe fails** → Video still saved (Stripe is optional)

## Embedding Video

### On Sales Page
```html
<video width="100%" controls>
  <source src="vsl-video.mp4" type="video/mp4">
  Your browser does not support video.
</video>
```

### With Stripe Payment Link
```html
<video width="100%" controls>
  <source src="vsl-video.mp4" type="video/mp4">
</video>

<a href="[PAYMENT LINK FROM STRIPE-PAYMENT-LINK.md]" class="btn-primary">
  Get Started
</a>
```

## Stripe Payment Links vs JavaScript Checkout

**✅ Use Payment Links (What This Script Creates):**
- Work on any domain (no CORS issues)
- Work with static sites (no backend)
- Simple direct links
- Always reliable

**❌ Don't Use JavaScript Checkout:**
- Requires backend
- CORS complications
- Domain verification needed
- More complex

## Troubleshooting

### "Python not found"
Install Python 3.8+, add to PATH, restart PowerShell

### "ffmpeg not found"
Install FFmpeg (see Requirements section)

### "PIL/Pillow not found"
```bash
pip install pillow
```

### "Audio generation timeout"
ElevenLabs can be slow with long scripts. Wait 30-60 seconds.

### Video quality issues
Script uses CRF 23 (high quality). Lower number = higher quality, larger file.

### Slides don't match audio timing
Script auto-detects audio duration with ffprobe. If missing, assumes 300s.

## Advanced Usage

### Change Video Settings
Edit the Python script section in `New-VSL.ps1`:
- `WIDTH / HEIGHT` - Resolution
- `BG_COLOR` - Background color (currently white)
- `TEXT_COLOR` - Text color (currently black)
- Font sizes in `get_font_size()` function

### Use Test Stripe Keys
Replace `$STRIPE_API_KEY` with test key (`sk_test_...`)

### Skip Audio Regeneration
If `vsl-audio.mp3` already exists, delete it and re-run to force new audio generation.

## Integration with /vsl Command

This script is the **engine** for the `/vsl` command. When Chad types `/vsl`:

1. OpenClaw generates the script
2. Saves to `vsl-script.txt`
3. Calls `New-VSL.ps1` with appropriate parameters
4. Sends finished video via Telegram

## Why This Works Better

**Old method (HTML → PNG):**
- ❌ Chrome headless unreliable on Windows
- ❌ Node.js autobuilder overcomplicated
- ❌ HTML rendering issues

**New method (Python PIL):**
- ✅ Direct PNG generation (no browser)
- ✅ Simple, fast, predictable
- ✅ Works on any OS
- ✅ No JavaScript dependencies

## Performance

**Typical timing:**
- Script validation: < 1 second
- Audio generation: 10-30 seconds
- Slide creation: 5-10 seconds (108 slides)
- Video encoding: 30-60 seconds
- Stripe setup: 2-3 seconds
- **Total: 1-2 minutes**

## Support

If something breaks:
1. Check error message
2. Verify requirements (Python, FFmpeg)
3. Try with `-SkipStripe` to isolate issue
4. Check `vsl-script.txt` format (one phrase per line)

## Credits

Protocol follows `VSL-COMMAND.md` exactly:
- Chad's voice (ElevenLabs)
- White bg, black UPPERCASE text
- 5-minute target (1,200-1,500 words)
- Python PIL rendering
- Stripe payment links

---

**Ready to use!** Just create your script and run:
```powershell
.\New-VSL.ps1 -ProductName "Your Product" -Price 47
```
