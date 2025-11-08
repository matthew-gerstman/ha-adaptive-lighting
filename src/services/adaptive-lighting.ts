import { TServiceParams } from "@digital-alchemy/core";
import { getCurrentColorTemp, calculateBrightness, getSolarElevation } from "../utils/solar.js";

export function AdaptiveLightingService({
  hass,
  synapse,
  scheduler,
  logger,
  context,
  config,
}: TServiceParams) {
  
  // Configuration
  const UPDATE_INTERVAL = 60; // seconds
  const TRANSITION_DURATION = 30; // seconds
  const MANUAL_OVERRIDE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  
  // Get location from Home Assistant config
  let latitude: number;
  let longitude: number;
  
  // Track which lights are in manual override mode
  const manualOverrides = new Map<string, NodeJS.Timeout>();
  
  // Virtual control switches
  const masterSwitch = synapse.switch({
    context,
    name: "Adaptive Lighting Master",
    is_on: true,
    managed: true,
    icon: "mdi:theme-light-dark",
  });
  
  const sleepMode = synapse.switch({
    context,
    name: "Adaptive Lighting Sleep Mode",
    is_on: false,
    managed: true,
    icon: "mdi:sleep",
  });
  
  // Initialize
  async function initialize() {
    try {
      const haConfig = await hass.fetch.getHassConfig();
      latitude = haConfig.latitude;
      longitude = haConfig.longitude;
      
      logger.info({ latitude, longitude }, "Initialized with location");
      
      // Start update loop
      startUpdateLoop();
      
    } catch (error) {
      logger.error({ error }, "Failed to initialize");
    }
  }
  
  /**
   * Get all lights that support color temperature
   */
  function getAdaptiveLights() {
    return hass.refBy.domain("light").filter(light => {
      const features = light.attributes.supported_color_modes || [];
      return features.includes("color_temp");
    });
  }
  
  /**
   * Update a single light with adaptive settings
   */
  async function updateLight(light: any) {
    // Skip if master switch is off
    if (!masterSwitch.is_on) return;
    
    // Skip if light is off
    if (light.state !== "on") return;
    
    // Skip if in manual override
    if (manualOverrides.has(light.entity_id)) return;
    
    // Calculate current color temperature
    let colorTemp = getCurrentColorTemp(latitude, longitude);
    
    // Sleep mode: use warmer temperature
    if (sleepMode.is_on) {
      colorTemp = Math.min(colorTemp, 2200);
    }
    
    // Calculate brightness
    const elevation = getSolarElevation(new Date(), latitude, longitude);
    const brightness = calculateBrightness(elevation);
    
    try {
      await hass.call.light.turn_on({
        entity_id: light.entity_id,
        color_temp: Math.round(1000000 / colorTemp), // Convert K to mireds
        brightness_pct: brightness,
        transition: TRANSITION_DURATION,
      });
      
      logger.debug(
        { entity: light.entity_id, colorTemp, brightness },
        "Updated light"
      );
    } catch (error) {
      logger.error({ error, entity: light.entity_id }, "Failed to update light");
    }
  }
  
  /**
   * Update all adaptive lights
   */
  async function updateAllLights() {
    const lights = getAdaptiveLights();
    
    logger.info({ count: lights.length }, "Updating adaptive lights");
    
    await Promise.all(lights.map(light => updateLight(light)));
  }
  
  /**
   * Start the periodic update loop
   */
  function startUpdateLoop() {
    // Update immediately
    updateAllLights();
    
    // Then update every interval
    scheduler.setInterval({
      exec: updateAllLights,
      interval: UPDATE_INTERVAL * 1000,
    });
    
    logger.info({ interval: UPDATE_INTERVAL }, "Started update loop");
  }
  
  /**
   * Detect manual changes and pause automation
   */
  function setupManualOverrideDetection() {
    const lights = getAdaptiveLights();
    
    lights.forEach(light => {
      light.onUpdate((update) => {
        // Check if change was made by a user (not this automation)
        if (update.context?.user_id) {
          logger.info({ entity: light.entity_id }, "Manual override detected");
          
          // Clear existing timeout if any
          const existing = manualOverrides.get(light.entity_id);
          if (existing) {
            clearTimeout(existing);
          }
          
          // Set new timeout to re-enable automation
          const timeout = setTimeout(() => {
            manualOverrides.delete(light.entity_id);
            logger.info({ entity: light.entity_id }, "Manual override expired");
            updateLight(light);
          }, MANUAL_OVERRIDE_TIMEOUT);
          
          manualOverrides.set(light.entity_id, timeout);
        }
      });
    });
  }
  
  /**
   * Create informational sensors
   */
  function createSensors() {
    synapse.sensor({
      context,
      name: "Current Color Temperature",
      device_class: "temperature",
      unit_of_measurement: "K",
      state: () => getCurrentColorTemp(latitude, longitude),
      icon: "mdi:thermometer",
    });
    
    synapse.sensor({
      context,
      name: "Solar Elevation",
      unit_of_measurement: "°",
      state: () => {
        const elevation = getSolarElevation(new Date(), latitude, longitude);
        return Math.round(elevation * 10) / 10;
      },
      icon: "mdi:weather-sunny",
    });
    
    synapse.sensor({
      context,
      name: "Adaptive Lights Count",
      state: () => getAdaptiveLights().length,
      icon: "mdi:lightbulb-group",
    });
  }
  
  // Bootstrap
  scheduler.onReady(() => {
    initialize();
    setupManualOverrideDetection();
    createSensors();
  });
  
  logger.info("Adaptive Lighting service initialized");
}
