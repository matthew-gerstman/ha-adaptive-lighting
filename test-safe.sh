#!/bin/bash
# Safe testing script - reads then writes same values

set -e

echo "🧪 Safe API Testing - No State Changes"
echo "========================================"
echo ""

# Enable API logging
export LOG_API_CALLS=true

# Test 1: Get light state
echo "1. Reading light.bedroom_ceiling state..."
LIGHT_DATA=$(npm run ha lights get light.bedroom_ceiling --json 2>&1 | grep -A 999 "^{" | head -100)
echo "   Current state retrieved ✓"

# Extract current values
BRIGHTNESS=$(echo "$LIGHT_DATA" | jq -r '.attributes.brightness // 255')
KELVIN=$(echo "$LIGHT_DATA" | jq -r '.attributes.color_temp_kelvin // 3000')
STATE=$(echo "$LIGHT_DATA" | jq -r '.state')

echo "   State: $STATE"
echo "   Brightness: $BRIGHTNESS"
echo "   Kelvin: $KELVIN"
echo ""

# Test 2: Set to SAME values (no actual change)
if [ "$STATE" == "on" ]; then
  echo "2. Setting light.bedroom_ceiling to SAME values..."
  npm run ha lights set light.bedroom_ceiling --brightness $BRIGHTNESS --kelvin $KELVIN 2>&1 | tail -3
  echo "   ✓ Set completed (no visible change)"
else
  echo "2. Light is off, skipping set test"
fi

echo ""

# Test 3: Get stats (read-only)
echo "3. Getting statistics (read-only)..."
npm run ha query stats 2>&1 | grep -A 15 "HomeAssistant Statistics"

echo ""
echo "✅ Safe testing complete - no state changes made"
