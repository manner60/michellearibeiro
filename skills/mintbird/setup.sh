#!/bin/bash

# PopLinks Manager - Setup Wizard (Bash)
# Guides user through credential setup with API validation

echo ""
echo "============================================================"
echo "PopLinks Manager - Setup Wizard"
echo "============================================================"
echo ""

echo "This wizard will help you set up your PopLinks API credentials."
echo ""
echo "💡 Tip: Keep your PopLinks/MintBird dashboard open for reference."
echo ""

# Step 1: API Token
echo "============================================================"
echo "Step 1: API Token"
echo "============================================================"
echo ""
echo "📍 Get your API token from:"
echo "   PopLinks/MintBird Dashboard → Settings → API Access"
echo ""

read -p "Enter your API Token: " API_TOKEN

if [ -z "$API_TOKEN" ]; then
    echo ""
    echo "❌ API Token is required. Exiting."
    echo ""
    exit 1
fi

echo ""
echo "✅ Token saved (${API_TOKEN:0:10}...)"

# Test API connection
echo ""
echo "🔗 Testing API connection..."

HTTP_CODE=$(curl -s -o /tmp/poplinks-test.json -w "%{http_code}" \
    -H "Authorization: Bearer $API_TOKEN" \
    https://api.poplinks.io/api/ai/me)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ API connection successful!"
    
    if command -v jq &> /dev/null; then
        EMAIL=$(jq -r '.data.email // empty' /tmp/poplinks-test.json 2>/dev/null)
        if [ ! -z "$EMAIL" ]; then
            echo "   Account: $EMAIL"
        fi
    fi
else
    echo "❌ API connection failed! (HTTP $HTTP_CODE)"
    echo "   Your token may be invalid or expired."
    echo ""
    read -p "Continue anyway? (y/n): " CONTINUE
    
    if [ "$CONTINUE" != "y" ] && [ "$CONTINUE" != "yes" ]; then
        echo ""
        echo "Setup cancelled."
        echo ""
        rm -f /tmp/poplinks-test.json
        exit 1
    fi
fi

rm -f /tmp/poplinks-test.json

# Step 2: Domain ID
echo ""
echo "============================================================"
echo "Step 2: Domain ID"
echo "============================================================"
echo ""
echo "📍 Fetching your domains..."

DOMAINS=$(curl -s -H "Authorization: Bearer $API_TOKEN" \
    https://api.poplinks.io/api/ai/domains)

echo ""
echo "Your domains:"

if command -v jq &> /dev/null; then
    echo "$DOMAINS" | jq -r '.data[] | "   \(if .status == "active" then "✅" else "⚠️ " end) ID: \(.id) - \(.domain)"'
else
    echo "$DOMAINS"
    echo ""
    echo "💡 Install 'jq' for better formatting: sudo apt install jq"
fi

echo ""
read -p "Enter your default Domain ID: " DOMAIN_ID

if [ -z "$DOMAIN_ID" ]; then
    echo ""
    echo "❌ Domain ID is required. Exiting."
    echo ""
    exit 1
fi

echo ""
echo "✅ Domain ID: $DOMAIN_ID"

# Step 3: Category ID (optional)
echo ""
echo "============================================================"
echo "Step 3: Category ID (Optional)"
echo "============================================================"
echo ""
echo "📍 Fetching your categories..."

CATEGORIES=$(curl -s -H "Authorization: Bearer $API_TOKEN" \
    "https://api.poplinks.io/api/ai/categories?type=2")

echo ""

if command -v jq &> /dev/null; then
    COUNT=$(echo "$CATEGORIES" | jq '.data | length')
    
    if [ "$COUNT" -gt 0 ]; then
        echo "Your categories:"
        echo "$CATEGORIES" | jq -r '.data[] | "   ID: \(.id) - \(.name)"'
        echo ""
    else
        echo "No categories found. You can skip this."
        echo ""
    fi
else
    echo "$CATEGORIES"
    echo ""
fi

echo "💡 Press Enter to skip if you don't use categories."
echo ""
read -p "Enter your default Category ID (optional): " CATEGORY_ID

if [ -z "$CATEGORY_ID" ]; then
    CATEGORY_ID="null"
    echo ""
    echo "⏭️  Skipping category ID"
else
    echo ""
    echo "✅ Category ID: $CATEGORY_ID"
fi

# Create credentials file
echo ""
echo "============================================================"
echo "Saving Credentials"
echo "============================================================"
echo ""

TIMESTAMP=$(date -Iseconds)
CRED_DIR="../../credentials"
CRED_FILE="$CRED_DIR/poplinks-api.txt"

# Create credentials directory if it doesn't exist
mkdir -p "$CRED_DIR"

# Write credentials file
cat > "$CRED_FILE" <<EOF
# PopLinks API Credentials
# Generated: $TIMESTAMP

API_TOKEN=$API_TOKEN
DEFAULT_DOMAIN_ID=$DOMAIN_ID
DEFAULT_CATEGORY_ID=$CATEGORY_ID
DEFAULT_LEADPAGE_TEMPLATE=5
DEFAULT_BRIDGEPAGE_TEMPLATE=3
EOF

echo "✅ Credentials saved to: $CRED_FILE"

# Security reminder
echo ""
echo "============================================================"
echo "🔒 Security Reminder"
echo "============================================================"
echo ""
echo "⚠️  NEVER commit credentials to git"
echo "⚠️  NEVER share your API token publicly"
echo "✅ Your credentials folder is already in .gitignore"
echo ""

# Next steps
echo "============================================================"
echo "🚀 Setup Complete!"
echo "============================================================"
echo ""
echo "You can now use PopLinks Manager commands:"
echo ""
echo "   📋 List PopLinks:"
echo "      node example-commands.js list-poplinks"
echo ""
echo "   📋 List Bridge Pages:"
echo "      node example-commands.js list-bridges"
echo ""
echo "   ✨ Create PopLink:"
echo '      node example-commands.js create-poplink "Name" "https://url.com" "slug"'
echo ""
echo "📖 For more commands, see:"
echo "   • QUICK_REFERENCE.md - Common tasks"
echo "   • EXAMPLES.md - Real-world workflows"
echo "   • SKILL.md - Complete API reference"
echo ""
echo "Happy automating! 🎬"
echo ""
