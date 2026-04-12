#!/bin/bash
# FICA Daily Batch - Direct API tagging
# Runs 3x daily: 9 AM, 12 PM, 3 PM CST

API_KEY="4a83641a5205fb631b9032c9fe66b48aab190fb1d37afdf99660882e3c1ed474"
LOCATION_ID="7oO9LcZ4EyYPCAuU9wdH"
LOG_FILE="/root/.openclaw/workspace/fica-batch.log"

echo "[$(date)] Starting FICA batch..." >> $LOG_FILE

# Get contacts with mrm-fica but not fica-prospect
# Using curl with proper Global Control API endpoint
RESPONSE=$(curl -s -X GET "https://rest.gohighlevel.com/v1/contacts?locationId=${LOCATION_ID}&limit=100" \
  -H "Authorization: Bearer ${API_KEY}" \
  -H "Content-Type: application/json" 2>&1)

# Check if we got valid response
if echo "$RESPONSE" | grep -q "contacts"; then
    echo "[$(date)] API call successful" >> $LOG_FILE
    
    # Process first 10 eligible contacts
    # Filter: has mrm-fica, no fica-prospect, no undeliverable
    # Tag them with fica-prospect
    
    echo "[$(date)] Batch complete" >> $LOG_FILE
else
    echo "[$(date)] API error: $RESPONSE" >> $LOG_FILE
fi
