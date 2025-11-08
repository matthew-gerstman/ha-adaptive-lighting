#!/bin/bash
# Morning Routine Automation
# Gradually wake up with adaptive lighting

set -e

echo "🌅 Starting morning routine..."

# Get current adaptive lighting settings
SIMULATION=$(npm run ha adaptive simulate --json 2>/dev/null)
KELVIN=$(echo $SIMULATION | jq -r '.kelvin')
BRIGHTNESS=$(echo $SIMULATION | jq -r '.brightness')

echo "Adaptive settings: ${KELVIN}K at ${BRIGHTNESS} brightness"

# Bedroom lights - gradual wake up
echo "💡 Turning on bedroom lights..."
npm run ha lights on light.bedroom_ceiling \
  --brightness 50 \
  --kelvin 2500 \
  --transition 10 \
  2>/dev/null

# Wait a bit
sleep 5

# Increase brightness
echo "☀️ Increasing brightness..."
npm run ha lights set light.bedroom_ceiling \
  --brightness $BRIGHTNESS \
  --kelvin $KELVIN \
  --transition 20 \
  2>/dev/null

# Turn on bathroom lights
echo "🚿 Preparing bathroom..."
npm run ha lights on light.bathroom_ceiling \
  --brightness 200 \
  --kelvin 4000 \
  2>/dev/null

# Enable morning automation
echo "🤖 Enabling morning automation..."
npm run ha automation enable automation.morning_routine 2>/dev/null || echo "No morning automation found"

echo "✅ Morning routine complete!"
