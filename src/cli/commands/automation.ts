import { Command } from 'commander';
import { getHAClient } from '../utils/ha-client.js';
import * as output from '../utils/output.js';

export function createAutomationCommand(): Command {
  const automation = new Command('automation')
    .description('Manage HomeAssistant automations');

  automation
    .command('list')
    .description('List all automations')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      try {
        const spin = output.spinner('Fetching automations...');
        const client = getHAClient();
        const automations = await client.getAutomations();
        spin.stop();

        if (options.json) {
          output.outputJSON(automations);
          return;
        }

        output.header(`Automations (${automations.length})`);
        const table = output.createTable(['Entity ID', 'Name', 'State', 'Last Triggered']);
        automations.forEach(auto => {
          const lastTriggered = auto.attributes.last_triggered 
            ? new Date(auto.attributes.last_triggered).toLocaleString()
            : 'Never';
          
          table.push([
            output.truncate(auto.entity_id, 35),
            output.truncate(auto.attributes.friendly_name || auto.entity_id, 30),
            output.formatState(auto.state),
            output.truncate(lastTriggered, 20)
          ]);
        });
        output.printTable(table);
      } catch (error: any) {
        output.error(`Failed to list automations: ${error.message}`);
        process.exit(1);
      }
    });

  automation
    .command('get')
    .description('Get detailed information about an automation')
    .argument('<automation_id>', 'Automation entity ID')
    .option('--json', 'Output as JSON')
    .action(async (automationId, options) => {
      try {
        const spin = output.spinner(`Fetching ${automationId}...`);
        const client = getHAClient();
        const auto = await client.getState(automationId);
        spin.stop();

        if (options.json) {
          output.outputJSON(auto);
          return;
        }

        output.header(`Automation: ${automationId}`);
        output.keyValue('Name', auto.attributes.friendly_name || automationId);
        output.keyValue('State', output.formatState(auto.state));
        output.keyValue('Last Triggered', 
          auto.attributes.last_triggered 
            ? new Date(auto.attributes.last_triggered).toLocaleString()
            : 'Never'
        );
        output.keyValue('Mode', auto.attributes.mode || 'N/A');
        
        if (auto.attributes.current) {
          output.keyValue('Current Runs', auto.attributes.current.toString());
        }

        console.log();
        output.header('Attributes');
        Object.entries(auto.attributes).forEach(([key, value]) => {
          if (!['friendly_name', 'last_triggered', 'mode', 'current'].includes(key)) {
            const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
            output.keyValue(key, output.truncate(valueStr, 50));
          }
        });
      } catch (error: any) {
        output.error(`Failed to get automation: ${error.message}`);
        process.exit(1);
      }
    });

  automation
    .command('enable')
    .description('Enable an automation')
    .argument('<automation_id>', 'Automation entity ID')
    .action(async (automationId) => {
      try {
        const spin = output.spinner(`Enabling ${automationId}...`);
        const client = getHAClient();
        await client.enableAutomation(automationId);
        spin.succeed(`Enabled ${automationId}`);
      } catch (error: any) {
        output.error(`Failed to enable automation: ${error.message}`);
        process.exit(1);
      }
    });

  automation
    .command('disable')
    .description('Disable an automation')
    .argument('<automation_id>', 'Automation entity ID')
    .action(async (automationId) => {
      try {
        const spin = output.spinner(`Disabling ${automationId}...`);
        const client = getHAClient();
        await client.disableAutomation(automationId);
        spin.succeed(`Disabled ${automationId}`);
      } catch (error: any) {
        output.error(`Failed to disable automation: ${error.message}`);
        process.exit(1);
      }
    });

  automation
    .command('trigger')
    .description('Manually trigger an automation')
    .argument('<automation_id>', 'Automation entity ID')
    .option('--data <json>', 'Trigger data as JSON', '{}')
    .option('--skip-condition', 'Skip automation conditions')
    .action(async (automationId, options) => {
      try {
        const data = JSON.parse(options.data);
        if (options.skipCondition) {
          data.skip_condition = true;
        }

        const spin = output.spinner(`Triggering ${automationId}...`);
        const client = getHAClient();
        await client.triggerAutomation(automationId, data);
        spin.succeed(`Triggered ${automationId}`);
        
        if (options.skipCondition) {
          output.info('Conditions were skipped');
        }
      } catch (error: any) {
        output.error(`Failed to trigger automation: ${error.message}`);
        process.exit(1);
      }
    });

  return automation;
}
