import { HomeAssistantAPI } from '../../lib/ha-api.js';
import { loadConfig } from './config.js';

let clientInstance: HomeAssistantAPI | null = null;

export function getHAClient(): HomeAssistantAPI {
  if (!clientInstance) {
    const config = loadConfig();
    clientInstance = new HomeAssistantAPI(config);
  }
  return clientInstance;
}

export async function testConnection(): Promise<boolean> {
  try {
    const client = getHAClient();
    return await client.testConnection();
  } catch (error) {
    return false;
  }
}
