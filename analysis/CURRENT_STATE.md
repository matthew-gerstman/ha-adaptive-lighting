# Current State Analysis
**Generated:** 2025-11-08 02:50:06 UTC

## Tier 1: Always Adaptive (16 lights)

**Status:** ✅ **ALL 16 LIGHTS READY** - All are ON and in color_temp mode

| Entity | State | Mode | Current Temp | Name |
|--------|-------|------|--------------|------|
| ✓ light.hue_ambiance_spot_1 | on | color_temp | 4348K | Rec Ceiling 1 |
| ✓ light.hue_ambiance_spot_1_2 | on | color_temp | 4348K | Rec Ceiling 6 |
| ✓ light.hue_ambiance_spot_2 | on | color_temp | 4348K | Rec Ceiling 2 |
| ✓ light.hue_ambiance_spot_3 | on | color_temp | 4348K | Rec Ceiling 3 |
| ✓ light.hue_ambiance_spot_4 | on | color_temp | 4348K | Rec Ceiling 4 |
| ✓ light.hue_ambiance_spot_5 | on | color_temp | 4348K | Rec Ceiling 5 |
| ✓ light.kitchen | on | color_temp | 4348K | Kitchen |
| ✓ light.laundry_ceiling_1 | on | color_temp | 3344K | Laundry Ceiling 1 |
| ✓ light.laundry_ceiling_2 | on | color_temp | 3344K | Laundry Ceiling 2 |
| ✓ light.laundry_ceiling_3 | on | color_temp | 3344K | Laundry Ceiling 3 |
| ✓ light.laundry_ceiling_4 | on | color_temp | 3344K | Laundry Ceiling 4 |
| ✓ light.laundry_ceiling_5 | on | color_temp | 3344K | Laundry Ceiling 5 |
| ✓ light.laundry_ceiling_6 | on | color_temp | 3344K | Laundry Ceiling 6 |
| ✓ light.laundry_room | on | color_temp | 3344K | Laundry room |
| ✓ light.laundry_room_ceiling | on | color_temp | 3344K | Laundry Room Ceiling |
| ✓ light.rec_room | on | color_temp | 4348K | Rec Room |

**Current Temperature Distribution:**
- Kitchen: 4348K (good for midday)
- Laundry: 3344K (neutral warm)
- Rec Room: 4348K (good for midday)

**Adaptive Lighting Impact:**
These lights will immediately start following the circadian curve when you enable their zones. No issues - all ready to go.

---

## Tier 2: Conditional Adaptive (16 lights)

**Status:** ⚠️ **4 LIGHTS IN COLOR MODE** - Will switch to white when adaptive takes over

| Entity | State | Mode | Current Temp | Name | Issue |
|--------|-------|------|--------------|------|-------|
| ⚠ light.bed_edison | on | xy | N/A | Leah's Sconce | **Will switch to white** |
| ⚠ light.bedroom | on | xy | N/A | Bedroom | **Will switch to white** |
| ✓ light.bedroom_ceiling | on | color_temp | 2857K | Bedroom Ceiling | Ready |
| ⚠ light.bedroom_tv_lights | on | xy | N/A | Bedroom TV Lights | **Will switch to white** |
| ✓ light.hue_color_candle_1 | on | color_temp | 2857K | Hue color candle 1 | Ready |
| ✓ light.hue_color_candle_2 | on | color_temp | 2857K | Hue color candle 2 | Ready |
| ✓ light.hue_color_candle_3 | on | color_temp | 2857K | Hue color candle 3 | Ready |
| ✓ light.hue_color_candle_4 | on | color_temp | 2857K | Hue color candle 4 | Ready |
| ✓ light.hue_color_candle_5 | on | color_temp | 2857K | Hue color candle 5 | Ready |
| ✓ light.hue_color_candle_6 | on | color_temp | 2857K | Hue color candle 6 | Ready |
| ✓ light.hue_color_lamp_1_4 | on | color_temp | 3521K | Doctor Who Lamp | Ready |
| ⚠ light.hue_lightguide_bulb_1 | on | xy | N/A | Matthew's Sconce | **Will switch to white** |
| ✓ light.living_room | on | color_temp | 3521K | Living room | Ready |
| ✓ light.living_room_tv_lights | on | color_temp | 3521K | Living Room TV Lights | Ready |
| ✓ light.signe_gradient_table_1 | on | color_temp | 3521K | Signe gradient table 1 | Ready |
| ✓ light.signe_gradient_table_2 | on | color_temp | 3521K | Signe gradient table 2 | Ready |

**Lights Currently in Color Mode:**
1. `light.bedroom` - Bedroom main light
2. `light.bedroom_tv_lights` - Bedroom TV backlighting
3. `light.bed_edison` - Leah's Sconce
4. `light.hue_lightguide_bulb_1` - Matthew's Sconce

**What Will Happen:**
When you enable the Bedroom zone, these 4 lights will switch from their current colors to warm white (2500-4000K range depending on time of day).

