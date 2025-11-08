# Light Tier Assignments

## Overview

**Total Color-Temp Capable Lights:** 76  
**Managed by Adaptive Lighting:** 32 lights  
**Excluded (Manual Control):** 33 lights  
**Utility/Other:** 11 lights

---

## Tier 1: Always Adaptive (16 lights)

**Strategy:** These lights ALWAYS follow the circadian curve. Task and utility spaces.

### Kitchen (1 light)
- ✓ `light.kitchen` - Kitchen

**Color Temp:** 3000K (warm) → 5500K (cool) → 3000K  
**Brightness:** 80% → 100%  
**Current:** 4348K (good midday temp)

### Laundry Room (9 lights)
- ✓ `light.laundry_room` - Laundry room
- ✓ `light.laundry_room_ceiling` - Laundry Room Ceiling
- ✓ `light.laundry_ceiling_1` - Laundry Ceiling 1
- ✓ `light.laundry_ceiling_2` - Laundry Ceiling 2
- ✓ `light.laundry_ceiling_3` - Laundry Ceiling 3
- ✓ `light.laundry_ceiling_4` - Laundry Ceiling 4
- ✓ `light.laundry_ceiling_5` - Laundry Ceiling 5
- ✓ `light.laundry_ceiling_6` - Laundry Ceiling 6

**Color Temp:** 2700K → 5500K → 2700K  
**Brightness:** 60% → 100%  
**Current:** 3344K (good neutral temp)

### Rec Room (6 lights)
- ✓ `light.rec_room` - Rec Room
- ✓ `light.hue_ambiance_spot_1` - Rec Ceiling 1
- ✓ `light.hue_ambiance_spot_2` - Rec Ceiling 2
- ✓ `light.hue_ambiance_spot_3` - Rec Ceiling 3
- ✓ `light.hue_ambiance_spot_4` - Rec Ceiling 4
- ✓ `light.hue_ambiance_spot_5` - Rec Ceiling 5
- ✓ `light.hue_ambiance_spot_1_2` - Rec Ceiling 6

**Color Temp:** 2700K → 5000K → 2700K  
**Brightness:** 40% → 100%  
**Current:** 4348K (good midday temp)

---

## Tier 2: Conditional Adaptive (16 lights)

**Strategy:** Adaptive ONLY when in color_temp mode. If you set colors (xy mode), they're respected.

### Living Room (5 lights)
- ✓ `light.living_room` - Living room (currently color_temp ✓)
- ✓ `light.living_room_tv_lights` - Living Room TV Lights (currently color_temp ✓)
- ✓ `light.signe_gradient_table_1` - Signe gradient table 1 (currently color_temp ✓)
- ✓ `light.signe_gradient_table_2` - Signe gradient table 2 (currently color_temp ✓)
- ✓ `light.hue_color_lamp_1_4` - Doctor Who Lamp (currently color_temp ✓)

**Color Temp:** 2700K → 4500K → 2700K (warmer than other rooms)  
**Brightness:** 30% → 100%  
**Current:** 3521K (perfect neutral)  
**Detect non-HA changes:** Disabled (respects manual color settings)

### Bedroom (11 lights)
- ⚠ `light.bedroom` - Bedroom (currently in xy mode - will switch)
- ✓ `light.bedroom_ceiling` - Bedroom Ceiling (currently 2857K ✓)
- ⚠ `light.bedroom_tv_lights` - Bedroom TV Lights (currently in xy mode)
- ✓ `light.hue_color_candle_1` - Hue color candle 1 (currently 2857K ✓)
- ✓ `light.hue_color_candle_2` - Hue color candle 2 (currently 2857K ✓)
- ✓ `light.hue_color_candle_3` - Hue color candle 3 (currently 2857K ✓)
- ✓ `light.hue_color_candle_4` - Hue color candle 4 (currently 2857K ✓)
- ✓ `light.hue_color_candle_5` - Hue color candle 5 (currently 2857K ✓)
- ✓ `light.hue_color_candle_6` - Hue color candle 6 (currently 2857K ✓)
- ⚠ `light.bed_edison` - Leah's Sconce (currently in xy mode)
- ⚠ `light.hue_lightguide_bulb_1` - Matthew's Sconce (currently in xy mode)

**Color Temp:** 2500K → 4000K → 2500K (warmest zone)  
**Brightness:** 20% → 80% (never too bright)  
**Current:** Candles at 2857K (perfect evening temp)  
**Sunrise:** 07:30 (later wake)  
**Sunset:** 19:00 (earlier evening mode)  
**Transition until sleep:** Enabled  
**Detect non-HA changes:** Disabled (bedside lamps may be colored)

---

