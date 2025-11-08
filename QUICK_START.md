# Quick Start Guide

## 🎯 Goal
Get adaptive lighting working in your Home Assistant in under 15 minutes.

## 📋 What You Need
- Home Assistant Green (you have this ✓)
- HACS installed
- Access to configuration files

## ⚡ 5-Step Installation

### 1. Install Adaptive Lighting (5 min)
```
HACS → Integrations → Explore & Download → "Adaptive Lighting" → Download
Settings → System → Restart
```

### 2. Enable Packages (2 min)
Edit `configuration.yaml`, add:
```yaml
homeassistant:
  packages: !include_dir_named packages
```

### 3. Copy Config (3 min)
```bash
# Create directory
mkdir -p /config/packages

# Copy from this repo
cp config/packages/adaptive_lighting.yaml /config/packages/
```

Or use File Editor addon in HA to create the file.

### 4. Restart HA (2 min)
```
Settings → System → Restart
```

### 5. Enable Kitchen Zone (2 min)
```
Developer Tools → States → Find switch.adaptive_lighting_kitchen → Turn ON
```

## ✅ Verify It's Working

**Within 2 minutes:**
- Kitchen light should adjust to current time's color temp
- Check switch attributes to see calculated values

**Within 1 hour:**
- You should notice gradual warming (it's evening)
- Transitions should be imperceptible (30 second smooth changes)

## 🎨 What Happens

**Right Now (Evening ~7pm):**
- Kitchen: Will warm from current temp to ~3000K
- All zones: Gradual warm-down toward 2700K

**Tonight (10pm):**
- Enable sleep mode: `switch.adaptive_lighting_sleep_mode_bedroom`
- Lights go to 2000K @ 10% (very warm, very dim)

**Tomorrow Morning:**
- Lights gradually warm up from 2700K
- By noon: Kitchen at 5500K, Bedroom at 4000K
- Afternoon: Gradual cool-down begins

## ⚠️ Important Notes

**4 bedroom lights currently in color mode:**
- Bedroom main, Bedroom TV, Both sconces
- **Will switch to white** when you enable bedroom zone
- If you want to keep colors: don't enable bedroom zone yet, or remove those lights from config

**Decorative lights excluded:**
- Rose lamps, Hue Play lights, Hydra lamp, outdoor strips
- These are NOT in the config - you control them manually

## 🔧 Quick Adjustments

**Too cool overall?**
```yaml
max_color_temp: 4500  # Instead of 5500
```

**Too warm overall?**
```yaml
min_color_temp: 3000  # Instead of 2700
```

**Transitions too fast?**
```yaml
transition: 60  # Instead of 30
interval: 120   # Instead of 60
```

Edit `config/packages/adaptive_lighting.yaml`, save, restart HA.

## 📊 Monitor Progress

**Check switch attributes:**
```
Developer Tools → States → switch.adaptive_lighting_kitchen
```

Shows:
- Current calculated color temp
- Current calculated brightness
- Which lights are being controlled
- Which lights are manually overridden

## 🆘 Troubleshooting

**Nothing happens:**
- Check switch is ON
- Check light is ON
- Check HA logs for errors

**Changes too obvious:**
- Increase transition time
- Increase interval between updates

**Wrong temperature:**
- Adjust min/max color temp in YAML
- Restart HA

## 📚 Full Documentation

- **Dry Run Report:** `docs/DRY_RUN_REPORT.md` - Detailed scenarios
- **Installation Checklist:** `config/INSTALLATION_CHECKLIST.md` - Complete steps
- **Customization Guide:** `config/CUSTOMIZATION.md` - How to adjust
- **Tier Assignments:** `docs/TIER_ASSIGNMENTS.md` - Which lights in which zones

## 🚀 After Testing

Once Kitchen works:
1. Enable Laundry & Rec Room zones
2. Enable Living Room zone
3. Enable Bedroom zone (when ready for sconces to go white)
4. Adjust settings based on your preferences
5. Report back - Obvious will refine the config

---

**Repository:** https://github.com/matthew-gerstman/ha-adaptive-lighting  
**Ready to install!** Start with Kitchen zone, expand from there.
