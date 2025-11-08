# Repository Structure

This repository contains **Home Assistant configuration** for adaptive lighting, NOT a TypeScript service.

## What's Here

### 📁 config/ - Ready-to-Use Configuration
- `packages/adaptive_lighting.yaml` - Complete YAML config for 6 zones (32 lights)
- `README.md` - Installation instructions
- `CUSTOMIZATION.md` - How to adjust settings
- `INSTALLATION_CHECKLIST.md` - Step-by-step guide

### 📊 analysis/ - Your Setup Analysis
- `CURRENT_STATE.md` - Current state with risk assessment
- `color-temp-capable-lights.csv` - All 76 adaptive-capable lights
- `light-inventory-summary.json` - Complete light inventory

### 📖 docs/ - Documentation
- `DRY_RUN_REPORT.md` - Detailed dry run with scenarios (see in Obvious)
- `TIER_ASSIGNMENTS.md` - Which lights in which zones
- `IMPLEMENTATION_PLAN.md` - Full strategy document

### 💻 src/ - TypeScript Code (Reference Only)
- `index.ts` - Application entry point
- `services/adaptive-lighting.ts` - TypeScript implementation
- `utils/solar.ts` - Solar calculations

**Note:** You don't need the TypeScript code. It's here for reference, but the HACS integration does everything natively.

## What Changed

**Original Plan:** TypeScript service using Digital Alchemy  
**Final Deliverable:** Native Home Assistant YAML configuration

**Why:** User wants HA-native config without running an external service.

## Quick Start

1. **Read:** `QUICK_START.md` (15-minute installation)
2. **Install:** Adaptive Lighting via HACS
3. **Copy:** `config/packages/adaptive_lighting.yaml` to your HA
4. **Restart:** Home Assistant
5. **Enable:** Kitchen zone first (test with 1 light)
6. **Expand:** Enable other zones after testing

## Configuration Summary

**6 Zones Configured:**
- Kitchen (1 light): 3000-5500K, task lighting
- Laundry (9 lights): 2700-5500K, utility
- Rec Room (6 lights): 2700-5000K, multi-use
- Living Room (5 lights): 2700-4500K, respects manual colors
- Bedroom (11 lights): 2500-4000K, sleep-optimized
- Utility (11 lights): 3000-5500K, misc spaces

**Total:** 32 lights actively managed  
**Excluded:** 33 decorative lights (manual control)

## Working with Obvious

1. Install and test the configuration
2. Report what feels wrong
3. Obvious updates the YAML
4. Pull changes and copy to HA
5. Test again
6. Repeat until perfect

All changes tracked in Git.

## Files You Need

**Minimum:**
- `config/packages/adaptive_lighting.yaml` (copy to HA)

**Recommended:**
- `QUICK_START.md` (installation guide)
- `docs/DRY_RUN_REPORT.md` (understand what will happen)
- `config/CUSTOMIZATION.md` (how to adjust)

**For Reference:**
- `analysis/CURRENT_STATE.md` (your current setup)
- `docs/TIER_ASSIGNMENTS.md` (light assignments)

## Support

- [Adaptive Lighting GitHub](https://github.com/basnijholt/adaptive-lighting)
- [Adaptive Lighting Simulator](https://basnijholt.github.io/adaptive-lighting)
- Ask Obvious for configuration adjustments
