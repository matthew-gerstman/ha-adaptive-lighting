import axios, { AxiosInstance } from 'axios';
import type { HAConfig, HAEntity, HAArea, HAService, HAAutomation, ServiceCallData } from './types.js';

export class HomeAssistantAPI {
  private client: AxiosInstance;
  private config: HAConfig;

  constructor(config: HAConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      await this.client.get('/api/');
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get API config
  async getConfig(): Promise<any> {
    const response = await this.client.get('/api/config');
    return response.data;
  }

  // Get all states
  async getStates(): Promise<HAEntity[]> {
    const response = await this.client.get('/api/states');
    return response.data;
  }

  // Get specific entity state
  async getState(entityId: string): Promise<HAEntity> {
    const response = await this.client.get(`/api/states/${entityId}`);
    return response.data;
  }

  // Get entity history
  async getHistory(entityId: string, hours: number = 24): Promise<any> {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - hours * 60 * 60 * 1000);
    const response = await this.client.get(
      `/api/history/period/${startTime.toISOString()}`,
      { params: { filter_entity_id: entityId } }
    );
    return response.data;
  }

  // Call service
  async callService(domain: string, service: string, data: ServiceCallData = {}): Promise<any> {
    const response = await this.client.post(
      `/api/services/${domain}/${service}`,
      data
    );
    return response.data;
  }

  // Get services
  async getServices(): Promise<HAService[]> {
    const response = await this.client.get('/api/services');
    return response.data;
  }

  // Get areas (requires newer HA versions)
  async getAreas(): Promise<HAArea[]> {
    try {
      const response = await this.client.get('/api/config/area_registry/list');
      return response.data;
    } catch (error) {
      // Fallback if API not available
      return [];
    }
  }

  // Light-specific methods
  async turnOnLight(entityId: string, options: {
    brightness?: number;
    kelvin?: number;
    rgb?: [number, number, number];
    transition?: number;
  } = {}): Promise<void> {
    const data: ServiceCallData = { entity_id: entityId };
    
    if (options.brightness !== undefined) {
      data.brightness = options.brightness;
    }
    
    if (options.kelvin !== undefined) {
      data.color_temp_kelvin = options.kelvin;
    }
    
    if (options.rgb !== undefined) {
      data.rgb_color = options.rgb;
    }
    
    if (options.transition !== undefined) {
      data.transition = options.transition;
    }

    await this.callService('light', 'turn_on', data);
  }

  async turnOffLight(entityId: string, transition?: number): Promise<void> {
    const data: ServiceCallData = { entity_id: entityId };
    if (transition !== undefined) {
      data.transition = transition;
    }
    await this.callService('light', 'turn_off', data);
  }

  // Automation methods
  async getAutomations(): Promise<HAEntity[]> {
    const states = await this.getStates();
    return states.filter(e => e.entity_id.startsWith('automation.'));
  }

  async triggerAutomation(automationId: string, data: any = {}): Promise<void> {
    await this.callService('automation', 'trigger', {
      entity_id: automationId,
      ...data
    });
  }

  async enableAutomation(automationId: string): Promise<void> {
    await this.callService('automation', 'turn_on', { entity_id: automationId });
  }

  async disableAutomation(automationId: string): Promise<void> {
    await this.callService('automation', 'turn_off', { entity_id: automationId });
  }

  // Config methods
  async reloadConfig(): Promise<void> {
    await this.callService('homeassistant', 'reload_core_config', {});
  }

  async checkConfig(): Promise<any> {
    await this.callService('homeassistant', 'check_config', {});
  }
}
