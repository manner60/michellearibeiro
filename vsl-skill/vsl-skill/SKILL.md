# Video Sales Letter (VSL) Skill

**Command:** `/vsl`

**CRITICAL:** Read `VSL-COMMAND.md` for the ABSOLUTE PROTOCOL. Never deviate.

---

## Quick Reference

**When user types `/vsl`:**
1. Get sales page URL
2. Generate 5-min script (short phrases, one per line)
3. Generate audio with Chad's ElevenLabs voice (ALWAYS voiceId: PeMXWXe7DDCb8HldBr2s)
4. Run Python script to create video (UPPERCASE slides, white bg, black text)
5. Send video via message tool

**Read full protocol:** `VSL-COMMAND.md`

---

## What This Skill Does

Turns a sales page into a professional video sales letter:

1. **Script Generation** - Analyzes sales page, writes spoken-language script
2. **Voice Synthesis** - Generates narration with Chad's voice (ElevenLabs)
3. **Slide Design** - Creates UPPERCASE text slides (PIL/Pillow)
4. **Video Compilation** - Renders final MP4 with FFmpeg

**Full automation:** Sales page URL → Finished VSL video

---

## VSL Generation Command

```
🎬 OPENCLAW SALES VIDEO SCRIPT COMMAND

You are generating a high-conversion Video Sales Letter (VSL).
This video must be built FROM the existing sales page.
It must NOT contradict, rename, or introduce new mechanisms.
It must amplify emotional intensity while preserving factual alignment.

⸻ STEP 1 — PAGE ASSIMILATION (MANDATORY)

Before writing the script:

Scan the entire sales page and extract:
• Core promise
• Primary mechanism
• Unique differentiator
• Revenue proof
• Time proof
• Offer stack
• Price
• Guarantee
• Urgency mechanism
• Emotional tone

Return this in structured format. Do NOT write the script yet.

⸻ STEP 2 — MESSAGE CONSISTENCY CHECK

Confirm:
• The VSL will not introduce new claims
• The VSL will not change pricing
• The VSL will not exaggerate proof
• The VSL will not rename the mechanism
• The VSL will not shift positioning

If any inconsistency is detected, flag it before proceeding.

⸻ STEP 3 — VSL CONSTRUCTION MODE

Now build a spoken-language script optimized for:
• Cold-to-warm conversion
• Retention
• Psychological escalation
• Identity shift
• Urgency

Do NOT narrate the page. Rebuild it for video psychology.

⸻ STRUCTURE REQUIREMENT (MANDATORY)

The script must follow:

1️⃣ Hook (0–30 sec)
Pattern interrupt. Bold claim. Curiosity loop.

2️⃣ Problem Escalation
Highlight builder trap, speed problem, identity friction.

3️⃣ The Core Event
Explain what happened clearly and credibly.

4️⃣ Mechanism
Explain the system simply.

5️⃣ Proof
Breakdown + validation (aligned with page).

6️⃣ Transformation
What this means for the viewer.

7️⃣ Objection Handling
Naturally woven, at least 5 objections.

8️⃣ Offer Stack
What they get. Why it matters.

9️⃣ Urgency
Reinforce pricing window or increase trigger.

🔟 Close
Identity shift + direct CTA.

⸻ DELIVERY RULES

• 6–10 minutes long
• Spoken language (short sentences)
• No long paragraphs
• No corporate tone
• No "hey guys" intro
• Use rhythm and pacing
• Include pauses (…)
• Include emphasis moments
• Include 3 curiosity loops in first 2 minutes

⸻ OPTIONAL STAGE DIRECTIONS

Include cues like:
[Lean in]
[Pause]
[Lower voice]
[Show screen]
[Cut to proof]

Make it record-ready.

⸻ INTENSITY REQUIREMENT

Increase emotional intensity 30% beyond the page.
But do NOT alter factual claims.
Amplify tension. Preserve truth.

⸻ FINAL OUTPUT

After script completion, output:

Message Alignment Confirmation:
• Promise matched: Yes/No
• Mechanism matched: Yes/No
• Pricing matched: Yes/No
• Guarantee matched: Yes/No
• Urgency matched: Yes/No

If any answer is "No," revise automatically.

⸻ LENGTH CONTROL

Minimum 1,200 words.
Do not stop early.
Do not summarize.
```

