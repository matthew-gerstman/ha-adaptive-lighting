# Adaptive Lighting Implementation Plan

## Setup Analysis

**Total Lights:** 66 entities  
**Color Temp Capable:** 36 lights (55%)  
**Brightness Only:** 30 lights (45%)

### Key Findings

1. **Excellent Hue Coverage**: All your Hue bulbs support color temp (2000-6535K range)
2. **Current State Issue**: Many lights are in `xy` (color) mode instead of `color_temp` mode
3. **Room Distribution**: Good coverage across Bedroom, Living Room, Kitchen, Office, Rec Room, Laundry
4. **Filament Bulbs**: Brightness-only (decorative, won't support adaptive lighting)

---

## The Challenge

**Problem:** You have 36 lights that CAN do adaptive lighting, but many are currently set to `xy` color mode instead of `color_temp` mode. This means they're showing specific RGB colors rather than white color temperatures.

**Solution:** We need to:
1. Switch all capable lights from `xy` → `color_temp` mode
2. Apply circadian color temperature curve
3. Respect manual overrides when you set specific colors

---

## Adaptive Lighting Strategy

### Tier 1: Primary Living Spaces (Always Adaptive)
These should ALWAYS follow the circadian curve:

- **Kitchen** (1 light) - Task lighting, needs cool white during day
- **Laundry Room** (8 lights) - Utility space, consistent color temp
- **Rec Room** (7 ceiling spots) - Multi-use space, benefits from adaptive
- **Office** (1 light) - Productivity space, cool during work hours

**Total: 17 lights**

### Tier 2: Ambient/Mood Spaces (Conditional Adaptive)
These should be adaptive UNLESS you manually set a color for ambiance:

- **Living Room** (2 lights: ceiling + TV lights)
- **Bedroom** (3 lights: ceiling + TV lights + group)
- **Hydra Lamp** (4-head lamp, currently at 4348K)

**Total: 9 lights**

### Tier 3: Accent/Decorative (Manual Control)
These are for aesthetic purposes and should NOT be adaptive:

- **Rose Lamp** (4 bulbs) - Currently in xy mode, likely for color
- **Hue Play** lights (6 lights) - Accent lighting, often colored
- **Hue Bloom** (2 lights) - Decorative accent
- **Japanese Lamp** - Decorative
- **Owl Lamp** - Decorative  
- **Pixar lamps** - Decorative
- **Outdoor Lightstrips** (3) - Decorative/seasonal

**Total: ~20 lights - EXCLUDE from adaptive lighting**

### Tier 4: Brightness-Only (Not Capable)
Cannot do adaptive lighting:

- All Filament bulbs
- Guest room ceiling
- Dining chandelier
- Edison lamps
- Monkey lights

**Total: 30 lights - Not capable**

---

## Implementation Approach

### Phase 1: Core Adaptive Lighting

**Target:** Tier 1 lights (Kitchen, Laundry, Rec Room, Office)

```typescript
// Always adaptive, no color mode conflicts
const alwaysAdaptiveLights = [
  "light.kitchen",
  "light.laundry_room",
  "light.rec_room", 
  "light.office",
  "light.laundry_room_ceiling",
  // ... all laundry ceiling spots
  // ... all rec ceiling spots
];
```

**Behavior:**
- Update every 60 seconds
- Smooth 30-second transitions
- Color temp curve: 2700K (sunrise) → 5500K (midday) → 2700K (sunset) → 2200K (night)
- Brightness: 30% (night) → 100% (day)
- Manual override: 30min timeout, then resume

### Phase 2: Smart Conditional Adaptive

**Target:** Tier 2 lights (Living Room, Bedroom)

```typescript
// Adaptive ONLY when in color_temp mode
// If user sets xy color, respect it indefinitely
const conditionalAdaptiveLights = [
  "light.living_room",
  "light.living_room_tv_lights",
  "light.bedroom",
  "light.bedroom_ceiling",
  "light.bedroom_tv_lights",
  "light.hydra_lamp",
];
```

**Behavior:**
- Check current color_mode before updating
- If `color_mode === "xy"`, skip (user wants specific color)
- If `color_mode === "color_temp"`, apply adaptive curve
- If `color_mode === null` (just turned on), apply adaptive
- Manual brightness changes: pause for 30min, then resume

### Phase 3: Exclusion List

**Explicitly exclude decorative/accent lights:**

```typescript
const excludedLights = [
  "light.rose_lamp",
  "light.hue_play_1",
  "light.hue_play_2", 
  "light.hue_play_3",
  "light.hue_bloom_1",
  "light.hue_bloom_2",
  "light.japanese_lamp",
  "light.outdoor_lightstrip_left",
  "light.outdoor_lightstrip_center",
  "light.outdoor_lightstrip_right",
  // ... etc
];
```

---

## Color Temperature Curve Design

Based on your current temps (230-366 mireds = 2732-4348K), you prefer warmer tones. Let's design a curve that matches:

### HomeKit-Style Curve

| Time | Solar Elevation | Color Temp | Mireds | Brightness |
|------|----------------|------------|--------|------------|
| Midnight | -50° | 2200K | 455 | 30% |
| Sunrise | -12° to 0° | 2700K | 370 | 50% |
| Morning (8am) | 15° | 4000K | 250 | 80% |
| Midday (12pm) | 60° | 5500K | 182 | 100% |
| Afternoon (3pm) | 45° | 5000K | 200 | 100% |
| Evening (6pm) | 15° | 4000K | 250 | 80% |
| Sunset | 0° to -12° | 2700K | 370 | 50% |
| Night (10pm) | -30° | 2200K | 455 | 30% |

**Your current preference:** Lights at 230 mireds (4348K) and 284 mireds (3521K)  
**Recommendation:** Slightly warmer curve than pure HomeKit to match your taste

### Customized Curve for You

```typescript
const GERSTMAN_CURVE: ColorTempConfig = {
  sunrise: 2700,  // Warm wake-up
  midday: 4500,   // Cooler than HomeKit (you like ~4300K)
  sunset: 2700,   // Warm wind-down
  night: 2200,    // Very warm for evenings
};
```

---

## Virtual Entities Created

The TypeScript app will create these controls in HA:

1. **`switch.adaptive_lighting_master`** - Global on/off
2. **`switch.adaptive_lighting_sleep_mode`** - Force warm temps (2200K)
3. **`switch.adaptive_lighting_tier1_only`** - Only control Tier 1 lights
4. **`sensor.current_color_temperature`** - Current calculated temp
5. **`sensor.solar_elevation`** - Sun position in degrees
6. **`sensor.adaptive_lights_active`** - How many lights being controlled
7. **`sensor.adaptive_lights_overridden`** - How many in manual override

---

## Manual Override Strategy

### Scenario 1: You Adjust Brightness
- **Action:** Automation pauses for 30 minutes
- **Then:** Resumes adaptive color temp, keeps your brightness
- **Why:** You wanted it brighter/dimmer, not a different color

### Scenario 2: You Set a Specific Color (xy mode)
- **Action:** Automation skips this light indefinitely
- **Resume:** Only when you switch back to white/color_temp mode
- **Why:** You explicitly wanted color for ambiance

### Scenario 3: You Turn Light On/Off
- **Action:** If turned on, applies current adaptive settings immediately
- **Why:** New state, apply current time's appropriate temp

### Scenario 4: Sleep Mode Activated
- **Action:** All lights immediately go to 2200K (very warm)
- **Brightness:** Dims to 30% max
- **Why:** Prepare for sleep, eliminate blue light

---

## Room-Specific Configurations

### Kitchen (Task Lighting)
- **Curve:** Slightly cooler (3000K → 5500K → 3000K)
- **Brightness:** Always 100% when on
- **Why:** Food prep needs good visibility

### Bedroom (Relaxation)
- **Curve:** Warmer overall (2500K → 4000K → 2500K)
- **Brightness:** Adaptive (30% night → 80% day)
- **Sleep Mode:** Auto-enable after 10pm
- **Why:** Sleep optimization

### Office (Productivity)
- **Curve:** Cool during work hours (3500K → 5500K → 3500K)
- **Schedule:** 9am-5pm cooler, then warmer
- **Why:** Alertness during work, relaxation after

### Living Room (Flexible)
- **Curve:** Moderate (2700K → 4500K → 2700K)
- **Override:** Respect color mode changes
- **Why:** Mixed use (TV, reading, entertaining)

---

## Implementation Plan

### Step 1: Update Repository with Your Entities
- Create entity lists for each tier
- Configure exclusions
- Set your preferred color temp curve
- Add room-specific overrides

### Step 2: Enhanced Features
- **Transition Intelligence**: Faster transitions during day, slower at night
- **Presence Detection**: Only update lights in occupied rooms (if you have motion sensors)
- **Scene Integration**: Pause adaptive when certain scenes active (movie mode, dinner mode)
- **Time-Based Overrides**: Kitchen cooler during breakfast/dinner prep times

### Step 3: Testing & Refinement
- Deploy to your HA Green
- Monitor for 24 hours
- Adjust curve based on your feedback
- Fine-tune transition timings

---

## Next Steps

1. **Customize the code** with your specific entity lists
2. **Set your preferred curve** (start with values close to your current 230-366 mireds)
3. **Add room-specific logic** for Kitchen, Bedroom, Office
4. **Commit and push** to GitHub
5. **Deploy and test** for real

Ready to customize the code with your exact setup?
