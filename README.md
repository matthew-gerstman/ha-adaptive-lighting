# HomeAssistant CLI

A comprehensive TypeScript CLI utility for controlling and managing your HomeAssistant instance. Built for automation, scripting, and agent-driven workflows.

## Features

- 🏠 **Complete HA Control** - Manage lights, entities, automations, and configuration
- 🤖 **Agent-Friendly** - Designed for AI agents and automation scripts
- 📊 **Rich Output** - Human-readable tables or JSON for parsing
- 🎨 **Adaptive Lighting** - Built-in adaptive lighting simulation and control
- ⚡ **Batch Operations** - Control multiple devices with dry-run support
- 🔒 **Safe** - Dry-run mode, validation, and clear error messages
- 👁️ **Real-time Monitoring** - Watch entities for state changes
- 🎬 **Scene & Script Management** - Create and activate scenes, run scripts
- 🔍 **Advanced Queries** - Complex filtering and statistics

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

## Quick Start

```bash
# Verify connection
npm run ha info

# List all lights
npm run ha lights list

# Turn on a light with adaptive settings
npm run ha lights on light.bedroom_ceiling --brightness 128 --kelvin 4000

# Watch for changes
npm run ha watch lights --area bedroom
```

## Commands

### Info Commands

```bash
# Show connection status and instance info
npm run ha info

# List all areas
npm run ha info areas

# List all domains with entity counts
npm run ha info domains
```

### Entity Commands

```bash
# List all entities
npm run ha entities list

# Filter by domain
npm run ha entities list --domain light

# Search by name
npm run ha entities list --search bedroom

# Get detailed entity info with history
npm run ha entities get light.bedroom_ceiling --history 24

# Call a service on an entity
npm run ha entities call light.bedroom_ceiling turn_on --data '{"brightness": 255}'
```

### Light Commands

```bash
# List all lights
npm run ha lights list

# Filter lights
npm run ha lights list --state on
npm run ha lights list --supports-ct
npm run ha lights list --area bedroom

# Get light details
npm run ha lights get light.bedroom_ceiling

# Turn on with options
npm run ha lights on light.bedroom_ceiling --brightness 128 --kelvin 4000 --transition 2

# Turn off with transition
npm run ha lights off light.bedroom_ceiling --transition 1

# Set properties
npm run ha lights set light.bedroom_ceiling --brightness 200 --kelvin 3000
npm run ha lights set light.living_room_lamp --rgb 255,128,0

# Batch operations (ALWAYS dry-run first!)
npm run ha lights batch on --area bedroom --dry-run
npm run ha lights batch on --area bedroom --brightness 150 --kelvin 3500
npm run ha lights batch off --area living_room --transition 2
```

### Scene Commands

```bash
# List all scenes
npm run ha scenes list

# Activate a scene
npm run ha scenes activate scene.movie_time --transition 2

# Create scene from current state
npm run ha scenes create scene.my_scene --entities light.bedroom_ceiling,light.living_room_lamp
```

### Script Commands

```bash
# List all scripts
npm run ha scripts list

# Get script details
npm run ha scripts get script.morning_routine

# Run a script
npm run ha scripts run script.morning_routine

# Run with variables
npm run ha scripts run script.custom --data '{"room": "bedroom", "brightness": 150}'

# Stop a running script
npm run ha scripts stop script.long_running
```

### Automation Commands

```bash
# List all automations
npm run ha automation list

# Get automation details
npm run ha automation get automation.morning_routine

# Enable/disable
npm run ha automation enable automation.morning_routine
npm run ha automation disable automation.night_mode

# Trigger manually
npm run ha automation trigger automation.morning_routine
npm run ha automation trigger automation.test --skip-condition
```

### Config Commands

```bash
# Show configuration
npm run ha config show

# Show specific section
npm run ha config show --section unit_system

# Reload configuration
npm run ha config reload

# Validate configuration
npm run ha config validate
```

### Adaptive Lighting Commands