**If You Want to Keep Colors:**
- Option 1: Remove these entities from bedroom zone config
- Option 2: Turn off bedroom zone when you want colored lighting
- Option 3: Set them as manually controlled via service call

**Current Temperature Distribution:**
- Bedroom ceiling & candles: 2857K (perfect warm evening temp)
- Living room: 3521K (good neutral)
- Sconces: Currently colored (will become 2500-4000K when adaptive)

---

## What Changes When You Enable Adaptive Lighting

### Immediate Changes (When Zones Enabled)

**Tier 1 Zones (Kitchen, Laundry, Rec Room):**
- ✅ No immediate change - all lights already in color_temp mode
- ✅ Will start gradual adjustments based on time of day
- ✅ Currently at good temps (3344-4348K for evening)

**Tier 2 Zones (Living Room, Bedroom):**
- ⚠️ 4 bedroom lights will switch from color → white
- ✅ 12 lights already in color_temp mode, will continue smoothly

### Ongoing Behavior (After Enabled)

**Every 60-120 seconds:**
- Lights gradually adjust color temperature
- Smooth 30-60 second transitions
- Based on solar position and time of day

**When you manually adjust:**
- Brightness change: Pauses for 30 minutes, then resumes
- Color change (xy mode): Stops controlling that light until you switch back
- Turn off zone switch: All automation stops

**Sleep mode enabled:**
- All lights immediately transition to 2000-2200K
- Brightness dims to 10-30%
- Very warm, sleep-friendly lighting

---

## Recommended Testing Sequence

### Phase 1: Kitchen (Safest)
1. Enable `switch.adaptive_lighting_kitchen`
2. Watch single light adjust over 2-3 hours
3. Verify smooth transitions
4. Test manual override (adjust brightness, wait 30min)

### Phase 2: Laundry & Rec Room
1. Enable both zones
2. Monitor 16 lights total
3. Verify consistent behavior
4. Check that all ceiling spots coordinate

### Phase 3: Living Room
1. Enable living room zone
2. Watch 5 lights adjust
3. Test manual color setting (should pause automation)
4. Verify Signe gradient lights work correctly

### Phase 4: Bedroom (Most Complex)
1. **Warning:** 4 lights will switch from color to white
2. Enable bedroom zone
3. Observe sconces and main light switch to warm white
4. Test sleep mode
5. Verify candles coordinate properly

---

## Expected Behavior by Time of Day

**Current Time: ~6:50 PM (based on analysis)**

### If You Enable Now:

**Kitchen:**
- Current: 4348K
- Will transition to: ~3500K (evening warm-down)
- Over: 30-60 minutes

**Laundry:**
- Current: 3344K
- Will transition to: ~3200K (slight warm adjustment)
- Over: 30 minutes

**Rec Room:**
- Current: 4348K
- Will transition to: ~3300K (evening warm-down)
- Over: 30-60 minutes

**Living Room:**
- Current: 3521K
- Will transition to: ~3000K (comfortable evening)
- Over: 45 minutes (slower transitions)

**Bedroom:**
- Current: Candles at 2857K ✓, sconces in color mode
- Will transition to: ~2700K (very warm for evening)
- Sconces will switch from color → warm white
- Over: 60 minutes (very slow transitions)

### Next 3 Hours (7pm - 10pm):

All lights will gradually warm:
- Kitchen: 3500K → 3000K → 2700K
- Laundry: 3200K → 2900K → 2700K
- Rec Room: 3300K → 2900K → 2700K
- Living Room: 3000K → 2800K → 2700K
- Bedroom: 2700K → 2500K → 2300K

Brightness will also dim slightly (depends on zone settings).

### If Sleep Mode Enabled at 10pm:

All lights immediately transition to:
- Kitchen: 2200K @ 30%
- Laundry: 2200K @ 30%
- Rec Room: 2200K @ 20%
- Living Room: 2000K @ 20%
- Bedroom: 2000K @ 10%

---

## Risk Assessment

### Low Risk
- Tier 1 lights (Kitchen, Laundry, Rec Room): Already in correct mode, will just start adapting
- Tier 2 lights already in color_temp mode: Will continue with adaptive curve

### Medium Risk
- **4 bedroom lights in xy mode:** Will switch to white when adaptive enabled
  - If you like the current colors, either exclude these lights or don't enable bedroom zone yet

### Mitigation
- Test Kitchen first (single light, low risk)
- Enable bedroom zone when you're ready for those lights to be white
- Can always turn off zone switches to stop automation
- Can mark specific lights as manually controlled

---

## Files Generated

All analysis and configuration files are in the GitHub repository:
- `config/packages/adaptive_lighting.yaml` - Ready to copy to HA
- `config/INSTALLATION_CHECKLIST.md` - Step-by-step guide
- `docs/DRY_RUN_REPORT.md` - Detailed scenarios
- `docs/TIER_ASSIGNMENTS.md` - Complete light assignments
- `analysis/color-temp-capable-lights.csv` - All 76 adaptive lights
- `analysis/CURRENT_STATE.md` - This file

**Next:** Copy configuration to Home Assistant and test.
