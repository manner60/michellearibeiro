#!/usr/bin/env node
/**
 * VSL_POWERPOINT_AUTOBUILDER
 * 
 * Takes a script, generates slides + voice, renders 9:16 vertical video
 * Usage: node powerpoint-autobuilder.js script.txt
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  maxWordsPerSlide: 8,
  minSlideDuration: 2.5, // seconds
  maxSlideDuration: 6.0,  // seconds
  secondsPerWord: 0.45,
  fadeTransition: 0.3,    // seconds
  videoFormat: {
    width: 1080,   // 9:16 vertical
    height: 1920,
    fps: 30,
    bgColor: '#000000',
    textColor: '#FFFFFF',
    fontFamily: 'Arial Black, sans-serif'
  }
};

/**
 * Break script into slides (max 8 words each)
 */
function createSlides(script) {
  // Remove filler words
  const fillerWords = ['um', 'uh', 'like', 'you know', 'basically', 'actually'];
  let cleaned = script;
  fillerWords.forEach(word => {
    cleaned = cleaned.replace(new RegExp(`\\b${word}\\b`, 'gi'), '');
  });

  // Split into sentences
  const sentences = cleaned
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const slides = [];
  
  sentences.forEach(sentence => {
    const words = sentence.split(/\s+/).filter(w => w.length > 0);
    
    // If sentence fits in one slide
    if (words.length <= CONFIG.maxWordsPerSlide) {
      slides.push({
        text: sentence.toUpperCase(),
        wordCount: words.length
      });
    } else {
      // Break into multiple slides
      for (let i = 0; i < words.length; i += CONFIG.maxWordsPerSlide) {
        const chunk = words.slice(i, i + CONFIG.maxWordsPerSlide);
        slides.push({
          text: chunk.join(' ').toUpperCase(),
          wordCount: chunk.length
        });
      }
    }
  });

  // Add emphasis slides strategically (every 10-15 slides)
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
    if ((idx + 1) % 12 === 0 && idx < slides.length - 5) {
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
 * Calculate slide timing
 */
function calculateTiming(slides) {
  return slides.map(slide => {
    const duration = Math.max(
      CONFIG.minSlideDuration,
      Math.min(
        slide.wordCount * CONFIG.secondsPerWord,
        CONFIG.maxSlideDuration
      )
    );
    
    return {
      ...slide,
      duration: duration.toFixed(2)
    };
  });
}

/**
 * Generate HTML slide template
 */
function generateSlideHTML(slide, index, totalSlides) {
  return `
<!DOCTYPE html>
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
      width: ${CONFIG.videoFormat.width}px;
      height: ${CONFIG.videoFormat.height}px;
      background: ${CONFIG.videoFormat.bgColor};
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: ${CONFIG.videoFormat.fontFamily};
      overflow: hidden;
    }
    .slide {
      color: ${CONFIG.videoFormat.textColor};
      font-size: ${slide.isEmphasis ? '80px' : '72px'};
      font-weight: bold;
      text-align: center;
      padding: 100px 80px;
      line-height: 1.3;
      max-width: 100%;
      word-wrap: break-word;
      ${slide.isEmphasis ? 'letter-spacing: 3px;' : ''}
    }
  </style>
</head>
<body>
  <div class="slide">${slide.text}</div>
</body>
</html>
  `;
}

/**
 * Generate slides manifest for video rendering
 */
function generateManifest(slidesWithTiming) {
  const totalDuration = slidesWithTiming.reduce((sum, s) => sum + parseFloat(s.duration), 0);
  
  return {
    totalSlides: slidesWithTiming.length,
    totalDuration: totalDuration.toFixed(2),
    fps: CONFIG.videoFormat.fps,
    resolution: `${CONFIG.videoFormat.width}x${CONFIG.videoFormat.height}`,
    slides: slidesWithTiming.map((slide, idx) => ({
      index: idx + 1,
      text: slide.text,
      duration: slide.duration,
      htmlFile: `slide-${String(idx + 1).padStart(3, '0')}.html`
    }))
  };
}

/**
 * Main execution
 */
async function main() {
  const scriptPath = process.argv[2];
  
  if (!scriptPath) {
    console.error('Usage: node powerpoint-autobuilder.js <script.txt>');
    process.exit(1);
  }

  const script = fs.readFileSync(scriptPath, 'utf-8');
  console.log('📄 Script loaded:', script.length, 'characters');

  // Step 1: Create slides
  console.log('\n🎬 Creating slides...');
  const slides = createSlides(script);
  console.log(`✓ Generated ${slides.length} slides`);

  // Step 2: Calculate timing
  console.log('\n⏱️  Calculating timing...');
  const slidesWithTiming = calculateTiming(slides);
  const totalDuration = slidesWithTiming.reduce((sum, s) => sum + parseFloat(s.duration), 0);
  console.log(`✓ Total duration: ${totalDuration.toFixed(2)} seconds`);

  // Step 3: Generate HTML files
  console.log('\n📝 Generating HTML slides...');
  const outputDir = path.join(process.cwd(), 'vsl-output');
  const slidesDir = path.join(outputDir, 'slides');
  
  if (!fs.existsSync(slidesDir)) {
    fs.mkdirSync(slidesDir, { recursive: true });
  }

  slidesWithTiming.forEach((slide, idx) => {
    const html = generateSlideHTML(slide, idx, slidesWithTiming.length);
    const filename = `slide-${String(idx + 1).padStart(3, '0')}.html`;
    fs.writeFileSync(path.join(slidesDir, filename), html);
  });
  console.log(`✓ Saved ${slidesWithTiming.length} HTML files`);

  // Step 4: Generate manifest
  console.log('\n📋 Generating manifest...');
  const manifest = generateManifest(slidesWithTiming);
  fs.writeFileSync(
    path.join(outputDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('✓ Manifest saved');

  // Step 5: Save timing file for voice generation
  const timingFile = slidesWithTiming.map((s, idx) => 
    `${idx + 1}. [${s.duration}s] ${s.text}`
  ).join('\n');
  fs.writeFileSync(path.join(outputDir, 'timing.txt'), timingFile);

  // Step 6: Output summary
  console.log('\n✅ AUTOBUILDER COMPLETE\n');
  console.log('Output:', outputDir);
  console.log('Slides:', slidesWithTiming.length);
  console.log('Duration:', totalDuration.toFixed(2), 'seconds');
  console.log('\n📌 Next steps:');
  console.log('1. Generate voice: Send full script to ElevenLabs');
  console.log('2. Render video: Use Puppeteer to capture slides + combine with voice');
  console.log('3. Output: vsl_final.mp4');

  return {
    video_path: path.join(outputDir, 'vsl_final.mp4'),
    audio_path: path.join(outputDir, 'voice.mp3'),
    total_slides: slidesWithTiming.length,
    duration_seconds: parseFloat(totalDuration.toFixed(2))
  };
}

// Execute
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createSlides, calculateTiming, generateSlideHTML, generateManifest };
