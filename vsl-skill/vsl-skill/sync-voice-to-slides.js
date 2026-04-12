#!/usr/bin/env node
/**
 * Sync slides to voice using word-level timestamps
 * Uses Whisper to extract word timestamps, then rebuilds slide timing
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUTPUT_DIR = path.join(process.cwd(), 'vsl-output-v2');
const VOICE_PATH = path.join(OUTPUT_DIR, 'voice.mp3');
const MANIFEST_PATH = path.join(OUTPUT_DIR, 'manifest-presync.json');

async function main() {
  console.log('🎯 SYNCING SLIDES TO VOICE\n');

  // Check files exist
  if (!fs.existsSync(VOICE_PATH)) {
    console.error('❌ voice.mp3 not found. Run generate-voice.js first.');
    process.exit(1);
  }
  
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error('❌ manifest-presync.json not found. Run powerpoint-autobuilder-v2.js first.');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  console.log(`📊 Loaded ${manifest.totalSlides} slides\n`);

  // Step 1: Extract word timestamps using Whisper
  console.log('🎤 Extracting word timestamps from audio...');
  console.log('(Using Whisper with word_timestamps=True)\n');

  const whisperOutput = path.join(OUTPUT_DIR, 'whisper_timestamps.json');
  
  try {
    // Use Whisper CLI with word timestamps
    // Note: Requires whisper to be installed: pip install openai-whisper
    const whisperCmd = `whisper "${VOICE_PATH}" --model base --output_dir "${OUTPUT_DIR}" --output_format json --word_timestamps True --language en`;
    
    console.log('Running Whisper...');
    execSync(whisperCmd, { stdio: 'inherit' });
    console.log('✓ Whisper complete\n');
  } catch (error) {
    console.error('❌ Whisper failed. Falling back to estimated timing.\n');
    console.error('To get perfect sync, install Whisper: pip install openai-whisper\n');
    
    // Fallback: Use estimated timing from manifest
    const fallbackManifest = {
      ...manifest,
      slides: manifest.slides.map((slide, idx) => {
        const startTime = manifest.slides.slice(0, idx).reduce((sum, s) => sum + s.estimated_duration, 0);
        return {
          ...slide,
          start_time: parseFloat(startTime.toFixed(2)),
          end_time: parseFloat((startTime + slide.estimated_duration).toFixed(2)),
          duration: slide.estimated_duration
        };
      }),
      sync_method: 'estimated',
      total_duration: manifest.estimatedDuration
    };
    
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'slides.json'),
      JSON.stringify(fallbackManifest, null, 2)
    );
    
    console.log('⚠️  Using estimated timing (not synced to audio)');
    console.log('✓ slides.json created\n');
    return fallbackManifest;
  }

  // Step 2: Parse Whisper output
  console.log('📖 Parsing word timestamps...');
  const whisperFile = path.join(OUTPUT_DIR, 'voice.json');
  const whisperData = JSON.parse(fs.readFileSync(whisperFile, 'utf-8'));
  
  // Extract all words with timestamps
  const words = [];
  whisperData.segments.forEach(segment => {
    if (segment.words) {
      segment.words.forEach(word => {
        words.push({
          text: word.word.trim(),
          start: word.start,
          end: word.end
        });
      });
    }
  });
  
  console.log(`✓ Found ${words.length} words with timestamps\n`);

  // Step 3: Match slides to word ranges
  console.log('🔗 Matching slides to word timestamps...');
  
  let wordIndex = 0;
  const syncedSlides = manifest.slides.map((slide, slideIdx) => {
    const slideWords = slide.text.split(/\s+/).filter(w => w.length > 0);
    const slideWordCount = slideWords.length;
    
    // Find word range for this slide
    const slideWordRange = words.slice(wordIndex, wordIndex + slideWordCount);
    wordIndex += slideWordCount;
    
    if (slideWordRange.length === 0) {
      console.warn(`⚠️  Slide ${slideIdx + 1}: No matching words found`);
      return null;
    }
    
    // Calculate slide timing from word timestamps
    const startTime = slideWordRange[0].start;
    const endTime = slideWordRange[slideWordRange.length - 1].end + 0.15; // Add 0.15s buffer
    const duration = endTime - startTime;
    
    return {
      ...slide,
      start_time: parseFloat(startTime.toFixed(2)),
      end_time: parseFloat(endTime.toFixed(2)),
      duration: parseFloat(duration.toFixed(2))
    };
  }).filter(s => s !== null);
  
  console.log(`✓ Synced ${syncedSlides.length} slides\n`);

  // Step 4: Verify total duration matches audio
  const totalSlideDuration = syncedSlides[syncedSlides.length - 1].end_time;
  const audioDuration = words[words.length - 1].end;
  const durationDiff = Math.abs(totalSlideDuration - audioDuration);
  
  console.log(`🔍 Duration check:`);
  console.log(`   Audio: ${audioDuration.toFixed(2)}s`);
  console.log(`   Slides: ${totalSlideDuration.toFixed(2)}s`);
  console.log(`   Difference: ${durationDiff.toFixed(2)}s`);
  
  if (durationDiff > 0.2) {
    console.warn(`\n⚠️  WARNING: Duration mismatch > 0.2s`);
    console.warn(`   This may cause sync issues. Consider re-timing.\n`);
  } else {
    console.log(`   ✓ Within tolerance (< 0.2s)\n`);
  }

  // Step 5: Save synced manifest
  const syncedManifest = {
    ...manifest,
    slides: syncedSlides,
    sync_method: 'whisper_word_timestamps',
    total_duration: parseFloat(totalSlideDuration.toFixed(2)),
    audio_duration: parseFloat(audioDuration.toFixed(2)),
    sync_accuracy: parseFloat(durationDiff.toFixed(3))
  };
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'slides.json'),
    JSON.stringify(syncedManifest, null, 2)
  );
  
  console.log('✅ SYNC COMPLETE\n');
  console.log(`📁 Output: ${OUTPUT_DIR}/slides.json`);
  console.log(`📊 Synced slides: ${syncedSlides.length}`);
  console.log(`⏱️  Total duration: ${totalSlideDuration.toFixed(2)}s\n`);
  console.log('📌 NEXT: Run render-final.js to create video\n');
  
  return syncedManifest;
}

main().catch(console.error);
