#!/bin/bash
# HomeAssistant Diagnostics
# Check system health and find issues

set -e

echo "🔍 Running HomeAssistant diagnostics..."
echo ""

# Test connection
echo "📡 Testing connection..."
if npm run ha info 2>/dev/null | grep -q "Version"; then
  echo "  ✅ Connected successfully"
else
  echo "  ❌ Connection failed"
  exit 1
fi

echo ""

# Get statistics
echo "📊 System Statistics:"
npm run ha query stats 2>/dev/null | grep -A 20 "HomeAssistant Statistics"

echo ""

# Find unavailable entities
echo "⚠️ Checking for unavailable entities..."
UNAVAILABLE=$(npm run ha query find --unavailable --json 2>/dev/null)
UNAVAILABLE_COUNT=$(echo $UNAVAILABLE | jq '. | length')

if [ "$UNAVAILABLE_COUNT" -gt "0" ]; then
  echo "  Found $UNAVAILABLE_COUNT unavailable entities:"
  echo $UNAVAILABLE | jq -r '.[].entity_id' | head -10 | while read ENTITY; do
    echo "    - $ENTITY"
  done
  
  if [ "$UNAVAILABLE_COUNT" -gt "10" ]; then
    echo "    ... and $((UNAVAILABLE_COUNT - 10)) more"
  fi
else
  echo "  ✅ All entities available"
fi

echo ""

# Check lights
echo "💡 Light Status:"
LIGHTS_ON=$(npm run ha lights list --state on --json 2>/dev/null | jq '. | length')
LIGHTS_TOTAL=$(npm run ha lights list --json 2>/dev/null | jq '. | length')
echo "  $LIGHTS_ON of $LIGHTS_TOTAL lights are on"

echo ""

# Check automations
echo "🤖 Automation Status:"
AUTOMATIONS=$(npm run ha automation list --json 2>/dev/null)
AUTO_TOTAL=$(echo $AUTOMATIONS | jq '. | length')
AUTO_ENABLED=$(echo $AUTOMATIONS | jq '[.[] | select(.state == "on")] | length')
echo "  $AUTO_ENABLED of $AUTO_TOTAL automations are enabled"

echo ""
echo "✅ Diagnostics complete!"
