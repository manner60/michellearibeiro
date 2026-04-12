#!/bin/bash
# Weekly Newsletter Article Linker
# Run this after creating new articles in Letterman to link them to newsletters

echo "📰 Newsletter Article Linker"
echo "============================"
echo ""

# Process BizBuzz Calgary
echo "Processing BizBuzz Calgary..."
if [ -f "bizbuzz-calgary-issue-1.md" ]; then
    node link-newsletter-articles.js bizbuzz-calgary-issue-1.md bizbuzz-calgary
    echo "✅ BizBuzz Calgary updated"
else
    echo "⚠️  bizbuzz-calgary-issue-1.md not found"
fi

echo ""

# Process Stampede City Buzz
echo "Processing Stampede City Buzz..."
if [ -f "stampede-city-buzz-issue-1.md" ]; then
    node link-newsletter-articles.js stampede-city-buzz-issue-1.md stampede-city-buzz
    echo "✅ Stampede City Buzz updated"
else
    echo "⚠️  stampede-city-buzz-issue-1.md not found"
fi

echo ""
echo "============================"
echo "Done! Review the changes before sending."
