import { Command } from 'commander';
import { getHAClient } from '../utils/ha-client.js';
import * as output from '../utils/output.js';
import { parseRGB } from '../../lib/validators.js';
import type { HAEntity } from '../../lib/types.js';

export function createLightsCommand(): Command {
  const lights = new Command('lights')
    .description('Control and query lights');

  lights
    .command('list')
    .description('List all lights')
    .option('--area <area>', 'Filter by area')
    .option('--state <on|off>', 'Filter by state')
    .option('--supports-ct', 'Only show color-temp capable lights')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      try {
        const spin = output.spinner('Fetching lights...');
        const client = getHAClient();
        let states = await client.getStates();
        spin.stop();

        let lightStates = states.filter(e => e.entity_id.startsWith('light.'));

        if (options.area) {
          lightStates = lightStates.filter(e => 
            e.attributes.area_id === options.area ||
            e.attributes.friendly_name?.toLowerCase().includes(options.area.toLowerCase())
          );
        }

        if (options.state) {
          lightStates = lightStates.filter(e => e.state === options.state);
        }

        if (options.supportsCt) {
          lightStates = lightStates.filter(e => {
            const modes = e.attributes.supported_color_modes || [];
            return modes.includes('color_temp') || modes.includes('color_temp_kelvin');
          });
        }

        if (options.json) {
          output.outputJSON(lightStates);
          return;
        }

        output.header(`Lights (${lightStates.length})`);
        const table = output.createTable(['Entity ID', 'Name', 'State', 'Brightness', 'Color Temp']);
        lightStates.forEach(light => {
          const brightness = light.state === 'on' ? light.attributes.brightness : undefined;
          const kelvin = light.state === 'on' ? light.attributes.color_temp_kelvin : undefined;
          
          table.push([
            output.truncate(light.entity_id, 30),
            output.truncate(light.attributes.friendly_name || light.entity_id, 25),
            output.formatState(light.state),
            output.formatBrightness(brightness),
            output.formatKelvin(kelvin)
          ]);
        });
        output.printTable(table);
      } catch (error: any) {
        output.error(`Failed to list lights: ${error.message}`);
        process.exit(1);
      }
    });

  lights
    .command('get')
    .description('Get detailed information about a light')
    .argument('<entity_id>', 'Light entity ID')
    .option('--json', 'Output as JSON')
    .action(async (entityId, options) => {
      try {
        const spin = output.spinner(`Fetching ${entityId}...`);
        const client = getHAClient();
        const light = await client.getState(entityId);
        spin.stop();

        if (options.json) {
          output.outputJSON(light);
          return;
        }

        output.header(`Light: ${entityId}`);
        output.keyValue('Name', light.attributes.friendly_name || entityId);
        output.keyValue('State', output.formatState(light.state));
        
        if (light.state === 'on') {
          output.keyValue('Brightness', output.formatBrightness(light.attributes.brightness));
          output.keyValue('Color Mode', light.attributes.color_mode || 'N/A');
          
          if (light.attributes.color_temp_kelvin) {
            output.keyValue('Color Temp', output.formatKelvin(light.attributes.color_temp_kelvin));
          }
          
          if (light.attributes.rgb_color) {
            output.keyValue('RGB Color', JSON.stringify(light.attributes.rgb_color));
          }
        }

        console.log();
        output.header('Capabilities');
        const modes = light.attributes.supported_color_modes || [];
        output.keyValue('Color Modes', modes.join(', ') || 'None');
        
        if (light.attributes.min_color_temp_kelvin) {
          output.keyValue('Min Kelvin', light.attributes.min_color_temp_kelvin.toString());
        }
        if (light.attributes.max_color_temp_kelvin) {
          output.keyValue('Max Kelvin', light.attributes.max_color_temp_kelvin.toString());
        }
      } catch (error: any) {
        output.error(`Failed to get light: ${error.message}`);
        process.exit(1);
      }
    });

  lights
    .command('on')
    .description('Turn on a light')
    .argument('<entity_id>', 'Light entity ID')
    .option('--brightness <0-255>', 'Set brightness (0-255)')
    .option('--kelvin <2000-6500>', 'Set color temperature in Kelvin')
    .option('--rgb <r,g,b>', 'Set RGB color (e.g., 255,128,0)')
    .option('--transition <seconds>', 'Transition duration in seconds')
    .action(async (entityId, options) => {
      try {
        const lightOptions: any = {};
        
        if (options.brightness) {
          lightOptions.brightness = parseInt(options.brightness);
        }
        
        if (options.kelvin) {
          lightOptions.kelvin = parseInt(options.kelvin);
        }
        
        if (options.rgb) {
          lightOptions.rgb = parseRGB(options.rgb);
        }
        
        if (options.transition) {
          lightOptions.transition = parseFloat(options.transition);
        }

        const spin = output.spinner(`Turning on ${entityId}...`);
        const client = getHAClient();
        await client.turnOnLight(entityId, lightOptions);
        spin.succeed(`Turned on ${entityId}`);
      } catch (error: any) {
        output.error(`Failed to turn on light: ${error.message}`);
        process.exit(1);
      }
    });

  lights
    .command('off')
    .description('Turn off a light')
    .argument('<entity_id>', 'Light entity ID')
    .option('--transition <seconds>', 'Transition duration in seconds')
    .action(async (entityId, options) => {
      try {
        const transition = options.transition ? parseFloat(options.transition) : undefined;
        
        const spin = output.spinner(`Turning off ${entityId}...`);
        const client = getHAClient();
        await client.turnOffLight(entityId, transition);
        spin.succeed(`Turned off ${entityId}`);
      } catch (error: any) {
        output.error(`Failed to turn off light: ${error.message}`);
        process.exit(1);
      }
    });

  lights
    .command('set')
    .description('Set light properties')
    .argument('<entity_id>', 'Light entity ID')
    .option('--brightness <0-255>', 'Set brightness (0-255)')
    .option('--kelvin <2000-6500>', 'Set color temperature in Kelvin')
    .option('--rgb <r,g,b>', 'Set RGB color')
    .option('--transition <seconds>', 'Transition duration')
    .action(async (entityId, options) => {
      try {
        const lightOptions: any = {};
        
        if (options.brightness) {
          lightOptions.brightness = parseInt(options.brightness);
        }
        
        if (options.kelvin) {
          lightOptions.kelvin = parseInt(options.kelvin);
        }
        
        if (options.rgb) {
          lightOptions.rgb = parseRGB(options.rgb);
        }
        
        if (options.transition) {
          lightOptions.transition = parseFloat(options.transition);
        }

        const spin = output.spinner(`Setting ${entityId}...`);
        const client = getHAClient();
        await client.turnOnLight(entityId, lightOptions);
        spin.succeed(`Updated ${entityId}`);
      } catch (error: any) {
        output.error(`Failed to set light: ${error.message}`);
        process.exit(1);
      }
    });

  lights
    .command('batch')
    .description('Batch operation on multiple lights')
    .argument('<command>', 'Command: on or off')
    .option('--area <area>', 'Target area')
    .option('--filter <json>', 'Complex filter as JSON')
    .option('--brightness <0-255>', 'Set brightness (for on command)')
    .option('--kelvin <2000-6500>', 'Set color temperature (for on command)')
    .option('--transition <seconds>', 'Transition duration')
    .option('--dry-run', 'Show what would happen without executing')
    .action(async (command, options) => {
      try {
        if (command !== 'on' && command !== 'off') {
          output.error('Command must be "on" or "off"');
          process.exit(1);
        }

        const spin = output.spinner('Fetching lights...');
        const client = getHAClient();
        let states = await client.getStates();
        spin.stop();

        let lightStates = states.filter(e => e.entity_id.startsWith('light.'));

        if (options.area) {
          lightStates = lightStates.filter(e => 
            e.attributes.area_id === options.area ||
            e.attributes.friendly_name?.toLowerCase().includes(options.area.toLowerCase())
          );
        }

        if (options.filter) {
          const filter = JSON.parse(options.filter);
        }

        if (lightStates.length === 0) {
          output.warning('No lights match the filter');
          return;
        }

        output.header(`Batch ${command} on ${lightStates.length} lights`);
        
        if (options.dryRun) {
          output.info('DRY RUN - No changes will be made');
          const table = output.createTable(['Entity ID', 'Name', 'Action']);
          lightStates.forEach(light => {
            table.push([
              output.truncate(light.entity_id, 30),
              output.truncate(light.attributes.friendly_name || light.entity_id, 25),
              command
            ]);
          });
          output.printTable(table);
          return;
        }

        const batchSpin = output.spinner(`Executing ${command} on ${lightStates.length} lights...`);
        
        for (const light of lightStates) {
          if (command === 'on') {
            const lightOptions: any = {};
            if (options.brightness) lightOptions.brightness = parseInt(options.brightness);
            if (options.kelvin) lightOptions.kelvin = parseInt(options.kelvin);
            if (options.transition) lightOptions.transition = parseFloat(options.transition);
            await client.turnOnLight(light.entity_id, lightOptions);
          } else if (command === 'off') {
            const transition = options.transition ? parseFloat(options.transition) : undefined;
            await client.turnOffLight(light.entity_id, transition);
          }
        }
        
        batchSpin.succeed(`Batch ${command} completed on ${lightStates.length} lights`);
      } catch (error: any) {
        output.error(`Failed batch operation: ${error.message}`);
        process.exit(1);
      }
    });

  return lights;
}
