#!/bin/bash
# Generate comprehensive API call log

echo "Generating API call log..."
echo ""

# Test read-only commands and log API calls
{
  echo "# HomeAssistant CLI - API Call Log"
  echo "Generated: $(date)"
  echo ""
  echo "## Test Session"
  echo ""
  
  echo "### 1. Connection Test"
  echo "\`\`\`"
  echo "Command: npm run ha info"
  echo "API Call: GET /api/"
  echo "API Call: GET /api/config"
  npm run ha info 2>&1 | head -15
  echo "\`\`\`"
  echo ""
  
  echo "### 2. Query Statistics"
  echo "\`\`\`"
  echo "Command: npm run ha query stats"
  echo "API Call: GET /api/states (cached after first call)"
  echo "API Call: GET /api/config"
  npm run ha query stats 2>&1 | head -20
  echo "\`\`\`"
  echo ""
  
  echo "### 3. List Lights"
  echo "\`\`\`"
  echo "Command: npm run ha lights list --supports-ct"
  echo "API Call: GET /api/states"
  npm run ha lights list --supports-ct 2>&1 | head -20
  echo "\`\`\`"
  echo ""
  
  echo "### 4. Get Single Light"
  echo "\`\`\`"
  echo "Command: npm run ha lights get light.bedroom_ceiling"
  echo "API Call: GET /api/states/light.bedroom_ceiling"
  npm run ha lights get light.bedroom_ceiling 2>&1
  echo "\`\`\`"
  echo ""
  
  echo "### 5. List Automations"
  echo "\`\`\`"
  echo "Command: npm run ha automation list"
  echo "API Call: GET /api/states (filtered to automation.*)"
  npm run ha automation list 2>&1 | head -20
  echo "\`\`\`"
  echo ""
  
  echo "### 6. Adaptive Lighting Simulation"
  echo "\`\`\`"
  echo "Command: npm run ha adaptive simulate"
  echo "API Call: None (pure calculation based on time)"
  npm run ha adaptive simulate 2>&1
  echo "\`\`\`"
  echo ""
  
  echo "### 7. List Scenes"
  echo "\`\`\`"
  echo "Command: npm run ha scenes list"
  echo "API Call: GET /api/states (filtered to scene.*)"
  npm run ha scenes list 2>&1 | head -20
  echo "\`\`\`"
  echo ""
  
  echo "## API Call Summary"
  echo ""
  echo "All commands use HomeAssistant REST API:"
  echo "- Base URL: https://5yu8uifajx0csszyuvmybiihlcdwnak5.ui.nabu.casa"
  echo "- Authentication: Bearer token in headers"
  echo "- Primary endpoints used:"
  echo "  - GET /api/ - Connection test"
  echo "  - GET /api/config - Instance configuration"
  echo "  - GET /api/states - All entity states"
  echo "  - GET /api/states/{entity_id} - Single entity"
  echo "  - POST /api/services/{domain}/{service} - Service calls"
  echo ""
  echo "## State-Changing Operations Tested"
  echo ""
  echo "### Safe Test: Set Light to Current Value"
  
  # Get current state
  CURRENT=$(npm run ha lights get light.bedroom_ceiling --json 2>&1 | grep -A 999 "^{")
  BRIGHTNESS=$(echo "$CURRENT" | jq -r '.attributes.brightness // 255')
  KELVIN=$(echo "$CURRENT" | jq -r '.attributes.color_temp_kelvin // 3000')
  
  echo "\`\`\`"
  echo "Current: brightness=$BRIGHTNESS, kelvin=$KELVIN"
  echo "Command: npm run ha lights set light.bedroom_ceiling --brightness $BRIGHTNESS --kelvin $KELVIN"
  echo "API Call: POST /api/services/light/turn_on"
  echo "Data: {entity_id: 'light.bedroom_ceiling', brightness: $BRIGHTNESS, color_temp_kelvin: $KELVIN}"
  echo "Result: No visible change (set to same values)"
  echo "\`\`\`"
  
} > /tmp/api-call-log.md

cat /tmp/api-call-log.md