```bash
# Show status
npm run ha adaptive status

# Enable/disable globally
npm run ha adaptive enable --global
npm run ha adaptive disable --global

# Show light configuration
npm run ha adaptive config light.bedroom_ceiling

# Simulate for current time
npm run ha adaptive simulate

# Simulate for specific date/time
npm run ha adaptive simulate --date "2024-12-25T14:00:00Z"
npm run ha adaptive simulate --light light.bedroom_ceiling
```

### Watch Commands

```bash
# Watch a specific entity
npm run ha watch entity light.bedroom_ceiling

# Watch with custom interval
npm run ha watch entity light.bedroom_ceiling --interval 5

# Watch all lights
npm run ha watch lights

# Watch lights in specific area
npm run ha watch lights --area bedroom --interval 2
```

### Query Commands

```bash
# Find entities with filters
npm run ha query find --domain light --state on
npm run ha query find --name bedroom --unavailable
npm run ha query find --attr area_id=bedroom

# Count entities by domain
npm run ha query count --by domain

# Count by state
npm run ha query count --by state

# Get comprehensive statistics
npm run ha query stats
```

## Agent Usage Guide

### Quick Start for Agents

```bash
# 1. Verify connection
npm run ha info

# 2. Discover environment
npm run ha query stats
npm run ha lights list --supports-ct --json

# 3. Control devices
npm run ha lights on light.bedroom_ceiling --brightness 128 --kelvin 4000

# 4. Monitor changes
npm run ha watch lights --area bedroom
```

### JSON Output for Parsing

All commands support `--json`:

```bash
# Get JSON and parse with jq
npm run ha lights list --json | jq '.[] | select(.state == "on")'
npm run ha entities get light.bedroom_ceiling --json | jq '.attributes'
npm run ha query stats --json | jq '.lights_on'
```

### Common Agent Patterns

**Pattern 1: Discover and Control**
```bash
# Find color-temp capable lights
LIGHTS=$(npm run ha lights list --supports-ct --json)

# Apply adaptive lighting
npm run ha lights batch on --kelvin 3500 --brightness 150
```

**Pattern 2: Monitor and React**
```bash
# Watch for changes (in background)
npm run ha watch lights --area bedroom &

# React to changes in your script
# (parse watch output or poll with query commands)
```

**Pattern 3: Scene Management**
```bash
# Capture current state
npm run ha scenes create scene.current_state --entities light.bedroom_ceiling,light.living_room

# Restore later
npm run ha scenes activate scene.current_state
```

**Pattern 4: Diagnostics**
```bash
# Find problems
npm run ha query find --unavailable

# Get statistics
npm run ha query stats --json

# Count by domain
npm run ha query count --by domain
```

### Error Handling in Scripts

```bash
#!/bin/bash
set -e  # Exit on error

# Test connection
if ! npm run ha info > /dev/null 2>&1; then
  echo "Failed to connect to HomeAssistant"
  exit 1
fi

# Execute with error handling
npm run ha lights batch on --area bedroom || {
  echo "Failed to turn on bedroom lights"
  exit 1
}
```

## Examples

### Morning Routine Script

```bash
#!/bin/bash
# morning.sh

# Simulate adaptive lighting for current time
SIMULATION=$(npm run ha adaptive simulate --json)
KELVIN=$(echo $SIMULATION | jq -r '.kelvin')
BRIGHTNESS=$(echo $SIMULATION | jq -r '.brightness')

# Apply to bedroom
npm run ha lights on light.bedroom_ceiling \
  --kelvin $KELVIN \
  --brightness $BRIGHTNESS \
  --transition 5

# Enable morning automation
npm run ha automation enable automation.morning_routine
```

### Evening Routine Script

