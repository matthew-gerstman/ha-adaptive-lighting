import { Command } from 'commander';
import { getHAClient } from '../utils/ha-client.js';
import * as output from '../utils/output.js';

export function createSwitchesCommand(): Command {
  const switches = new Command('switches')
    .description('Control switches');

  switches
    .command('list')
    .description('List all switches')
    .option('--area <area>', 'Filter by area')
    .option('--state <on|off>', 'Filter by state')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      try {
        const spin = output.spinner('Fetching switches...');
        const client = getHAClient();
        let states = await client.getStates();
        spin.stop();

        let switchStates = states.filter(e => e.entity_id.startsWith('switch.'));

        if (options.area) {
          switchStates = switchStates.filter(e => 
            e.attributes.area_id === options.area ||
            e.attributes.friendly_name?.toLowerCase().includes(options.area.toLowerCase())
          );
        }

        if (options.state) {
          switchStates = switchStates.filter(e => e.state === options.state);
        }

        if (options.json) {
          output.outputJSON(switchStates);
          return;
        }

        output.header(`Switches (${switchStates.length})`);
        const table = output.createTable(['Entity ID', 'Name', 'State']);
        switchStates.forEach(sw => {
          table.push([
            output.truncate(sw.entity_id, 35),
            output.truncate(sw.attributes.friendly_name || sw.entity_id, 35),
            output.formatState(sw.state)
          ]);
        });
        output.printTable(table);
      } catch (error: any) {
        output.error(`Failed to list switches: ${error.message}`);
        process.exit(1);
      }
    });

  switches
    .command('on')
    .description('Turn on a switch')
    .argument('<entity_id>', 'Switch entity ID')
    .action(async (entityId) => {
      try {
        const spin = output.spinner(`Turning on ${entityId}...`);
        const client = getHAClient();
        await client.callService('switch', 'turn_on', { entity_id: entityId });
        spin.succeed(`Turned on ${entityId}`);
      } catch (error: any) {
        output.error(`Failed to turn on switch: ${error.message}`);
        process.exit(1);
      }
    });

  switches
    .command('off')
    .description('Turn off a switch')
    .argument('<entity_id>', 'Switch entity ID')
    .action(async (entityId) => {
      try {
        const spin = output.spinner(`Turning off ${entityId}...`);
        const client = getHAClient();
        await client.callService('switch', 'turn_off', { entity_id: entityId });
        spin.succeed(`Turned off ${entityId}`);
      } catch (error: any) {
        output.error(`Failed to turn off switch: ${error.message}`);
        process.exit(1);
      }
    });

  switches
    .command('toggle')
    .description('Toggle a switch')
    .argument('<entity_id>', 'Switch entity ID')
    .action(async (entityId) => {
      try {
        const spin = output.spinner(`Toggling ${entityId}...`);
        const client = getHAClient();
        await client.callService('switch', 'toggle', { entity_id: entityId });
        spin.succeed(`Toggled ${entityId}`);
      } catch (error: any) {
        output.error(`Failed to toggle switch: ${error.message}`);
        process.exit(1);
      }
    });

  return switches;
}
