import dotenv from 'dotenv';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { HAConfig } from '../../lib/types.js';

dotenv.config();

export interface CLIConfig extends HAConfig {
  defaults?: {
    transition?: number;
    outputFormat?: 'table' | 'json';
  };
  aliases?: Record<string, string>;
}

export function loadConfig(): CLIConfig {
  const baseUrl = process.env.HASS_BASE_URL || process.env.HASS_URL;
  const token = process.env.HASS_TOKEN;

  if (!baseUrl || !token) {
    throw new Error(
      'Missing required configuration. Please set HASS_BASE_URL and HASS_TOKEN environment variables.\n' +
      'You can create a .env file with:\n' +
      '  HASS_BASE_URL=http://homeassistant.local:8123\n' +
      '  HASS_TOKEN=your_long_lived_access_token'
    );
  }

  const config: CLIConfig = {
    baseUrl: baseUrl.replace(/\/$/, ''), // Remove trailing slash
    token,
    defaults: {
      transition: 1,
      outputFormat: 'table',
    },
  };

  // Try to load optional config file
  const configPath = join(process.cwd(), 'ha-cli.config.json');
  if (existsSync(configPath)) {
    try {
      const fileConfig = JSON.parse(readFileSync(configPath, 'utf-8'));
      Object.assign(config, fileConfig);
    } catch (error) {
      // Ignore config file errors
    }
  }

  return config;
}
