# HomeAssistant CLI

A comprehensive TypeScript CLI utility for controlling and managing your HomeAssistant instance. Built for automation, scripting, and agent-driven workflows.

## Features

- 🏠 **Complete HA Control** - Manage lights, entities, automations, and configuration
- 🤖 **Agent-Friendly** - Designed for AI agents and automation scripts
- 📊 **Rich Output** - Human-readable tables or JSON for parsing
- 🎨 **Adaptive Lighting** - Built-in adaptive lighting simulation and control
- ⚡ **Batch Operations** - Control multiple devices with dry-run support
- 🔒 **Safe** - Dry-run mode, validation, and clear error messages

## Installation

```bash
# Clone the repository
git clone https://github.com/matthew-gerstman/ha-adaptive-lighting.git
cd ha-adaptive-lighting

# Install dependencies
npm install

# Build (optional, for production)
npm run build
```

## Configuration

Create a `.env` file in the project root:

```bash
HASS_BASE_URL=http://homeassistant.local:8123
HASS_TOKEN=your_long_lived_access_token
```

### Getting a Long-Lived Access Token

1. Open your HomeAssistant instance
2. Click on your profile (bottom left)
3. Scroll to "Long-Lived Access Tokens"
4. Click "Create Token"
5. Give it a name (e.g., "CLI Access")
6. Copy the token to your `.env` file

### Optional Configuration File

Create `ha-cli.config.json` for additional settings:

```json
{
  "defaults": {
    "transition": 1,
    "outputFormat": "table"
  },
  "aliases": {
    "bedroom": "light.bedroom_ceiling",
    "living": "light.living_room_ceiling"
  }
}
```

## Usage

```bash
# Run commands
npm run ha -- <command> [options]

# Or after building
node dist/cli/index.js <command> [options]
```

## Commands

### Info Commands

Get information about your HomeAssistant instance:

```bash
# Show connection status and instance info
npm run ha info

# List all areas
npm run ha info areas

# List all domains with entity counts
npm run ha info domains
```

### Entity Commands

Query and manage entities:

```bash
# List all entities
npm run ha entities list

# Filter by domain
npm run ha entities list --domain light

# Search by name
npm run ha entities list --search bedroom

# Get detailed entity info
npm run ha entities get light.bedroom_ceiling

# Get entity with history
npm run ha entities get light.bedroom_ceiling --history 24

# Call a service on an entity
npm run ha entities call light.bedroom_ceiling turn_on --data '{"brightness": 255}'

# JSON output for parsing
npm run ha entities list --json
```

### Light Commands

Control lights with advanced options:

```bash
# List all lights
npm run ha lights list

# Filter lights
npm run ha lights list --state on
npm run ha lights list --supports-ct
npm run ha lights list --area bedroom

# Get light details
npm run ha lights get light.bedroom_ceiling

# Turn on a light
npm run ha lights on light.bedroom_ceiling

# Turn on with options
npm run ha lights on light.bedroom_ceiling --brightness 128 --kelvin 4000 --transition 2

# Turn off a light
npm run ha lights off light.bedroom_ceiling --transition 1

# Set light properties
npm run ha lights set light.bedroom_ceiling --brightness 200 --kelvin 3000

# Set RGB color
npm run ha lights set light.living_room_lamp --rgb 255,128,0

# Batch operations (DRY RUN FIRST!)
npm run ha lights batch on --area bedroom --dry-run
npm run ha lights batch on --area bedroom --brightness 150 --kelvin 3500

# Batch turn off with transition
npm run ha lights batch off --area living_room --transition 2
```

### Config Commands

Manage HomeAssistant configuration:

```bash
# Show configuration
npm run ha config show

# Show specific section
npm run ha config show --section unit_system

# Reload configuration
npm run ha config reload

# Validate configuration
npm run ha config validate

# Backup information
npm run ha config backup
```

### Automation Commands

Manage automations:

```bash
# List all automations
npm run ha automation list

# Get automation details
npm run ha automation get automation.morning_routine

# Enable an automation
npm run ha automation enable automation.morning_routine

# Disable an automation
npm run ha automation disable automation.night_mode

# Trigger an automation
npm run ha automation trigger automation.morning_routine

# Trigger with custom data
npm run ha automation trigger automation.custom --data '{"room": "bedroom"}'

# Skip conditions when triggering
npm run ha automation trigger automation.test --skip-condition
```

### Adaptive Lighting Commands

Control adaptive lighting:

```bash
# Show adaptive lighting status
npm run ha adaptive status

# Enable globally
npm run ha adaptive enable --global

# Disable globally
npm run ha adaptive disable --global

# Show light configuration
npm run ha adaptive config light.bedroom_ceiling

# Simulate adaptive lighting for current time
npm run ha adaptive simulate

# Simulate for specific date/time
npm run ha adaptive simulate --date "2024-12-25T14:00:00Z"

# Simulate for specific light
npm run ha adaptive simulate --light light.bedroom_ceiling
```

## Agent Usage Guide

This CLI is designed to be used by AI agents and automation scripts. Here's how to get started:

### Quick Start for Agents

```bash
# 1. Verify connection
npm run ha info

# 2. Discover available lights
npm run ha lights list --supports-ct --json

# 3. Control a light
npm run ha lights on light.bedroom_ceiling --brightness 128 --kelvin 4000

# 4. Batch operations (always dry-run first!)
npm run ha lights batch on --area bedroom --dry-run
npm run ha lights batch on --area bedroom
```

