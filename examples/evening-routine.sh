#!/bin/bash
# Evening Routine Automation
# Wind down with warm lighting

set -e

echo "🌆 Starting evening routine..."

# Get evening adaptive lighting settings
SIMULATION=$(npm run ha adaptive simulate --json 2>/dev/null)
KELVIN=$(echo $SIMULATION | jq -r '.kelvin')

echo "Evening color temperature: ${KELVIN}K"

# Living room - warm and cozy
echo "🛋️ Setting living room ambiance..."
npm run ha lights batch on \
  --area living_room \
  --kelvin $KELVIN \
  --brightness 150 \
  --transition 15 \
  2>/dev/null || npm run ha lights on light.living_room_ceiling --kelvin $KELVIN --brightness 150 --transition 15 2>/dev/null

# Activate evening scene if available
echo "🎬 Activating evening scene..."
npm run ha scenes activate scene.evening_relax 2>/dev/null || echo "No evening scene found"

# Dim bedroom for later
echo "🌙 Preparing bedroom..."
npm run ha lights on light.bedroom_ceiling \
  --brightness 30 \
  --kelvin 2200 \
  --transition 10 \
  2>/dev/null

echo "✅ Evening routine complete!"
