import { Command } from 'commander';
import { getHAClient } from '../utils/ha-client.js';
import * as output from '../utils/output.js';

export function createAdaptiveCommand(): Command {
  const adaptive = new Command('adaptive')
    .description('Control adaptive lighting system');

  adaptive
    .command('status')
    .description('Show adaptive lighting status')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      try {
        const spin = output.spinner('Fetching adaptive lighting status...');
        const client = getHAClient();
        const states = await client.getStates();
        spin.stop();

        // Look for adaptive lighting switches
        const adaptiveSwitches = states.filter(e => 
          e.entity_id.includes('adaptive_lighting') && 
          e.entity_id.startsWith('switch.')
        );

        if (options.json) {
          output.outputJSON(adaptiveSwitches);
          return;
        }

        if (adaptiveSwitches.length === 0) {
          output.warning('No adaptive lighting switches found');
          output.info('This CLI includes adaptive lighting configuration for future use');
          return;
        }

        output.header(`Adaptive Lighting Status (${adaptiveSwitches.length} switches)`);
        const table = output.createTable(['Entity ID', 'Name', 'State']);
        adaptiveSwitches.forEach(sw => {
          table.push([
            output.truncate(sw.entity_id, 40),
            output.truncate(sw.attributes.friendly_name || sw.entity_id, 35),
            output.formatState(sw.state)
          ]);
        });
        output.printTable(table);
      } catch (error: any) {
        output.error(`Failed to get adaptive lighting status: ${error.message}`);
        process.exit(1);
      }
    });

  adaptive
    .command('enable')
    .description('Enable adaptive lighting')
    .option('--global', 'Enable globally')
    .option('--light <entity_id>', 'Enable for specific light')
    .action(async (options) => {
      try {
        if (!options.global && !options.light) {
          output.error('Must specify --global or --light <entity_id>');
          process.exit(1);
        }

        const client = getHAClient();
        
        if (options.global) {
          // Look for global adaptive lighting switch
          const spin = output.spinner('Enabling global adaptive lighting...');
          const states = await client.getStates();
          const globalSwitch = states.find(e => 
            e.entity_id.includes('global') && 
            e.entity_id.includes('adaptive_lighting') &&
            e.entity_id.startsWith('switch.')
          );

          if (!globalSwitch) {
            spin.fail('Global adaptive lighting switch not found');
            output.info('You may need to set up adaptive lighting integration first');
            process.exit(1);
          }

          await client.callService('switch', 'turn_on', { entity_id: globalSwitch.entity_id });
          spin.succeed('Enabled global adaptive lighting');
        }

        if (options.light) {
          const spin = output.spinner(`Enabling adaptive lighting for ${options.light}...`);
          // This would require custom logic based on your adaptive lighting setup
          output.warning('Per-light adaptive lighting control requires custom configuration');
          spin.stop();
        }
      } catch (error: any) {
        output.error(`Failed to enable adaptive lighting: ${error.message}`);
        process.exit(1);
      }
    });

  adaptive
    .command('disable')
    .description('Disable adaptive lighting')
    .option('--global', 'Disable globally')
    .option('--light <entity_id>', 'Disable for specific light')
    .action(async (options) => {
      try {
        if (!options.global && !options.light) {
          output.error('Must specify --global or --light <entity_id>');
          process.exit(1);
        }

        const client = getHAClient();
        
        if (options.global) {
          const spin = output.spinner('Disabling global adaptive lighting...');
          const states = await client.getStates();
          const globalSwitch = states.find(e => 
            e.entity_id.includes('global') && 
            e.entity_id.includes('adaptive_lighting') &&
            e.entity_id.startsWith('switch.')
          );

          if (!globalSwitch) {
            spin.fail('Global adaptive lighting switch not found');
            process.exit(1);
          }

          await client.callService('switch', 'turn_off', { entity_id: globalSwitch.entity_id });
          spin.succeed('Disabled global adaptive lighting');
        }

        if (options.light) {
          const spin = output.spinner(`Disabling adaptive lighting for ${options.light}...`);
          output.warning('Per-light adaptive lighting control requires custom configuration');
          spin.stop();
        }
      } catch (error: any) {
        output.error(`Failed to disable adaptive lighting: ${error.message}`);
        process.exit(1);
      }
    });

  adaptive
    .command('config')
    .description('Show or update adaptive lighting configuration')
    .argument('[entity_id]', 'Light entity ID')
    .option('--min-kelvin <value>', 'Minimum color temperature in Kelvin')
    .option('--max-kelvin <value>', 'Maximum color temperature in Kelvin')
    .option('--min-brightness <value>', 'Minimum brightness (0-255)')
    .option('--max-brightness <value>', 'Maximum brightness (0-255)')
    .option('--json', 'Output as JSON')
    .action(async (entityId, options) => {
      try {
        if (!entityId) {
          // Show configuration info
          output.header('Adaptive Lighting Configuration');
          output.info('Adaptive lighting configuration is typically managed through:');
          console.log();
          output.keyValue('1. Integration UI', 'Configure via HomeAssistant UI');
          output.keyValue('2. YAML Config', 'Edit configuration.yaml');
          output.keyValue('3. This CLI', 'Use --min-kelvin, --max-kelvin, etc.');
          console.log();
          output.warning('Direct configuration modification requires custom setup');
          return;
        }

        // Show current light configuration
        const spin = output.spinner(`Fetching ${entityId} configuration...`);
        const client = getHAClient();
        const light = await client.getState(entityId);
        spin.stop();

        if (options.json) {
          output.outputJSON({
            entity_id: light.entity_id,
            min_kelvin: light.attributes.min_color_temp_kelvin,
            max_kelvin: light.attributes.max_color_temp_kelvin,
            current_kelvin: light.attributes.color_temp_kelvin,
            brightness: light.attributes.brightness
          });
          return;
        }

        output.header(`Light Configuration: ${entityId}`);
        output.keyValue('Name', light.attributes.friendly_name || entityId);
        output.keyValue('Min Kelvin', light.attributes.min_color_temp_kelvin?.toString() || 'N/A');
        output.keyValue('Max Kelvin', light.attributes.max_color_temp_kelvin?.toString() || 'N/A');
        output.keyValue('Current Kelvin', light.attributes.color_temp_kelvin?.toString() || 'N/A');
        output.keyValue('Brightness', output.formatBrightness(light.attributes.brightness));

        if (options.minKelvin || options.maxKelvin || options.minBrightness || options.maxBrightness) {
          console.log();
          output.warning('Configuration updates require custom adaptive lighting setup');
        }
      } catch (error: any) {
        output.error(`Failed to get configuration: ${error.message}`);
        process.exit(1);
      }
    });

  adaptive
    .command('simulate')
    .description('Simulate adaptive lighting for a specific time')
    .option('--date <ISO-date>', 'Simulate specific date/time (ISO format)')
    .option('--light <entity_id>', 'Specific light to simulate')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      try {
        const date = options.date ? new Date(options.date) : new Date();
        const hour = date.getHours();
        
        // Simple circadian rhythm simulation
        let kelvin: number;
        let brightness: number;
        
        if (hour < 6) {
          // Night: very warm, very dim
          kelvin = 2000;
          brightness = 10;
        } else if (hour < 8) {
          // Dawn: warming up
          kelvin = 2500;
          brightness = 50;
        } else if (hour < 12) {
          // Morning: bright and cool
          kelvin = 5000;
          brightness = 200;
        } else if (hour < 17) {
          // Afternoon: peak brightness
          kelvin = 6000;
          brightness = 255;
        } else if (hour < 20) {
          // Evening: cooling down
          kelvin = 4000;
          brightness = 150;
        } else if (hour < 22) {
          // Late evening: warm
          kelvin = 3000;
          brightness = 80;
        } else {
          // Night: very warm, dim
          kelvin = 2200;
          brightness = 20;
        }

        if (options.json) {
          output.outputJSON({
            date: date.toISOString(),
            hour,
            kelvin,
            brightness,
            brightness_percent: Math.round((brightness / 255) * 100)
          });
          return;
        }

        output.header('Adaptive Lighting Simulation');
        output.keyValue('Date/Time', date.toLocaleString());
        output.keyValue('Hour', hour.toString());
        output.keyValue('Color Temperature', output.formatKelvin(kelvin));
        output.keyValue('Brightness', output.formatBrightness(brightness));
        
        console.log();
        output.info('This is a simplified simulation');
        output.info('Actual adaptive lighting uses solar position and custom curves');

        if (options.light) {
          console.log();
          output.info(`To apply to ${options.light}:`);
          console.log(`  npm run ha lights set ${options.light} --kelvin ${kelvin} --brightness ${brightness}`);
        }
      } catch (error: any) {
        output.error(`Failed to simulate: ${error.message}`);
        process.exit(1);
      }
    });

  return adaptive;
}
