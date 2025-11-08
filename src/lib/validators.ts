export function validateEntityId(entityId: string): void {
  if (!entityId || typeof entityId !== 'string') {
    throw new Error('Entity ID is required');
  }

  if (!entityId.includes('.')) {
    throw new Error('Invalid entity ID format. Expected: domain.entity_name');
  }

  const [domain, name] = entityId.split('.');
  if (!domain || !name) {
    throw new Error('Invalid entity ID format. Expected: domain.entity_name');
  }
}

export function validateBrightness(brightness: number): void {
  if (brightness < 0 || brightness > 255) {
    throw new Error('Brightness must be between 0 and 255');
  }
}

export function validateKelvin(kelvin: number): void {
  if (kelvin < 1000 || kelvin > 10000) {
    throw new Error('Kelvin must be between 1000 and 10000');
  }
}

export function validateRGB(rgb: [number, number, number]): void {
  if (rgb.length !== 3) {
    throw new Error('RGB must have exactly 3 values');
  }

  rgb.forEach((value, index) => {
    if (value < 0 || value > 255) {
      throw new Error(`RGB value at index ${index} must be between 0 and 255`);
    }
  });
}

export function validateTransition(transition: number): void {
  if (transition < 0 || transition > 3600) {
    throw new Error('Transition must be between 0 and 3600 seconds');
  }
}

export function parseRGB(rgbString: string): [number, number, number] {
  const parts = rgbString.split(',').map(v => parseInt(v.trim()));
  
  if (parts.length !== 3) {
    throw new Error('RGB format must be: r,g,b (e.g., 255,128,0)');
  }

  if (parts.some(isNaN)) {
    throw new Error('RGB values must be numbers');
  }

  const rgb = parts as [number, number, number];
  validateRGB(rgb);
  return rgb;
}
