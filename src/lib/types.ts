export interface HAConfig {
  baseUrl: string;
  token: string;
}

export interface HAEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
  context: {
    id: string;
    parent_id: string | null;
    user_id: string | null;
  };
}

export interface HAArea {
  area_id: string;
  name: string;
}

export interface HAService {
  domain: string;
  services: Record<string, {
    name: string;
    description: string;
    fields: Record<string, any>;
  }>;
}

export interface HAAutomation {
  id: string;
  name: string;
  state: 'on' | 'off';
  last_triggered: string | null;
}

export interface ServiceCallData {
  entity_id?: string | string[];
  [key: string]: any;
}

export interface LightAttributes {
  brightness?: number;
  color_temp?: number;
  color_temp_kelvin?: number;
  rgb_color?: [number, number, number];
  supported_color_modes?: string[];
  color_mode?: string;
  min_color_temp_kelvin?: number;
  max_color_temp_kelvin?: number;
  min_mireds?: number;
  max_mireds?: number;
}
