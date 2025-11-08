#!/bin/bash
# Night Mode Automation
# Prepare house for sleep

set -e

echo "🌙 Activating night mode..."

# Turn off most lights
echo "💤 Turning off main lights..."
npm run ha lights batch off \
  --area living_room \
  --transition 5 \
  2>/dev/null || echo "No living room lights to turn off"

# Keep bedroom very dim and warm
echo "🕯️ Setting bedroom night light..."
npm run ha lights on light.bedroom_ceiling \
  --brightness 10 \
  --kelvin 2000 \
  --transition 5 \
  2>/dev/null

# Enable night automation
echo "🤖 Enabling night mode automation..."
npm run ha automation enable automation.night_mode 2>/dev/null || echo "No night mode automation found"

# Disable adaptive lighting for the night
echo "🎨 Pausing adaptive lighting..."
npm run ha adaptive disable --global 2>/dev/null || echo "No global adaptive lighting switch"

echo "✅ Night mode activated. Sleep well!"
