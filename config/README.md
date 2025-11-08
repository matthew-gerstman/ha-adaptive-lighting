# Home Assistant Adaptive Lighting Configuration

## Installation

### 1. Install Adaptive Lighting via HACS

1. Open Home Assistant
2. Go to **HACS** → **Integrations**  
3. Click **Explore & Download Repositories**
4. Search for **"Adaptive Lighting"**
5. Click **Download**
6. **Restart Home Assistant**

### 2. Enable Packages in configuration.yaml

Add this to your `configuration.yaml` if not already present:

```yaml
homeassistant:
  packages: !include_dir_named packages
```

### 3. Copy Configuration Files

Copy `packages/adaptive_lighting.yaml` to your Home Assistant config directory:

```bash
# On your Home Assistant machine
cp adaptive_lighting.yaml /config/packages/
```

Or use the File Editor addon in Home Assistant to create the file.

### 4. Restart Home Assistant

After copying the configuration, restart Home Assistant to load the new settings.

### 5. Enable Zones

After restart, you'll have switches for each zone:
- `switch.adaptive_lighting_kitchen`
- `switch.adaptive_lighting_laundry_room`
- `switch.adaptive_lighting_rec_room`
- `switch.adaptive_lighting_office`
- `switch.adaptive_lighting_living_room`
- `switch.adaptive_lighting_bedroom`

Turn them on to activate adaptive lighting for that zone.

## Testing

**Start with Kitchen** (single light, safest to test):
1. Turn on `switch.adaptive_lighting_kitchen`
2. Turn on your kitchen light
3. Watch it adjust over 1-2 hours
4. Check if the color temperature feels right

**If adjustments needed:**
- Too cool: Lower `max_color_temp` in the YAML
- Too warm: Raise `min_color_temp` in the YAML
- Transitions too fast: Increase `transition` seconds
- Updates too frequent: Increase `interval` seconds

## Configuration Structure

Each zone has these key settings:

- **lights:** List of entity IDs to control
- **min_color_temp:** Warmest temperature (Kelvin)
- **max_color_temp:** Coolest temperature (Kelvin)
- **min_brightness:** Dimmest level (%)
- **max_brightness:** Brightest level (%)
- **transition:** Seconds for smooth changes
- **interval:** Seconds between updates
- **sleep_brightness:** Brightness in sleep mode (%)
- **sleep_color_temp:** Temperature in sleep mode (Kelvin)
- **take_over_control:** Pause when manual changes detected
- **detect_non_ha_changes:** Detect changes from outside HA

## Sleep Mode

Each zone has a sleep mode switch:
- `switch.adaptive_lighting_sleep_mode_kitchen`
- `switch.adaptive_lighting_sleep_mode_bedroom`
- etc.

When enabled:
- Immediately sets lights to `sleep_color_temp` (2000-2200K)
- Dims to `sleep_brightness` (10-30%)
- Perfect for evening wind-down

## Manual Control

Adaptive Lighting automatically detects when you manually change lights:

**Brightness adjustment:**
- Pauses adaptive lighting for 30 minutes
- Then resumes (keeps your brightness preference)

**Color change (xy mode):**
- Stops controlling that light
- Resumes when you switch back to white/color_temp mode

**Turn off zone switch:**
- Stops all automation for that zone
- Lights stay at current settings

## Troubleshooting

**Lights not changing:**
- Check that zone switch is ON
- Verify light is in `color_temp` mode (not `xy`)
- Check HA logs for errors
- Ensure light supports color temperature

**Changes too abrupt:**
- Increase `transition` time (try 60 seconds)
- Increase `interval` (try 120 seconds)

**Wrong color temperature:**
- Adjust `min_color_temp` and `max_color_temp`
- Check your location settings in HA (affects sunrise/sunset)

**Lights turn on unexpectedly:**
- Disable `detect_non_ha_changes` for that zone
- Some lights falsely report state changes

## Customization

See `CUSTOMIZATION.md` for details on:
- Adjusting color temperature curves
- Adding/removing lights from zones
- Creating new zones
- Time-based overrides
- Scene integration

## Support

- [Adaptive Lighting GitHub](https://github.com/basnijholt/adaptive-lighting)
- [Adaptive Lighting Simulator](https://basnijholt.github.io/adaptive-lighting)
- [Home Assistant Community](https://community.home-assistant.io)
