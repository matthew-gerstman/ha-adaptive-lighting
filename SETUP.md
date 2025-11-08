# Setup Guide

## Prerequisites

- Home Assistant Green (or any HA installation)
- Node.js 20+ installed on your development machine
- Git installed

## Installation

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd ha-adaptive-lighting
\`\`\`

### 2. Install Dependencies

\`\`\`bash
# Using yarn (recommended)
yarn install

# Or using npm
npm install
\`\`\`

### 3. Configure Home Assistant Connection

1. Create a \`.env\` file from the example:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

2. Get your Home Assistant URL:
   - Usually \`http://homeassistant.local:8123\`
   - Or \`http://[YOUR_HA_IP]:8123\`

3. Generate a Long-Lived Access Token:
   - Open Home Assistant
   - Click your profile (bottom left)
   - Scroll to "Long-Lived Access Tokens"
   - Click "Create Token"
   - Name it "Adaptive Lighting" or similar
   - Copy the token

4. Edit \`.env\` and add your credentials:
   \`\`\`env
   HASS_BASE_URL=http://homeassistant.local:8123
   HASS_TOKEN=your_token_here
   \`\`\`

### 4. Install Synapse Custom Component (Required)

This project uses Digital Alchemy's Synapse to create virtual entities in Home Assistant.

1. Install via HACS:
   - Open HACS in Home Assistant
   - Click the menu (top right) → "Custom repositories"
   - Add: \`https://github.com/Digital-Alchemy-TS/synapse-extension\`
   - Category: Integration
   - Click "Add"
   - Find "Digital Alchemy Synapse" and install
   - Restart Home Assistant

2. Or install manually:
   - Download the [latest release](https://github.com/Digital-Alchemy-TS/synapse-extension/releases)
   - Extract to \`config/custom_components/synapse/\`
   - Restart Home Assistant

### 5. Generate Type Definitions

This creates TypeScript types matching your exact Home Assistant setup:

\`\`\`bash
npx type-writer
\`\`\`

This will:
- Connect to your Home Assistant
- Scan all entities and services
- Generate \`types/home-assistant.ts\`
- Give you autocomplete for YOUR specific setup

### 6. Start Development Server

\`\`\`bash
yarn dev
\`\`\`

You should see:
- Connection established to Home Assistant
- Synapse integration registered
- Adaptive lighting service started
- Virtual switches and sensors created

### 7. Register in Home Assistant

1. Go to Settings → Devices & Services
2. Click "+ Add Integration"
3. Search for "Digital Alchemy"
4. Select your application from the list
5. Click "Submit"

You should now see:
- \`switch.adaptive_lighting_master\` - Turn adaptive lighting on/off
- \`switch.adaptive_lighting_sleep_mode\` - Enable sleep mode (warmer temps)
- \`sensor.current_color_temperature\` - Current calculated color temp
- \`sensor.solar_elevation\` - Current sun position
- \`sensor.adaptive_lights_count\` - Number of compatible lights

## Customization

### Adjust Color Temperature Curve

Edit \`.env\` to customize temperatures:

\`\`\`env
SUNRISE_TEMP=2700
MIDDAY_TEMP=5500
SUNSET_TEMP=2700
TRANSITION_DURATION=30
\`\`\`

### Exclude Specific Lights

Edit \`src/services/adaptive-lighting.ts\` and modify \`getAdaptiveLights()\`:

\`\`\`typescript
function getAdaptiveLights() {
  return hass.refBy.domain("light").filter(light => {
    // Exclude specific lights
    if (light.entity_id === "light.bedroom_reading_lamp") {
      return false;
    }
    
    const features = light.attributes.supported_color_modes || [];
    return features.includes("color_temp");
  });
}
\`\`\`

### Per-Room Configuration

You can create separate services for different rooms with different curves. See the Digital Alchemy documentation for examples.

## Troubleshooting

### Connection Issues

- Verify \`HASS_BASE_URL\` is correct and accessible
- Check token is valid (regenerate if needed)
- Ensure Home Assistant API is enabled

### No Lights Updating

- Check that lights support color temperature
- Verify \`switch.adaptive_lighting_master\` is ON
- Look for manual override timeouts (30 min default)
- Check logs: lights may be in manual override mode

### Type Generation Fails

- Ensure Home Assistant is accessible
- Verify token has correct permissions
- Try running \`npx type-writer\` again

### Synapse Integration Not Found

- Confirm Synapse custom component is installed
- Restart Home Assistant after installation
- Check Home Assistant logs for errors

## Development Workflow

1. Make changes to \`src/services/adaptive-lighting.ts\`
2. Save (hot reload applies changes automatically)
3. Test in Home Assistant
4. Commit to Git when satisfied

## Production Deployment

### Option 1: Run as Systemd Service

Create \`/etc/systemd/system/ha-adaptive-lighting.service\`:

\`\`\`ini
[Unit]
Description=Home Assistant Adaptive Lighting
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/ha-adaptive-lighting
ExecStart=/usr/bin/node dist/index.js
Restart=always

[Install]
WantedBy=multi-user.target
\`\`\`

Then:
\`\`\`bash
yarn build
sudo systemctl enable ha-adaptive-lighting
sudo systemctl start ha-adaptive-lighting
\`\`\`

### Option 2: Docker Container

\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["node", "dist/index.js"]
\`\`\`

### Option 3: Home Assistant Addon

See Digital Alchemy's HAOS template for running inside Home Assistant OS.

## Support

- [Digital Alchemy Docs](https://docs.digital-alchemy.app)
- [GitHub Issues](your-repo-url/issues)
- [Home Assistant Community](https://community.home-assistant.io)