---

## VSL_POWERPOINT_AUTOBUILDER Mode

**Streamlined version:** Takes a finished script → outputs finished MP4 video with PERFECT voice sync.

**When to use:** Script already written, need fast professional video render.

---

### ⚠️ REQUIRED: ASK FIRST (EVERY TIME)

**Before doing ANYTHING, ask the user:**

1. **"Background: WHITE or BLACK?"**
   - Default if no answer: WHITE

2. **"Format: 9:16 or 16:9?"**
   - Default if no answer: 16:9 (horizontal)

**DO NOT proceed without asking. This is NON-NEGOTIABLE.**

---

### Process (6 Steps)

1. **Ask User Preferences** - Background color + format (see above)
2. **Slide Creation** - Break script into slides (smart word count rules)
3. **Voice Generation** - Generate voice.mp3 via ElevenLabs
4. **Voice Sync** - Extract word timestamps, sync slides to audio PERFECTLY
5. **Render Engine** - Generate HTML slides, render to MP4 with synced timing
6. **Output** - Return video + audio + timing data

---

### Design / Style Rules

**Background & Text:**
- Background: USER CHOICE (white or black)
- Text color: AUTO-CONTRAST
  - White BG → Black text
  - Black BG → White text

**Typography:**
- Font: Modern clean sans (Inter / Montserrat / Helvetica / Arial)
- Two sizes only:
  - **Headline slides:** Very large (fills screen)
  - **Body slides:** Medium (readable)
- More whitespace + tighter line spacing
- Text vertically centered

**Format:**
- 16:9 (horizontal) - default for VSLs
- 9:16 (vertical) - available if specifically requested
- No images, logos, or background music
- Transitions: 0.3s fade

---

### Font Size Auto-Fit (CRITICAL)

Font size must auto-fit based on word count:

- **≤4 words:** HUGE (fills screen, ~120-140px)
- **5-8 words:** LARGE (~80-100px)
- **9-14 words:** MEDIUM (~60-72px)

**Rule:** If text would be too small, SPLIT INTO MORE SLIDES.
Never allow tiny text. Readability > slide count.

---

### Slide Word Count Rules

- **Target:** 4-8 words per slide (sweet spot)
- **Maximum:** 14 words (avoid if possible)
- **If >10 words:** Consider splitting into 2 slides
- **Emphasis slides:** 2-4 words, 0.6-0.9s duration ("READ THAT AGAIN.")

Remove filler words: um, uh, like, you know, basically, actually

---

### Speed / Pacing (MAKE IT PUNCHY)

**NEW TIMING FORMULA:**
```javascript
slide_duration = clamp(
  0.22 * word_count + 0.35,
  0.9,  // minimum 0.9s (fast!)
  2.2   // maximum 2.2s
)
```

**"HIT" slides (emphasis):**
- Duration: 0.6s - 0.9s
- Examples: "READ THAT AGAIN." / "LET THAT SINK IN."

**Goal:** Pacing feels like TikTok / modern VSL (fast, not slow).

---

### Perfect Voice Sync (MOST IMPORTANT) ⚠️

**YOU ARE NOT ALLOWED TO GUESS TIMING.**

Slides MUST sync to the audio using word-level timestamps.

**Required Method:**

1. **Generate voice.mp3** from ElevenLabs

2. **Get word timestamps** using ONE of:
   - Whisper with timestamps flag (`--word_timestamps`)
   - Forced alignment tool (aeneas / gentle)
   - Any ElevenLabs alignment feature (if available)