## Tier 3: Excluded - Manual Control Only (33 lights)

**Strategy:** NOT included in adaptive lighting config. You control these manually for ambiance/decoration.

### Decorative Lamps
- ○ `light.rose_lamp` - Rose Lamp
- ○ `light.hue_color_lamp_4_2` - Rose Lamp 1
- ○ `light.hue_color_lamp_5` - Rose Lamp 2
- ○ `light.hue_color_lamp_6` - Rose Lamp 3
- ○ `light.japanese_lamp` - Japanese Lamp
- ○ `light.owl_lamp` - Owl Lamp (light.hue_color_lamp_4)
- ○ `light.hue_color_lamp_1_3` - Pixar 2
- ○ `light.hue_color_lamp_4_3` - Slytherin Lamp
- ○ `light.fabric_lamp` - Fabric Lamp
- ○ `light.hue_color_lamp_3_3` - Fabric Bottom
- ○ `light.hue_color_lamp_3` - Table lamp
- ○ `light.hue_color_lamp_1` - Window Lamp

### Accent/Mood Lighting
- ○ `light.hydra_lamp` - Hydra Lamp
- ○ `light.hydra_1` - Hydra 1
- ○ `light.hydra_2` - Hydra 2
- ○ `light.hydra_3` - Hydra 3
- ○ `light.hue_play_1` - Hue play 1
- ○ `light.hue_play_2` - Hue Play 2
- ○ `light.hue_play_2_2` - Hue play 2 (duplicate)
- ○ `light.hue_play_3` - Hue Play 3
- ○ `light.hue_bloom_1` - Hue bloom 1
- ○ `light.hue_bloom_2` - Hue bloom 2
- ○ `light.hue_play_wall_washer_1` - Hue Play wall washer 1
- ○ `light.hue_play_wall_washer_2` - Hue Play wall washer 2
- ○ `light.hue_play_gradient_lightstrip_1_2` - Hue play gradient lightstrip 1
- ○ `light.hue_sana_wall_1` - Hue Sana Top
- ○ `light.hue_sana_wall_2` - Hue Sana Bottom
- ○ `light.play_gradient_tube_1` - Play gradient tube 1

### Outdoor
- ○ `light.outdoor_lightstrip_left` - Outdoor Lightstrip Left
- ○ `light.outdoor_lightstrip_center` - Outdoor Lightstrip Center
- ○ `light.outdoor_lightstrip_right` - Outdoor Lightstrip Right
- ○ `light.festavia_string_lights_1` - Festavia string lights 1
- ○ `light.backyard` - Backyard Lights

---

## Tier 4: Utility/Other (11 lights)

**Strategy:** Included in Utility zone for basic adaptive lighting.

- • `light.electrical_room` - Electrical Room
- • `light.server_closet` - Server Closet
- • `light.hue_infuse_ceiling_1` - Ceiling
- • `light.hue_ambiance_lamp_1` - Hue ambiance lamp 1
- • `light.hue_ambiance_lamp_2` - Hue ambiance lamp 2
- • `light.hue_color_lamp_1_2` - Hue color lamp 1
- • `light.hue_color_lamp_2` - Hue color lamp 2
- • `light.hue_color_lamp_3_2` - Hue color lamp 3
- • `light.office` - Office
- • `light.bookshelf` - Bookshelf
- • `light.backyard` - Backyard Lights

**Note:** Some of these may need to be moved to different tiers based on your actual usage.

---

## Current State Issues

### Lights in xy (Color) Mode (Will Switch to White)

**4 lights in Tier 2** currently showing colors:
- ⚠ `light.bedroom` - Will switch to warm white when adaptive takes over
- ⚠ `light.bedroom_tv_lights` - Will switch to warm white
- ⚠ `light.bed_edison` (Leah's Sconce) - Will switch to warm white
- ⚠ `light.hue_lightguide_bulb_1` (Matthew's Sconce) - Will switch to warm white

**If you want these to stay in color mode:**
1. Remove them from the bedroom zone config
2. Or turn off `switch.adaptive_lighting_bedroom` when you want colors
3. Or mark them as manually controlled via service call

---

## Adjusting Tier Assignments

### Move Light from Tier 2 to Tier 3 (Exclude)

Remove from YAML configuration lights list.

### Move Light from Tier 3 to Tier 2 (Include)

Add to appropriate zone's lights list in YAML.

### Create New Zone

Add a new zone configuration block with its own lights list and settings.

---

## Summary

- **32 lights actively managed** across 6 zones
- **33 decorative lights excluded** for manual control
- **Configuration is modular** - easy to adjust per zone
- **Version controlled** - all changes tracked in Git
- **Obvious can help** - describe what feels wrong, get updated config
