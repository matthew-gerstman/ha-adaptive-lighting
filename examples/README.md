# Example Automation Scripts

This directory contains example bash scripts demonstrating how to use the HomeAssistant CLI for common automation tasks.

## Prerequisites

- HomeAssistant CLI installed and configured
- `.env` file with `HASS_BASE_URL` and `HASS_TOKEN`
- `jq` installed for JSON parsing (`sudo apt install jq` or `brew install jq`)

## Scripts

### morning-routine.sh
Gradual wake-up routine with adaptive lighting:
- Starts with dim, warm light
- Gradually increases brightness and coolness
- Prepares bathroom lights
- Enables morning automation

**Usage:**
```bash
./examples/morning-routine.sh
```

### evening-routine.sh
Wind-down routine for evening:
- Sets warm, cozy lighting in living room
- Activates evening scene
- Prepares bedroom for later
- Uses adaptive lighting for color temperature

**Usage:**
```bash
./examples/evening-routine.sh
```

### night-mode.sh
Prepare house for sleep:
- Turns off main living area lights
- Sets bedroom to very dim, warm light
- Enables night mode automation
- Pauses adaptive lighting

**Usage:**
```bash
./examples/night-mode.sh
```

### monitor-bedroom.sh
Real-time monitoring of bedroom lights:
- Watches for state changes
- Logs all changes to timestamped file
- Useful for debugging automations

**Usage:**
```bash
./examples/monitor-bedroom.sh
```

### adaptive-all-lights.sh
Apply adaptive lighting to all capable lights:
- Finds all color-temp capable lights
- Gets current adaptive lighting settings
- Applies to all lights that are on
- Useful for syncing entire house

**Usage:**
```bash
./examples/adaptive-all-lights.sh
```

## Customization

These scripts are templates. Customize them for your setup:

1. Replace entity IDs with your actual entities
2. Adjust timing and transition durations
3. Modify color temperatures and brightness levels
4. Add or remove steps as needed

## Scheduling with Cron

Run these scripts automatically:

```bash
# Edit crontab
crontab -e

# Add entries (adjust paths)
0 7 * * * /path/to/ha-adaptive-lighting/examples/morning-routine.sh
0 20 * * * /path/to/ha-adaptive-lighting/examples/evening-routine.sh
0 22 * * * /path/to/ha-adaptive-lighting/examples/night-mode.sh
```

## Integration with Other Tools

### Home Assistant Automations
Trigger these scripts from HA automations:

```yaml
automation:
  - alias: "Morning Routine"
    trigger:
      - platform: time
        at: "07:00:00"
    action:
      - service: shell_command.morning_routine
```

### Node-RED
Call these scripts from Node-RED exec nodes.

### Systemd Timers
Use systemd timers instead of cron for more control.

## Troubleshooting

If scripts fail:

1. Check connection: `npm run ha info`
2. Verify entity IDs exist: `npm run ha lights list`
3. Test commands individually
4. Check logs for error messages
5. Ensure `jq` is installed

## Contributing

Feel free to add your own example scripts! Submit a PR with:
- Descriptive filename
- Comments explaining what it does
- Error handling
- Documentation in this README