3. **Build slide timings from timestamps:**
   ```javascript
   slide.start_time = timestamp_of_first_word
   slide.end_time = timestamp_of_last_word + 0.15s
   slide.duration = end_time - start_time
   ```

4. **Render slideshow** using exact timings

5. **Verify sync:**
   - Total slide times must match audio length within 0.2s
   - If mismatch, re-time and re-render

**Quality Check:**
- ✅ No slide stays on screen while audio moves to next sentence
- ✅ No long pauses unless intentionally used for emphasis
- ✅ Text is always readable on mobile
- ✅ Pacing feels fast and engaging

---

### Output Format

**Files:**
- `vsl_final.mp4` - Final video with voice
- `voice.mp3` - Audio track
- `slides.json` - Timing data

**slides.json structure:**
```json
{
  "slides": [
    {
      "slide_index": 1,
      "text": "YOU'RE ABOUT TO SEE SOMETHING",
      "start_time": 0.0,
      "end_time": 1.8,
      "duration": 1.8,
      "word_count": 5
    },
    ...
  ],
  "total_duration": 480.5,
  "total_slides": 85,
  "format": "9:16",
  "background": "white"
}
```

---

### Usage

**Step 1: Ask preferences**
```
Before starting:
"Background: WHITE or BLACK?"
"Format: 9:16 or 16:9?"
```

**Step 2: Paste script + execute**
```
[Paste finished script]

Execute VSL_POWERPOINT_AUTOBUILDER
```

**Step 3: Autobuilder runs full pipeline**
- Generates slides
- Creates voice
- Syncs timing
- Renders video
- Returns output

---

### Quality Standards (Non-Negotiable)

✅ **User preferences asked FIRST** (background + format)
✅ **Font size auto-fits** based on word count
✅ **Pacing feels punchy** (0.9s - 2.2s per slide)
✅ **Voice sync is PERFECT** (word-level timestamps)
✅ **Text is readable** on mobile devices
✅ **No timing guesswork** - all synced to audio

**If any standard is not met, the output is NOT acceptable.**

---

## Usage Examples

### Basic Usage
```
Create a VSL for openclaw-faststart-v2.vercel.app/operator-version
```

### With Custom Voice
```
Generate VSL for [URL]
Voice: Pacino (confident, operator tone)
Length: 8 minutes
```

### With Specific Focus
```
VSL for [product URL]
Emphasize: Speed advantage, proof points
Target: Cold traffic
```

### PowerPoint Autobuilder Mode
```
[Paste finished script]

Use VSL_POWERPOINT_AUTOBUILDER
```

---

## Technical Stack

### 1. Script Generation
- Sales page analysis (web scraping or direct file read)
- Copy framework application
- Spoken-language optimization

### 2. Voice Synthesis
**Tool:** ElevenLabs API
**Voice ID:** (Configure per project)
**Settings:**
- Stability: 0.5
- Similarity: 0.75
- Style: 0.0 (neutral)

### 3. Slide Generation
**Options:**
- **FFmpeg + ImageMagick** (Programmatic, free)
- **Canva API** (If available)
- **Pillow (Python)** (Image generation)

**Slide Style:**
- Bold headlines
- Minimal text per slide
- High contrast (black/white/yellow)
- Professional typography

### 4. Video Compilation
**Tool:** FFmpeg
**Command:**
```bash
ffmpeg -loop 1 -t [duration] -i slide001.png \
  -loop 1 -t [duration] -i slide002.png \
  ... \
  -i audio.mp3 \
  -filter_complex "[0:v][1:v]...concat=n=[count]:v=1:a=0[v]" \
  -map "[v]" -map [count]:a \
  -c:v libx264 -c:a aac -shortest \
  output.mp4
```

---

## Output Structure

