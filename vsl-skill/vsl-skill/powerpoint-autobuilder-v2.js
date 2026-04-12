#!/usr/bin/env node
/**
 * VSL_POWERPOINT_AUTOBUILDER V2
 * 
 * Takes script + preferences → generates perfectly synced VSL video
 * 
 * Usage: node powerpoint-autobuilder-v2.js script.txt --bg=white --format=9:16
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse command line args
const args = process.argv.slice(2);
const scriptPath = args[0];
const bgColor = (args.find(a => a.startsWith('--bg=')) || '--bg=white').split('=')[1];
const format = (args.find(a => a.startsWith('--format=')) || '--format=16:9').split('=')[1];

// Configuration
const CONFIG = {
  background: bgColor === 'black' ? '#000000' : '#FFFFFF',
  textColor: bgColor === 'black' ? '#FFFFFF' : '#000000',
  format: format,
  dimensions: format === '9:16' ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 },
  fonts: ['Inter', 'Montserrat', 'Helvetica', 'Arial', 'sans-serif'],
  fadeTransition: 0.3,
  fps: 30,
  
  // Speed/pacing formula: clamp(0.22 * words + 0.35, 0.9, 2.2)
  timingFormula: {
    perWord: 0.22,
    base: 0.35,
    min: 0.9,
    max: 2.2
  },
  
  // Font size auto-fit
  fontSize: {
    huge: 140,    // ≤4 words
    large: 100,   // 5-8 words
    medium: 72    // 9-14 words
  }
};

/**
 * Remove filler words from script
 */
function removeFiller(text) {
  const fillers = ['um', 'uh', 'like you know', 'you know', 'basically', 'actually'];
  let cleaned = text;
  fillers.forEach(filler => {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    cleaned = cleaned.replace(regex, '');
  });
  return cleaned.replace(/\s+/g, ' ').trim();
}

/**
 * Break script into optimally-sized slides
 */
function createSlides(script) {
  const cleaned = removeFiller(script);
  const sentences = cleaned
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const slides = [];
  
  sentences.forEach(sentence => {
    const words = sentence.split(/\s+/).filter(w => w.length > 0);
    
    // If sentence fits in sweet spot (4-8 words), use as-is
    if (words.length <= 8) {
      slides.push({
        text: sentence.toUpperCase(),
        wordCount: words.length
      });
    }
    // If medium length (9-14), try to keep together
    else if (words.length <= 14) {
      slides.push({
        text: sentence.toUpperCase(),
        wordCount: words.length
      });
    }
    // If long (>14), split into chunks of ~6-8 words
    else {
      for (let i = 0; i < words.length; i += 7) {
        const chunk = words.slice(i, i + 7);
        slides.push({
          text: chunk.join(' ').toUpperCase(),
          wordCount: chunk.length
        });
      }
    }
  });

  // Add occasional emphasis slides (every ~15 slides)
  const emphasisPhrases = [
    'READ THAT AGAIN.',
    'LET THAT SINK IN.',
    'THIS IS IMPORTANT.',
    'REMEMBER THIS.'
  ];
  
  const finalSlides = [];
  slides.forEach((slide, idx) => {
    finalSlides.push(slide);
    
    // Add emphasis after key points
    if ((idx + 1) % 15 === 0 && idx < slides.length - 5) {
      const emphasis = emphasisPhrases[Math.floor(Math.random() * emphasisPhrases.length)];
      finalSlides.push({
        text: emphasis,
        wordCount: emphasis.split(' ').length,
        isEmphasis: true
      });
    }
  });

  return finalSlides;
}

/**
 * Calculate ESTIMATED timing (will be replaced by voice sync)
 */
function calculateEstimatedTiming(slides) {
  return slides.map(slide => {
    let duration;
    
    if (slide.isEmphasis) {
      // Hit slides: 0.6-0.9s
      duration = 0.6 + Math.random() * 0.3;
    } else {
      // Normal formula: clamp(0.22 * words + 0.35, 0.9, 2.2)
      duration = Math.max(
        CONFIG.timingFormula.min,
        Math.min(
          slide.wordCount * CONFIG.timingFormula.perWord + CONFIG.timingFormula.base,
          CONFIG.timingFormula.max
        )
      );
    }
    
    return {
      ...slide,
      duration: parseFloat(duration.toFixed(2))
    };
  });
}

/**
 * Get font size based on word count
 */
function getFontSize(wordCount) {
  if (wordCount <= 4) return CONFIG.fontSize.huge;
  if (wordCount <= 8) return CONFIG.fontSize.large;
  return CONFIG.fontSize.medium;
}

/**
 * Generate HTML slide
 */
