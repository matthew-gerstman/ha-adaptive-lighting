# Customizing Your Adaptive Lighting

## Adjusting Color Temperature Curves

### Make It Warmer Overall

If lights feel too cool, lower the `max_color_temp`:

```yaml
adaptive_lighting:
  - name: "Kitchen"
    max_color_temp: 4500  # Instead of 5500
```

### Make It Cooler Overall

If lights feel too warm, raise the `min_color_temp`:

```yaml
adaptive_lighting:
  - name: "Bedroom"
    min_color_temp: 3000  # Instead of 2500
```

### Adjust Midday Peak

The `max_color_temp` controls the coolest temperature at solar noon:
- **5500K+** - Very cool, clinical (HomeKit default)
- **4500-5000K** - Cool, alert (recommended for you)
- **4000K** - Neutral cool
- **3500K** - Warm neutral

### Adjust Evening/Morning

The `min_color_temp` controls the warmest temperature at sunrise/sunset:
- **2000-2200K** - Very warm, amber (sleep-friendly)
- **2500-2700K** - Warm white (comfortable)
- **3000K** - Neutral warm

## Adjusting Transitions

### Slower, More Subtle

If changes are too noticeable:

```yaml
transition: 60  # Seconds for each change (default: 30)
interval: 120   # Seconds between updates (default: 60)
```

### Faster, More Responsive

If you want quicker adaptation:

```yaml
transition: 15  # Faster changes
interval: 30    # More frequent updates
```

## Adjusting Brightness

### Dimmer at Night

```yaml
min_brightness: 10  # Very dim (default: 20-30)
sleep_brightness: 5  # Extremely dim for sleep
```

### Brighter Overall

```yaml
min_brightness: 50  # Never go below 50%
max_brightness: 100
```

### Disable Brightness Adaptation

If you only want color temp changes, not brightness:

```yaml
adapt_brightness: false  # Only adapt color, not brightness
```

## Adding/Removing Lights

### Add a Light to a Zone

```yaml
adaptive_lighting:
  - name: "Kitchen"
    lights:
      - light.kitchen
      - light.dining_room  # Add this light
```

### Remove a Light from a Zone

Just delete it from the lights list.

### Move a Light to Different Zone

Remove from one zone's lights list, add to another.

## Creating a New Zone

```yaml
adaptive_lighting:
  # ... existing zones ...
  
  - name: "Hallway"
    lights:
      - light.hallway_1
      - light.hallway_2
    min_color_temp: 2700
    max_color_temp: 4500
    transition: 30
    interval: 60
    take_over_control: true
```

## Room-Specific Customizations

### Kitchen: Cooler During Meal Times

Use automations to temporarily boost color temp:

```yaml
automation:
  - alias: "Kitchen Cooler During Dinner"
    trigger:
      - platform: time
        at: "17:30:00"
    action:
      - service: adaptive_lighting.change_switch_settings
        data:
          entity_id: switch.adaptive_lighting_kitchen
          max_color_temp: 6000  # Extra cool for cooking
```

### Bedroom: Auto Sleep Mode at 10 PM

```yaml
automation:
  - alias: "Enable Bedroom Sleep Mode"
    trigger:
      - platform: time
        at: "22:00:00"
    action:
      - service: switch.turn_on
        target:
          entity_id: switch.adaptive_lighting_sleep_mode_bedroom
```

### Office: Only Adaptive During Work Hours

```yaml
automation:
  - alias: "Office Adaptive Work Hours Only"
    trigger:
      - platform: time
        at: "09:00:00"
    action:
      - service: switch.turn_on
        target:
          entity_id: switch.adaptive_lighting_office
  
  - alias: "Office Adaptive Off After Work"
    trigger:
      - platform: time
        at: "18:00:00"
    action:
      - service: switch.turn_off
        target:
          entity_id: switch.adaptive_lighting_office
```

## Excluding Lights from Adaptive Control

If a light is currently in a zone but you want it excluded:

### Option 1: Remove from Configuration

Delete the entity from the `lights:` list in YAML.

### Option 2: Mark as Manually Controlled

Use the service call:

```yaml
service: adaptive_lighting.set_manual_control
data:
  entity_id: switch.adaptive_lighting_living_room
  lights:
    - light.rose_lamp
  manual_control: true
```

This light will be skipped until you reset it or turn it off/on.

### Option 3: Turn Off Detect Changes

For lights that should be adaptive but you occasionally color:

```yaml
adaptive_lighting:
  - name: "Living Room"
    detect_non_ha_changes: false  # Won't detect manual color changes
```

## Advanced: Custom Brightness Curves

### Linear Brightness

Default is linear (straight line from min to max):

```yaml
brightness_mode: "linear"
```

### Tanh Brightness (S-curve)

Gentler transitions at extremes:

```yaml
brightness_mode: "tanh"
brightness_mode_time_dark: 900   # Seconds after sunset
brightness_mode_time_light: 3600  # Seconds after sunrise
```

## Scene Integration

Pause adaptive lighting when certain scenes are active:

```yaml
automation:
  - alias: "Pause Adaptive for Movie Scene"
    trigger:
      - platform: state
        entity_id: scene.movie_time
    action:
      - service: switch.turn_off
        target:
          entity_id: switch.adaptive_lighting_living_room
```

## Debugging

### Check Current Settings

Look at switch attributes in Developer Tools → States:
- `switch.adaptive_lighting_kitchen`
- Attributes show current calculated color temp and brightness

### View Logs

Settings → System → Logs, filter for "adaptive_lighting"

### Test Specific Time

Use the `adaptive_lighting.apply` service to test a specific time:

```yaml
service: adaptive_lighting.apply
data:
  entity_id: switch.adaptive_lighting_kitchen
  lights:
    - light.kitchen
  turn_on_lights: true
```

## Working with Obvious

To adjust your configuration:
1. Describe what feels wrong ("too cool at night", "too bright in morning")
2. Obvious updates the YAML in GitHub
3. You pull changes and copy to HA
4. Restart and test
5. Repeat until perfect

All configuration is version-controlled in Git, so you can always roll back if needed.