```
vsl-output/
├── script.md              # Full script with timing
├── audio.mp3              # ElevenLabs voice
├── slides/
│   ├── slide-001.png
│   ├── slide-002.png
│   └── ...
└── final-vsl.mp4          # Rendered video
```

---

## Workflow States

**Phase 1: Analysis**
- Extract page elements
- Identify core messaging
- Confirm alignment

**Phase 2: Script**
- Write spoken-language version
- Add stage directions
- Validate message match

**Phase 3: Voice**
- Generate ElevenLabs audio
- Review pacing
- Export MP3

**Phase 4: Visuals**
- Generate slide images
- Sync timing to script
- Create transitions

**Phase 5: Render**
- Compile with FFmpeg
- Add music (optional)
- Export final MP4

**Phase 6: Delivery**
- Save to workspace
- Upload to storage (optional)
- Provide download link

---

## Configuration

**ElevenLabs Settings:**
- API Key: (Store in credentials)
- Voice ID: (Configure per project)
- Model: eleven_monolingual_v1

**Video Settings:**
- Resolution: 1920x1080
- Frame Rate: 30fps
- Codec: H.264
- Audio: AAC 192kbps

**Slide Timing:**
- Hook: 30 seconds
- Problem: 90 seconds
- Mechanism: 60 seconds
- Proof: 45 seconds
- Transformation: 45 seconds
- Objections: 60 seconds
- Offer: 60 seconds
- Urgency: 30 seconds
- Close: 30 seconds

---

## Examples

### Example 1: FastStart VSL
**Input:** openclaw-faststart-v2.vercel.app/operator-version
**Output:** 10-minute VSL, Pacino voice, operator positioning
**File:** `openclaw-faststart-v2/VSL-SCRIPT.md`

### Example 2: Product Launch VSL
**Input:** Product landing page URL
**Output:** 7-minute VSL, cold traffic optimized

---

## Error Handling

**No sales page found:**
- Request URL or file path
- Cannot proceed without source material

**Message misalignment:**
- Flag inconsistencies
- Request manual review before proceeding

**Voice generation fails:**
- Fallback to text output
- Notify user to generate voice manually

**Video render fails:**
- Export slides + audio separately
- Provide assembly instructions

---

## Future Enhancements

- [ ] Auto-upload to YouTube (unlisted)
- [ ] Captions/subtitles generation
- [ ] Background music integration
- [ ] Multiple voice options
- [ ] A/B testing variations
- [ ] Direct Canva integration
- [ ] Animated text overlays
- [ ] Stock footage integration

---

## Dependencies

**Required:**
- ElevenLabs API access
- FFmpeg installed
- ImageMagick or Pillow (Python)

**Optional:**
- Canva API
- YouTube API
- Storage (Dropbox/S3)

---

## Cost Per Video

**ElevenLabs:** ~$0.30-0.50 per 10-min video
**Storage:** Minimal (~50MB per video)
**Compute:** Local (free)

**Total:** < $1 per VSL

---

## Notes

- Script must match sales page messaging exactly
- Voice pacing critical for retention
- Slide timing synced to natural speech pauses
- Export in multiple formats (MP4, WebM) for compatibility
- Keep source files for future edits

---

**Skill Status:** Ready for implementation
**Next Step:** Build automation pipeline (script → voice → slides → video)

 # #   V i d e o   L e n g t h   G u i d e l i n e s 
 
 * * T a r g e t   d u r a t i o n :   5 - 6   m i n u t e s * * 
 -   I d e a l   V S L   l e n g t h   f o r   c o n v e r s i o n 
 -   L o n g   e n o u g h   t o   b u i l d   v a l u e   a n d   h a n d l e   o b j e c t i o n s 
 -   S h o r t   e n o u g h   t o   m a i n t a i n   a t t e n t i o n 
 -   S c r i p t   s h o u l d   b e   ~ 1 , 2 0 0 - 1 , 5 0 0   w o r d s 
 
 
 