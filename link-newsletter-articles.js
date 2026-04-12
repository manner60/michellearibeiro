#!/usr/bin/env node
/**
 * Newsletter Article Linker
 * Adds "Read More" links to newsletter markdown based on article mapping
 * 
 * Usage: node link-newsletter-articles.js [newsletter-file] [article-mapping-file]
 */

const fs = require('fs');
const path = require('path');

// Default article mappings for BizBuzz Calgary
const DEFAULT_ARTICLE_MAPPINGS = {
  'bizbuzz-calgary': {
    'google-business-profile': {
      headline: 'The Complete Guide to Google Business Profile Optimization for Calgary Businesses',
      slug: 'google-business-profile-guide',
      sections: ['GROWTH TIP', 'Google Business Profile', 'TOOL', 'Canva']
    },
    'alberta-grants': {
      headline: 'Alberta Small Business Grants: Your Complete 2025 Guide to Free Funding',
      slug: 'alberta-small-business-grants-guide',
      sections: ['OPPORTUNITIES', 'Alberta Small Business Innovation Grant', 'grants']
    },
    'economic-pulse': {
      headline: 'Calgary Economic Pulse: What Business Owners Should Know This Quarter',
      slug: 'calgary-economic-pulse',
      sections: ['OPPORTUNITIES', 'Economic', 'hiring', 'labor market']
    }
  },
  'stampede-city-buzz': {
    // Add Stampede City Buzz article mappings here
  }
};

function getLettermanUrl(publicationSlug, articleSlug) {
  return `https://letterman.ai/p/${publicationSlug}/${articleSlug}`;
}

function findSection(content, sectionKeywords) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (sectionKeywords.some(keyword => line.includes(keyword.toLowerCase()))) {
      // Find the end of this section (next ## or end of file)
      let endIndex = lines.length;
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].startsWith('## ')) {
          endIndex = j;
          break;
        }
      }
      return { start: i, end: endIndex, lines: lines };
    }
  }
  return null;
}

function addReadMoreLink(content, sectionKeywords, linkText, url) {
  const section = findSection(content, sectionKeywords);
  if (!section) {
    console.log(`  ⚠ Section not found for keywords: ${sectionKeywords.join(', ')}`);
    return content;
  }
  
  const { lines, start, end } = section;
  const sectionContent = lines.slice(start, end).join('\n');
  
  // Check if link already exists
  if (sectionContent.includes(url) || sectionContent.includes('→ [')) {
    console.log(`  ✓ Link already exists in section starting at line ${start + 1}`);
    return content;
  }
  
  // Find the best place to insert the link (before next section or at end of section)
  let insertIndex = end - 1;
  // Walk back to find a good insertion point (not in the middle of a list)
  while (insertIndex > start && (lines[insertIndex].trim().startsWith('-') || lines[insertIndex].trim() === '')) {
    insertIndex--;
  }
  
  // Insert the link
  const linkLine = `\n→ **[${linkText}](${url})**`;
  lines.splice(insertIndex + 1, 0, linkLine);
  
  console.log(`  ✓ Added link at line ${insertIndex + 2}: ${linkText}`);
  return lines.join('\n');
}

function processNewsletter(newsletterPath, publicationName, customMappings = null) {
  console.log(`\n📰 Processing: ${path.basename(newsletterPath)}`);
  console.log(`Publication: ${publicationName}`);
  
  // Read newsletter content
  let content = fs.readFileSync(newsletterPath, 'utf8');
  const originalContent = content;
  
  // Get article mappings
  const mappings = customMappings || DEFAULT_ARTICLE_MAPPINGS[publicationName];
  if (!mappings) {
    console.error(`❌ No article mappings found for publication: ${publicationName}`);
    return false;
  }
  
  // Process each article
  Object.entries(mappings).forEach(([articleKey, article]) => {
    const url = getLettermanUrl(publicationName, article.slug);
    console.log(`\n  Linking: ${article.headline.substring(0, 50)}...`);
    
    content = addReadMoreLink(
      content,
      article.sections,
      `Read the full guide: ${article.headline}`,
      url
    );
  });
  
  // Write updated content
  if (content !== originalContent) {
    fs.writeFileSync(newsletterPath, content, 'utf8');
    console.log(`\n✅ Updated: ${newsletterPath}`);
    return true;
  } else {
    console.log(`\nℹ No changes made to: ${newsletterPath}`);
    return false;
  }
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Newsletter Article Linker');
    console.log('=========================\n');
    console.log('Usage:');
    console.log('  node link-newsletter-articles.js [newsletter-file] [publication-name]');
    console.log('\nExamples:');
    console.log('  node link-newsletter-articles.js bizbuzz-calgary-issue-1.md bizbuzz-calgary');
    console.log('  node link-newsletter-articles.js stampede-city-buzz-issue-1.md stampede-city-buzz');
    console.log('\nRunning with defaults...\n');
    
    // Process default newsletters
    const results = [];
    
    if (fs.existsSync('bizbuzz-calgary-issue-1.md')) {
      results.push(processNewsletter('bizbuzz-calgary-issue-1.md', 'bizbuzz-calgary'));
    }
    
    if (fs.existsSync('stampede-city-buzz-issue-1.md')) {
      results.push(processNewsletter('stampede-city-buzz-issue-1.md', 'stampede-city-buzz'));
    }
    
    if (results.length === 0) {
      console.log('No newsletter files found.');
    }
    
    return;
  }
  
  const newsletterPath = args[0];
  const publicationName = args[1] || 'bizbuzz-calgary';
  
  if (!fs.existsSync(newsletterPath)) {
    console.error(`❌ File not found: ${newsletterPath}`);
    process.exit(1);
  }
  
  processNewsletter(newsletterPath, publicationName);
}

main();