function generateSlideHTML(slide, index) {
  const fontSize = getFontSize(slide.wordCount);
  const fontFamily = CONFIG.fonts.join(', ');
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      width: ${CONFIG.dimensions.width}px;
      height: ${CONFIG.dimensions.height}px;
      background: ${CONFIG.background};
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: ${fontFamily};
      overflow: hidden;
    }
    .slide {
      color: ${CONFIG.textColor};
      font-size: ${fontSize}px;
      font-weight: 700;
      text-align: center;
      padding: ${CONFIG.dimensions.height * 0.1}px ${CONFIG.dimensions.width * 0.08}px;
      line-height: 1.2;
      max-width: 100%;
      word-wrap: break-word;
      ${slide.isEmphasis ? 'letter-spacing: 4px;' : ''}
    }
  </style>
</head>
<body>
  <div class="slide">${slide.text}</div>
</body>
</html>`;
}

/**
 * Main execution
 */
async function main() {
  console.log('🎬 VSL POWERPOINT AUTOBUILDER V2\n');
  
  if (!scriptPath) {
    console.error('❌ Usage: node powerpoint-autobuilder-v2.js script.txt --bg=white --format=9:16');
    process.exit(1);
  }

  console.log(`📐 Format: ${CONFIG.format}`);
  console.log(`🎨 Background: ${bgColor}`);
  console.log(`📝 Text: ${bgColor === 'black' ? 'white' : 'black'}\n`);

  const script = fs.readFileSync(scriptPath, 'utf-8');
  console.log(`📄 Script: ${script.length} characters\n`);

  // Step 1: Create slides
  console.log('📋 Creating slides...');
  const slides = createSlides(script);
  console.log(`✓ Generated ${slides.length} slides\n`);

  // Step 2: Calculate ESTIMATED timing (pre-voice sync)
  console.log('⏱️  Calculating estimated timing...');
  const slidesWithTiming = calculateEstimatedTiming(slides);
  const estimatedDuration = slidesWithTiming.reduce((sum, s) => sum + s.duration, 0);
  console.log(`✓ Estimated duration: ${estimatedDuration.toFixed(2)}s\n`);

  // Step 3: Generate HTML files
  console.log('📝 Generating HTML slides...');
  const outputDir = path.join(process.cwd(), 'vsl-output-v2');
  const slidesDir = path.join(outputDir, 'slides');
  
  if (!fs.existsSync(slidesDir)) {
    fs.mkdirSync(slidesDir, { recursive: true });
  }

  slidesWithTiming.forEach((slide, idx) => {
    const html = generateSlideHTML(slide, idx);
    const filename = `slide-${String(idx + 1).padStart(3, '0')}.html`;
    fs.writeFileSync(path.join(slidesDir, filename), html);
  });
  console.log(`✓ Saved ${slidesWithTiming.length} HTML files\n`);

  // Step 4: Generate manifest (pre-sync)
  console.log('📋 Generating manifest...');
  const manifest = {
    format: CONFIG.format,
    background: bgColor,
    totalSlides: slidesWithTiming.length,
    estimatedDuration: parseFloat(estimatedDuration.toFixed(2)),
    fps: CONFIG.fps,
    resolution: `${CONFIG.dimensions.width}x${CONFIG.dimensions.height}`,
    slides: slidesWithTiming.map((slide, idx) => ({
      slide_index: idx + 1,
      text: slide.text,
      word_count: slide.wordCount,
      estimated_duration: slide.duration,
      htmlFile: `slide-${String(idx + 1).padStart(3, '0')}.html`
    }))
  };
  
  fs.writeFileSync(
    path.join(outputDir, 'manifest-presync.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('✓ Manifest saved\n');

  // Summary
  console.log('✅ SLIDE GENERATION COMPLETE\n');
  console.log(`📁 Output: ${outputDir}`);
  console.log(`📊 Slides: ${slidesWithTiming.length}`);
  console.log(`⏱️  Estimated: ${estimatedDuration.toFixed(2)}s (${Math.floor(estimatedDuration / 60)}:${Math.floor(estimatedDuration % 60).toString().padStart(2, '0')})`);
  console.log(`📐 Format: ${CONFIG.format}`);
  console.log(`🎨 Style: ${bgColor} background\n`);
  
  console.log('📌 NEXT STEPS:');
  console.log('1️⃣  Generate voice: node generate-voice.js');
  console.log('2️⃣  Sync timing: node sync-voice-to-slides.js');
  console.log('3️⃣  Render video: node render-final.js\n');
  
  return manifest;
}

// Execute
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createSlides, calculateEstimatedTiming, generateSlideHTML };
