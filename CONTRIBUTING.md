# Contributing to HA Adaptive Lighting

## Working with Obvious

This project is designed to be collaboratively developed with Obvious AI. Here's how to work together effectively:

### Making Changes

1. **Describe what you want**: Tell Obvious what behavior you'd like to change or add
2. **Obvious updates the code**: Code changes are made directly to the repository
3. **Test in your environment**: Run \`yarn dev\` and test with your actual lights
4. **Provide feedback**: Tell Obvious what works and what doesn't
5. **Iterate**: Refine until it's perfect

### Example Workflow

**You:** "The lights are too bright in the morning. Can we make them dimmer until 8am?"

**Obvious:** Updates \`src/utils/solar.ts\` to adjust morning brightness curve

**You:** Test it, see if it feels right

**You:** "Better, but can we make the transition smoother?"

**Obvious:** Adjusts transition duration

Repeat until perfect.

### Development Setup

\`\`\`bash
# Install dependencies
yarn install

# Start dev server with hot reload
yarn dev

# Generate types from your HA setup
npx type-writer

# Build for production
yarn build
\`\`\`

### Project Structure

\`\`\`
src/
├── index.ts                      # Application entry point
├── services/
│   └── adaptive-lighting.ts      # Main adaptive lighting logic
└── utils/
    └── solar.ts                  # Solar calculations & color temp curves

types/
└── home-assistant.ts             # Generated types (don't edit manually)
\`\`\`

### Key Files to Customize

**\`src/services/adaptive-lighting.ts\`**
- Main service logic
- Light selection and filtering
- Update intervals
- Manual override behavior

**\`src/utils/solar.ts\`**
- Color temperature curves
- Brightness calculations
- Solar position math

**\`.env\`**
- Connection settings
- Temperature preferences

### Testing Changes

1. Save your file (hot reload applies changes)
2. Watch the console for logs
3. Check Home Assistant:
   - Sensor values updating
   - Lights changing color temp
   - Switches responding

### Common Customizations

**Change update frequency:**
\`\`\`typescript
const UPDATE_INTERVAL = 30; // Update every 30 seconds
\`\`\`

**Adjust transition speed:**
\`\`\`typescript
const TRANSITION_DURATION = 60; // 60 second transitions
\`\`\`

**Modify color temp curve:**
\`\`\`typescript
const DEFAULT_CONFIG: ColorTempConfig = {
  sunrise: 2500,  // Warmer sunrise
  midday: 6000,   // Cooler midday
  sunset: 2500,   // Warmer sunset
  night: 2000,    // Very warm night
};
\`\`\`

**Exclude specific lights:**
\`\`\`typescript
function getAdaptiveLights() {
  return hass.refBy.domain("light").filter(light => {
    if (light.entity_id.includes("bathroom")) {
      return false; // Exclude bathroom lights
    }
    // ... rest of logic
  });
}
\`\`\`

### Git Workflow

This repo is designed for collaborative development:

\`\`\`bash
# Pull latest changes
git pull

# Make changes (or have Obvious make them)

# Commit
git add .
git commit -m "Adjust morning brightness curve"

# Push
git push
\`\`\`

### Debugging

**Enable debug logging:**
\`\`\`typescript
logger.debug({ entity, colorTemp, brightness }, "Updated light");
\`\`\`

**Check sensor values:**
- \`sensor.current_color_temperature\`
- \`sensor.solar_elevation\`
- \`sensor.adaptive_lights_count\`

**Manual override testing:**
Turn a light on/off manually and watch logs for override detection.

### Performance Considerations

- Update interval: 60 seconds is good balance (less = smoother, more = less load)
- Transition duration: 30 seconds feels natural
- Don't update lights that are off
- Respect manual overrides to avoid fighting with users

### Getting Help

1. **Ask Obvious**: Describe the problem or desired behavior
2. **Check logs**: Look for errors or unexpected behavior
3. **Test incrementally**: Change one thing at a time
4. **Use sensors**: Monitor calculated values in HA

### Best Practices

- **Test with real lights**: Simulated behavior isn't the same as real world
- **Consider your schedule**: Adjust curves to match your actual wake/sleep times
- **Start conservative**: Begin with subtle changes, increase if desired
- **Use sleep mode**: Enable before bed for extra warm temps
- **Monitor manual overrides**: If you're overriding frequently, adjust the automation

### Future Enhancements

Ideas for expansion:
- Per-room temperature curves
- Occupancy-aware brightness
- Weather-based adjustments
- Seasonal variations
- Scene integration (movie mode, dinner mode)
- Voice control integration

Tell Obvious which features you'd like and we'll build them together.
