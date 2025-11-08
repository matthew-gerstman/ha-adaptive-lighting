/**
 * Solar position and color temperature calculations
 * Based on HomeKit Adaptive Lighting behavior
 */

export interface SolarPosition {
  elevation: number; // degrees above horizon (-90 to 90)
  azimuth: number;   // degrees from north (0 to 360)
}

export interface ColorTempConfig {
  sunrise: number;   // Color temp at sunrise (Kelvin)
  midday: number;    // Color temp at solar noon (Kelvin)
  sunset: number;    // Color temp at sunset (Kelvin)
  night: number;     // Color temp at night (Kelvin)
}

const DEFAULT_CONFIG: ColorTempConfig = {
  sunrise: 2700,  // Warm
  midday: 5500,   // Cool/bright
  sunset: 2700,   // Warm
  night: 2200,    // Very warm/red
};

/**
 * Calculate solar elevation angle
 * Simplified calculation - for production, use a library like suncalc
 */
export function getSolarElevation(date: Date, latitude: number, longitude: number): number {
  // This is a simplified approximation
  // In production, use a proper solar calculation library
  const hour = date.getHours() + date.getMinutes() / 60;
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  
  // Solar declination (simplified)
  const declination = 23.45 * Math.sin((360 / 365) * (dayOfYear - 81) * Math.PI / 180);
  
  // Hour angle
  const hourAngle = 15 * (hour - 12);
  
  // Solar elevation
  const elevation = Math.asin(
    Math.sin(latitude * Math.PI / 180) * Math.sin(declination * Math.PI / 180) +
    Math.cos(latitude * Math.PI / 180) * Math.cos(declination * Math.PI / 180) * Math.cos(hourAngle * Math.PI / 180)
  ) * 180 / Math.PI;
  
  return elevation;
}

/**
 * Calculate color temperature based on solar position
 * Mimics HomeKit Adaptive Lighting curve
 */
export function calculateColorTemp(
  solarElevation: number,
  config: ColorTempConfig = DEFAULT_CONFIG
): number {
  // Night time (sun well below horizon)
  if (solarElevation < -12) {
    return config.night;
  }
  
  // Sunrise/sunset transition (-12° to 0°)
  if (solarElevation < 0) {
    const progress = (solarElevation + 12) / 12;
    return config.night + (config.sunrise - config.night) * progress;
  }
  
  // Morning rise (0° to 30°)
  if (solarElevation < 30) {
    const progress = solarElevation / 30;
    return config.sunrise + (config.midday - config.sunrise) * progress;
  }
  
  // Midday (30° to 60°)
  if (solarElevation < 60) {
    return config.midday;
  }
  
  // High noon (>60°)
  return config.midday;
}

/**
 * Get color temperature for current time
 */
export function getCurrentColorTemp(
  latitude: number,
  longitude: number,
  config?: ColorTempConfig
): number {
  const now = new Date();
  const elevation = getSolarElevation(now, latitude, longitude);
  return calculateColorTemp(elevation, config);
}

/**
 * Calculate brightness based on solar position
 * Returns 0-100 percentage
 */
export function calculateBrightness(solarElevation: number): number {
  // Night time
  if (solarElevation < -6) {
    return 30; // Dim for night
  }
  
  // Twilight
  if (solarElevation < 0) {
    const progress = (solarElevation + 6) / 6;
    return 30 + 40 * progress; // 30% to 70%
  }
  
  // Daytime
  if (solarElevation < 30) {
    const progress = solarElevation / 30;
    return 70 + 30 * progress; // 70% to 100%
  }
  
  return 100; // Full brightness
}
