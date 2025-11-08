#!/bin/bash
# Monitor Bedroom Lights
# Watch for state changes and log them

echo "👁️ Monitoring bedroom lights..."
echo "Press Ctrl+C to stop"
echo ""

# Create log file with timestamp
LOGFILE="bedroom-lights-$(date +%Y%m%d-%H%M%S).log"

# Watch bedroom lights and log to file
npm run ha watch lights --area bedroom --interval 2 2>&1 | tee $LOGFILE
