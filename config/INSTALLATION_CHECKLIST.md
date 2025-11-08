# Installation Checklist

## Pre-Installation

- [ ] HACS is installed in Home Assistant
- [ ] You have access to Home Assistant configuration files
- [ ] You've read the dry run report (docs/DRY_RUN_REPORT.md)

## Step 1: Install Adaptive Lighting

- [ ] Open HACS in Home Assistant
- [ ] Go to Integrations
- [ ] Click "Explore & Download Repositories"
- [ ] Search for "Adaptive Lighting"
- [ ] Click Download
- [ ] Wait for download to complete
- [ ] Restart Home Assistant
- [ ] Verify integration appears in Settings → Devices & Services

## Step 2: Enable Packages

- [ ] Edit `configuration.yaml`
- [ ] Add or verify this exists:
  ```yaml
  homeassistant:
    packages: !include_dir_named packages
  ```
- [ ] Save the file

## Step 3: Copy Configuration

- [ ] Create `/config/packages/` directory if it doesn't exist
- [ ] Copy `config/packages/adaptive_lighting.yaml` from this repo
- [ ] Place it in `/config/packages/adaptive_lighting.yaml` on your HA system
- [ ] Verify file is readable (check permissions)

## Step 4: Restart Home Assistant

- [ ] Settings → System → Restart
- [ ] Wait for restart to complete
- [ ] Check for errors in Settings → System → Logs
- [ ] Filter logs for "adaptive_lighting"

## Step 5: Verify Switches Created

Check that these switches exist in Developer Tools → States:

**Zone Switches:**
- [ ] `switch.adaptive_lighting_kitchen`
- [ ] `switch.adaptive_lighting_laundry_room`
- [ ] `switch.adaptive_lighting_rec_room`
- [ ] `switch.adaptive_lighting_living_room`
- [ ] `switch.adaptive_lighting_bedroom`
- [ ] `switch.adaptive_lighting_utility`

**Sleep Mode Switches:**
- [ ] `switch.adaptive_lighting_sleep_mode_kitchen`
- [ ] `switch.adaptive_lighting_sleep_mode_laundry_room`
- [ ] `switch.adaptive_lighting_sleep_mode_rec_room`
- [ ] `switch.adaptive_lighting_sleep_mode_living_room`
- [ ] `switch.adaptive_lighting_sleep_mode_bedroom`
- [ ] `switch.adaptive_lighting_sleep_mode_utility`

## Step 6: Test Kitchen Zone (Safest First Test)

- [ ] Turn on `switch.adaptive_lighting_kitchen`
- [ ] Turn on your kitchen light
- [ ] Wait 2 minutes
- [ ] Check light color temperature has been set
- [ ] Watch for 30-60 minutes
- [ ] Observe gradual changes (should be imperceptible)

**If working correctly:**
- Light should be at appropriate temp for current time
- Changes should be smooth (30 second transitions)
- Manual brightness adjustment should pause automation

**If not working:**
- Check HA logs for errors
- Verify kitchen light supports color_temp
- Check switch is actually ON
- See troubleshooting in config/README.md

## Step 7: Enable Other Zones (One at a Time)

Once Kitchen works:

- [ ] Turn on `switch.adaptive_lighting_laundry_room`
- [ ] Test for 1-2 hours
- [ ] Turn on `switch.adaptive_lighting_rec_room`
- [ ] Test for 1-2 hours
- [ ] Turn on `switch.adaptive_lighting_living_room`
- [ ] Test for 1-2 hours
- [ ] Turn on `switch.adaptive_lighting_bedroom`
- [ ] Test overnight
- [ ] Turn on `switch.adaptive_lighting_utility`

## Step 8: Fine-Tune Settings

After 24 hours of testing:

- [ ] Note which lights feel too cool/warm
- [ ] Note which transitions are too fast/slow
- [ ] Note which lights you had to override frequently
- [ ] Report findings (Obvious will adjust config)
- [ ] Copy updated config from GitHub
- [ ] Restart HA with new settings
- [ ] Test again

## Step 9: Add to Dashboard (Optional)

Create a dashboard card for easy control:

```yaml
type: entities
title: Adaptive Lighting
entities:
  - switch.adaptive_lighting_kitchen
  - switch.adaptive_lighting_laundry_room
  - switch.adaptive_lighting_rec_room
  - switch.adaptive_lighting_living_room
  - switch.adaptive_lighting_bedroom
  - switch.adaptive_lighting_sleep_mode_bedroom
```

## Troubleshooting

### No Switches Appear After Restart

- Check HA logs for YAML errors
- Verify `packages: !include_dir_named packages` is in configuration.yaml
- Verify adaptive_lighting.yaml is in /config/packages/
- Check file permissions

### Lights Not Changing

- Verify zone switch is ON
- Check light is ON
- Check light supports color_temp (see analysis/color-temp-capable-lights.csv)
- Look for manual override (light may be marked as manually controlled)
- Check HA logs

### Changes Too Abrupt

- Increase `transition` time in YAML
- Increase `interval` between updates
- Restart HA after changes

### Wrong Color Temperature

- Adjust `min_color_temp` and `max_color_temp` in YAML
- Check your HA location settings (affects sunrise/sunset calculations)
- Restart HA after changes

### Lights Turn On Unexpectedly

- Set `detect_non_ha_changes: false` for that zone
- Some lights falsely report state changes

## Success Criteria

✅ Lights automatically adjust color temp throughout the day  
✅ Transitions are imperceptible (smooth, gradual)  
✅ Manual adjustments are respected (automation pauses)  
✅ Sleep mode works (very warm, dim lighting)  
✅ No unexpected light behavior  
✅ You rarely need to manually adjust color temperature

## Post-Installation

- [ ] All zones enabled and working
- [ ] Color temperature curves feel natural
- [ ] Manual overrides work as expected
- [ ] Sleep mode tested and working
- [ ] Configuration backed up (it's in Git!)
- [ ] Dashboard card created (optional)

## Getting Help

If you encounter issues:
1. Check the troubleshooting section above
2. Review HA logs for errors
3. Check [Adaptive Lighting GitHub Issues](https://github.com/basnijholt/adaptive-lighting/issues)
4. Ask Obvious to adjust the configuration
