import { Command } from 'commander';
import { getHAClient } from '../utils/ha-client.js';
import * as output from '../utils/output.js';

export function createWatchCommand(): Command {
  const watch = new Command('watch')
    .description('Monitor entity state changes in real-time');

  watch
    .command('entity')
    .description('Watch a specific entity for state changes')
    .argument('<entity_id>', 'Entity ID to monitor')
    .option('--interval <seconds>', 'Polling interval in seconds', '2')
    .action(async (entityId, options) => {
      try {
        const interval = parseInt(options.interval) * 1000;
        const client = getHAClient();
        
        output.header(`Watching ${entityId}`);
        output.info(`Polling every ${options.interval} seconds. Press Ctrl+C to stop.\n`);

        let lastState: any = null;

        const poll = async () => {
          try {
            const entity = await client.getState(entityId);
            
            if (!lastState) {
              // First poll
              output.keyValue('Initial State', output.formatState(entity.state));
              if (entity.state === 'on' && entity.attributes.brightness) {
                output.keyValue('Brightness', output.formatBrightness(entity.attributes.brightness));
              }
              if (entity.state === 'on' && entity.attributes.color_temp_kelvin) {
                output.keyValue('Color Temp', output.formatKelvin(entity.attributes.color_temp_kelvin));
              }
              console.log();
            } else if (entity.state !== lastState.state || 
                       JSON.stringify(entity.attributes) !== JSON.stringify(lastState.attributes)) {
              // State changed
              const timestamp = new Date().toLocaleTimeString();
              output.info(`[${timestamp}] State changed:`);
              
              if (entity.state !== lastState.state) {
                output.keyValue('  State', `${output.formatState(lastState.state)} → ${output.formatState(entity.state)}`);
              }
              
              if (entity.attributes.brightness !== lastState.attributes.brightness) {
                output.keyValue('  Brightness', 
                  `${output.formatBrightness(lastState.attributes.brightness)} → ${output.formatBrightness(entity.attributes.brightness)}`
                );
              }
              
              if (entity.attributes.color_temp_kelvin !== lastState.attributes.color_temp_kelvin) {
                output.keyValue('  Color Temp', 
                  `${output.formatKelvin(lastState.attributes.color_temp_kelvin)} → ${output.formatKelvin(entity.attributes.color_temp_kelvin)}`
                );
              }
              
              console.log();
            }
            
            lastState = entity;
          } catch (error: any) {
            output.error(`Poll error: ${error.message}`);
          }
        };

        // Initial poll
        await poll();

        // Start polling
        const intervalId = setInterval(poll, interval);

        // Handle Ctrl+C
        process.on('SIGINT', () => {
          clearInterval(intervalId);
          console.log();
          output.info('Stopped watching');
          process.exit(0);
        });
      } catch (error: any) {
        output.error(`Failed to watch entity: ${error.message}`);
        process.exit(1);
      }
    });

  watch
    .command('lights')
    .description('Watch all lights for state changes')
    .option('--area <area>', 'Filter by area')
    .option('--interval <seconds>', 'Polling interval in seconds', '3')
    .action(async (options) => {
      try {
        const interval = parseInt(options.interval) * 1000;
        const client = getHAClient();
        
        output.header('Watching Lights');
        output.info(`Polling every ${options.interval} seconds. Press Ctrl+C to stop.\n`);

        let lastStates = new Map<string, any>();

        const poll = async () => {
          try {
            const states = await client.getStates();
            let lightStates = states.filter(e => e.entity_id.startsWith('light.'));

            if (options.area) {
              lightStates = lightStates.filter(e => 
                e.attributes.area_id === options.area ||
                e.attributes.friendly_name?.toLowerCase().includes(options.area.toLowerCase())
              );
            }

            lightStates.forEach(light => {
              const last = lastStates.get(light.entity_id);
              
              if (!last) {
                // First poll - just store
                lastStates.set(light.entity_id, light);
              } else if (light.state !== last.state) {
                // State changed
                const timestamp = new Date().toLocaleTimeString();
                const name = light.attributes.friendly_name || light.entity_id;
                output.info(`[${timestamp}] ${output.truncate(name, 30)}: ${output.formatState(last.state)} → ${output.formatState(light.state)}`);
                lastStates.set(light.entity_id, light);
              }
            });
          } catch (error: any) {
            output.error(`Poll error: ${error.message}`);
          }
        };

        // Initial poll
        await poll();
        output.info('Monitoring for changes...\n');

        // Start polling
        const intervalId = setInterval(poll, interval);

        // Handle Ctrl+C
        process.on('SIGINT', () => {
          clearInterval(intervalId);
          console.log();
          output.info('Stopped watching');
          process.exit(0);
        });
      } catch (error: any) {
        output.error(`Failed to watch lights: ${error.message}`);
        process.exit(1);
      }
    });

  return watch;
}
