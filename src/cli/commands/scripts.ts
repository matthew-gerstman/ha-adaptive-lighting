import { Command } from 'commander';
import { getHAClient } from '../utils/ha-client.js';
import * as output from '../utils/output.js';

export function createScriptsCommand(): Command {
  const scripts = new Command('scripts')
    .description('Manage and execute HomeAssistant scripts');

  scripts
    .command('list')
    .description('List all scripts')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      try {
        const spin = output.spinner('Fetching scripts...');
        const client = getHAClient();
        const states = await client.getStates();
        const scriptStates = states.filter(e => e.entity_id.startsWith('script.'));
        spin.stop();

        if (options.json) {
          output.outputJSON(scriptStates);
          return;
        }

        output.header(`Scripts (${scriptStates.length})`);
        const table = output.createTable(['Entity ID', 'Name', 'Last Triggered']);
        scriptStates.forEach(script => {
          const lastTriggered = script.attributes.last_triggered
            ? new Date(script.attributes.last_triggered).toLocaleString()
            : 'Never';
          
          table.push([
            output.truncate(script.entity_id, 35),
            output.truncate(script.attributes.friendly_name || script.entity_id, 30),
            output.truncate(lastTriggered, 20)
          ]);
        });
        output.printTable(table);
      } catch (error: any) {
        output.error(`Failed to list scripts: ${error.message}`);
        process.exit(1);
      }
    });

  scripts
    .command('run')
    .description('Execute a script')
    .argument('<script_id>', 'Script entity ID')
    .option('--data <json>', 'Script variables as JSON', '{}')
    .option('--json', 'Output as JSON')
    .action(async (scriptId, options) => {
      try {
        const data = JSON.parse(options.data);
        data.entity_id = scriptId;

        const spin = output.spinner(`Executing ${scriptId}...`);
        const client = getHAClient();
        await client.callService('script', 'turn_on', data);
        spin.succeed(`Executed ${scriptId}`);

        if (!options.json) {
          output.success('Script completed successfully');
        }
      } catch (error: any) {
        output.error(`Failed to execute script: ${error.message}`);
        process.exit(1);
      }
    });

  scripts
    .command('get')
    .description('Get script details')
    .argument('<script_id>', 'Script entity ID')
    .option('--json', 'Output as JSON')
    .action(async (scriptId, options) => {
      try {
        const spin = output.spinner(`Fetching ${scriptId}...`);
        const client = getHAClient();
        const script = await client.getState(scriptId);
        spin.stop();

        if (options.json) {
          output.outputJSON(script);
          return;
        }

        output.header(`Script: ${scriptId}`);
        output.keyValue('Name', script.attributes.friendly_name || scriptId);
        output.keyValue('State', output.formatState(script.state));
        output.keyValue('Last Triggered', 
          script.attributes.last_triggered
            ? new Date(script.attributes.last_triggered).toLocaleString()
            : 'Never'
        );
        output.keyValue('Mode', script.attributes.mode || 'N/A');

        if (script.attributes.current) {
          output.keyValue('Current Runs', script.attributes.current.toString());
        }

        console.log();
        output.header('Fields');
        if (script.attributes.fields) {
          Object.entries(script.attributes.fields).forEach(([key, value]: [string, any]) => {
            output.keyValue(key, value.description || 'No description');
          });
        } else {
          output.info('No fields defined');
        }
      } catch (error: any) {
        output.error(`Failed to get script: ${error.message}`);
        process.exit(1);
      }
    });

  scripts
    .command('stop')
    .description('Stop a running script')
    .argument('<script_id>', 'Script entity ID')
    .action(async (scriptId) => {
      try {
        const spin = output.spinner(`Stopping ${scriptId}...`);
        const client = getHAClient();
        await client.callService('script', 'turn_off', { entity_id: scriptId });
        spin.succeed(`Stopped ${scriptId}`);
      } catch (error: any) {
        output.error(`Failed to stop script: ${error.message}`);
        process.exit(1);
      }
    });

  return scripts;
}
