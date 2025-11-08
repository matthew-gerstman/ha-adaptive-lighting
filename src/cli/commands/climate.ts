import { Command } from 'commander';
import { getHAClient } from '../utils/ha-client.js';
import * as output from '../utils/output.js';

export function createClimateCommand(): Command {
  const climate = new Command('climate')
    .description('Control climate devices (thermostats, HVAC)');

  climate
    .command('list')
    .description('List all climate devices')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      try {
        const spin = output.spinner('Fetching climate devices...');
        const client = getHAClient();
        const states = await client.getStates();
        const climateStates = states.filter(e => e.entity_id.startsWith('climate.'));
        spin.stop();

        if (options.json) {
          output.outputJSON(climateStates);
          return;
        }

        output.header(`Climate Devices (${climateStates.length})`);
        const table = output.createTable(['Entity ID', 'Name', 'State', 'Current Temp', 'Target Temp']);
        climateStates.forEach(climate => {
          const currentTemp = climate.attributes.current_temperature;
          const targetTemp = climate.attributes.temperature;
          
          table.push([
            output.truncate(climate.entity_id, 30),
            output.truncate(climate.attributes.friendly_name || climate.entity_id, 25),
            output.formatState(climate.state),
            currentTemp ? `${currentTemp}°` : 'N/A',
            targetTemp ? `${targetTemp}°` : 'N/A'
          ]);
        });
        output.printTable(table);
      } catch (error: any) {
        output.error(`Failed to list climate devices: ${error.message}`);
        process.exit(1);
      }
    });

  climate
    .command('get')
    .description('Get climate device details')
    .argument('<entity_id>', 'Climate entity ID')
    .option('--json', 'Output as JSON')
    .action(async (entityId, options) => {
      try {
        const spin = output.spinner(`Fetching ${entityId}...`);
        const client = getHAClient();
        const device = await client.getState(entityId);
        spin.stop();

        if (options.json) {
          output.outputJSON(device);
          return;
        }

        output.header(`Climate: ${entityId}`);
        output.keyValue('Name', device.attributes.friendly_name || entityId);
        output.keyValue('State', output.formatState(device.state));
        output.keyValue('Current Temp', device.attributes.current_temperature ? `${device.attributes.current_temperature}°` : 'N/A');
        output.keyValue('Target Temp', device.attributes.temperature ? `${device.attributes.temperature}°` : 'N/A');
        output.keyValue('HVAC Mode', device.attributes.hvac_mode || 'N/A');
        output.keyValue('Fan Mode', device.attributes.fan_mode || 'N/A');
        
        console.log();
        output.header('Supported Modes');
        if (device.attributes.hvac_modes) {
          output.keyValue('HVAC', device.attributes.hvac_modes.join(', '));
        }
        if (device.attributes.fan_modes) {
          output.keyValue('Fan', device.attributes.fan_modes.join(', '));
        }
      } catch (error: any) {
        output.error(`Failed to get climate device: ${error.message}`);
        process.exit(1);
      }
    });

  climate
    .command('set-temp')
    .description('Set target temperature')
    .argument('<entity_id>', 'Climate entity ID')
    .argument('<temperature>', 'Target temperature')
    .action(async (entityId, temperature) => {
      try {
        const temp = parseFloat(temperature);
        
        const spin = output.spinner(`Setting temperature to ${temp}°...`);
        const client = getHAClient();
        await client.callService('climate', 'set_temperature', {
          entity_id: entityId,
          temperature: temp
        });
        spin.succeed(`Set ${entityId} to ${temp}°`);
      } catch (error: any) {
        output.error(`Failed to set temperature: ${error.message}`);
        process.exit(1);
      }
    });

  climate
    .command('set-mode')
    .description('Set HVAC mode')
    .argument('<entity_id>', 'Climate entity ID')
    .argument('<mode>', 'HVAC mode (heat, cool, auto, off, etc.)')
    .action(async (entityId, mode) => {
      try {
        const spin = output.spinner(`Setting mode to ${mode}...`);
        const client = getHAClient();
        await client.callService('climate', 'set_hvac_mode', {
          entity_id: entityId,
          hvac_mode: mode
        });
        spin.succeed(`Set ${entityId} to ${mode} mode`);
      } catch (error: any) {
        output.error(`Failed to set mode: ${error.message}`);
        process.exit(1);
      }
    });

  return climate;
}