### JSON Output for Parsing

All commands support `--json` for machine-readable output:

```bash
# Get JSON output
npm run ha lights list --json | jq '.[] | select(.state == "on")'

# Parse entity data
npm run ha entities get light.bedroom_ceiling --json | jq '.attributes'

# Filter lights by capability
npm run ha lights list --json | jq '.[] | select(.attributes.supported_color_modes | contains(["color_temp"]))'
```

### Common Agent Patterns

**Pattern 1: Discover and Control**
```bash
# Find all lights in a room
npm run ha lights list --area bedroom --json > bedroom_lights.json

# Turn them all on with adaptive lighting
npm run ha lights batch on --area bedroom --kelvin 3500 --brightness 150
```

**Pattern 2: Check Status Before Action**
```bash
# Get current state
STATE=$(npm run ha entities get light.bedroom_ceiling --json | jq -r '.state')

# Take action based on state
if [ "$STATE" == "off" ]; then
  npm run ha lights on light.bedroom_ceiling
fi
```

**Pattern 3: Simulate Then Apply**
```bash
# Simulate adaptive lighting
SIMULATION=$(npm run ha adaptive simulate --json)
KELVIN=$(echo $SIMULATION | jq -r '.kelvin')
BRIGHTNESS=$(echo $SIMULATION | jq -r '.brightness')

# Apply to lights
npm run ha lights set light.bedroom_ceiling --kelvin $KELVIN --brightness $BRIGHTNESS
```

### Error Handling

The CLI exits with non-zero status codes on errors:

```bash
# Check for errors in scripts
if ! npm run ha info; then
  echo "Failed to connect to HomeAssistant"
  exit 1
fi
```

### Batch Operations Safety

Always use `--dry-run` first:

```bash
# 1. Dry run to see what will happen
npm run ha lights batch off --area living_room --dry-run

# 2. Review the output

# 3. Execute if correct
npm run ha lights batch off --area living_room
```

## Examples

### Morning Routine

```bash
#!/bin/bash
# Turn on bedroom lights with warm color
npm run ha lights on light.bedroom_ceiling --brightness 100 --kelvin 2700 --transition 5

# Enable morning automation
npm run ha automation enable automation.morning_routine
```

### Evening Routine

```bash
#!/bin/bash
# Simulate adaptive lighting for evening
SIMULATION=$(npm run ha adaptive simulate --json)
KELVIN=$(echo $SIMULATION | jq -r '.kelvin')

# Apply to all lights
npm run ha lights batch on --area living_room --kelvin $KELVIN --brightness 150 --transition 10
```

### Night Mode

```bash
#!/bin/bash
# Dim all lights to warm color
npm run ha lights batch on --kelvin 2000 --brightness 20 --transition 5

# Or turn them all off
npm run ha lights batch off --transition 10
```

## Development

```bash
# Run in development mode with auto-reload
npm run dev

# Build for production
npm run build

# Run built version
npm start
```

## Architecture

```
ha-adaptive-lighting/
├── src/
│   ├── cli/
│   │   ├── index.ts           # CLI entry point
│   │   ├── commands/          # Command implementations
│   │   │   ├── info.ts
│   │   │   ├── entities.ts
│   │   │   ├── lights.ts
│   │   │   ├── config.ts
│   │   │   ├── automation.ts
│   │   │   └── adaptive.ts
│   │   └── utils/             # CLI utilities
│   │       ├── output.ts      # Formatting & display
│   │       ├── ha-client.ts   # HA client singleton
│   │       └── config.ts      # Configuration loading
│   └── lib/                   # Core library
│       ├── ha-api.ts          # HomeAssistant REST API
│       └── types.ts           # TypeScript types
├── bin/
│   └── ha                     # Executable script
└── package.json
```

## API Reference

### HomeAssistantAPI Class

The core API wrapper for HomeAssistant:

```typescript
import { HomeAssistantAPI } from './lib/ha-api.js';

const client = new HomeAssistantAPI({
  baseUrl: 'http://homeassistant.local:8123',
  token: 'your_token_here'
});

// Test connection
await client.testConnection();

// Get all entities
const states = await client.getStates();

// Control a light
await client.turnOnLight('light.bedroom_ceiling', {
  brightness: 128,
  kelvin: 4000,
  transition: 2
});
```

## Troubleshooting

### Connection Issues

```bash
# Test connection
npm run ha info

# Check your .env file
cat .env

# Verify HA is accessible
curl http://homeassistant.local:8123/api/ -H "Authorization: Bearer YOUR_TOKEN"
```

### Token Issues

- Ensure your token hasn't expired
- Generate a new long-lived access token
- Check token permissions in HomeAssistant

### Command Not Found

```bash
# Make sure you're in the project directory
pwd

# Install dependencies
npm install

# Use npm run ha instead of just ha
npm run ha -- --help
```

## Contributing

This is a personal project, but suggestions and improvements are welcome!

## License

MIT

## Acknowledgments

- Built for use with [HomeAssistant](https://www.home-assistant.io/)
- Designed for AI agent workflows and automation
- Inspired by the need for better CLI control of smart homes

---

**For Agents:** This CLI provides complete control over HomeAssistant via REST API. All commands support `--json` output for parsing. Use `--dry-run` for batch operations. Always verify connection with `npm run ha info` before starting work.
