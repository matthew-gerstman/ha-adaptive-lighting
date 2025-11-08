#!/bin/bash
# Apply Adaptive Lighting to All Color-Temp Lights
# Useful for syncing all lights to current circadian rhythm

set -e

echo "🎨 Applying adaptive lighting to all capable lights..."

# Get current adaptive settings
SIMULATION=$(npm run ha adaptive simulate --json 2>/dev/null)
KELVIN=$(echo $SIMULATION | jq -r '.kelvin')
BRIGHTNESS=$(echo $SIMULATION | jq -r '.brightness')

echo "Current adaptive settings: ${KELVIN}K at ${BRIGHTNESS} brightness"

# Get all color-temp capable lights that are currently on
LIGHTS=$(npm run ha lights list --supports-ct --state on --json 2>/dev/null)
COUNT=$(echo $LIGHTS | jq '. | length')

echo "Found $COUNT color-temp lights currently on"

# Apply to each light
echo $LIGHTS | jq -r '.[].entity_id' | while read LIGHT; do
  echo "  Updating $LIGHT..."
  npm run ha lights set $LIGHT \
    --kelvin $KELVIN \
    --brightness $BRIGHTNESS \
    --transition 3 \
    2>/dev/null || echo "    Failed to update $LIGHT"
done

echo "✅ Adaptive lighting applied to all capable lights!"