```bash
#!/bin/bash
# evening.sh

# Get adaptive lighting settings for evening
SIMULATION=$(npm run ha adaptive simulate --json)
KELVIN=$(echo $SIMULATION | jq -r '.kelvin')

# Apply to living room with warm color
npm run ha lights batch on \
  --area living_room \
  --kelvin $KELVIN \
  --brightness 150 \
  --transition 10

# Activate evening scene
npm run ha scenes activate scene.evening_relax
```

### Night Mode Script

```bash
#!/bin/bash
# night.sh

# Very warm, very dim
npm run ha lights batch on \
  --kelvin 2000 \
  --brightness 20 \
  --transition 5

# Or just turn them all off
# npm run ha lights batch off --transition 10
```

### Monitor and Log Changes

```bash
#!/bin/bash
# monitor.sh

# Watch lights and log to file
npm run ha watch lights --area bedroom 2>&1 | tee bedroom_lights.log
```

## Development

```bash
# Run in development mode with auto-reload
npm run dev

# Build for production
npm run build

# Run built version
npm start

# Run CLI in development
npm run ha -- <command>
```

## Architecture

```
ha-adaptive-lighting/
├── src/
│   ├── cli/
│   │   ├── index.ts           # CLI entry point
│   │   ├── commands/          # Command implementations
│   │   │   ├── info.ts        # Instance info
│   │   │   ├── entities.ts    # Entity management
│   │   │   ├── lights.ts      # Light control
│   │   │   ├── config.ts      # Configuration
│   │   │   ├── automation.ts  # Automations
│   │   │   ├── adaptive.ts    # Adaptive lighting
│   │   │   ├── scenes.ts      # Scene management
│   │   │   ├── watch.ts       # State monitoring
│   │   │   ├── scripts.ts     # Script execution
│   │   │   └── query.ts       # Advanced queries
│   │   └── utils/
│   │       ├── output.ts      # Formatting & display
│   │       ├── ha-client.ts   # HA client singleton
│   │       └── config.ts      # Configuration loading
│   └── lib/
│       ├── ha-api.ts          # HomeAssistant REST API
│       ├── types.ts           # TypeScript types
│       └── validators.ts      # Input validation
├── bin/
│   └── ha                     # Executable script
└── package.json
```

## Command Reference

| Command | Description |
|---------|-------------|
| `ha info` | Instance information and connection status |
| `ha entities` | Query and manage entities |
| `ha lights` | Control lights with advanced options |
| `ha scenes` | Manage and activate scenes |
| `ha scripts` | Execute and manage scripts |
| `ha automation` | Control automations |
| `ha config` | View and reload configuration |
| `ha adaptive` | Adaptive lighting control |
| `ha watch` | Monitor entity state changes |
| `ha query` | Advanced filtering and statistics |

## Troubleshooting

### Connection Issues

```bash
# Test connection
npm run ha info

# Check .env file
cat .env

# Verify HA is accessible
curl http://homeassistant.local:8123/api/ -H "Authorization: Bearer YOUR_TOKEN"
```

### Token Issues

- Ensure token hasn't expired
- Generate new long-lived access token
- Check token permissions in HomeAssistant

### Command Not Found

```bash
# Ensure you're in project directory
pwd

# Install dependencies
npm install

# Use npm run ha instead of just ha
npm run ha -- --help
```

### Dry-run Not Working

```bash
# Ensure you're using the correct syntax
npm run ha lights batch on --area bedroom --dry-run

# Not: npm run ha --dry-run lights batch on
```

## API Reference

### HomeAssistantAPI Class

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

// Get areas
const areas = await client.getAreas();

// Call any service
await client.callService('light', 'turn_on', {
  entity_id: 'light.bedroom_ceiling',
  brightness: 255
});
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## License

MIT

## Acknowledgments

- Built for [HomeAssistant](https://www.home-assistant.io/)
- Designed for AI agent workflows
- TypeScript for type safety and developer experience

---

**For Agents:** This CLI provides complete HomeAssistant control via REST API. All commands support `--json` output. Use `--dry-run` for batch operations. Start with `npm run ha info` to verify connection, then explore with `npm run ha query stats`.
