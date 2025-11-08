import { Command } from 'commander';
import { getHAClient } from '../utils/ha-client.js';
import * as output from '../utils/output.js';

export function createEntitiesCommand(): Command {
  const entities = new Command('entities')
    .description('Query and manage entities');

  entities
    .command('list')
    .description('List all entities')
    .option('--domain <domain>', 'Filter by domain (e.g., light, switch, sensor)')
    .option('--area <area>', 'Filter by area')
    .option('--search <term>', 'Search by name or entity_id')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      try {
        const spin = output.spinner('Fetching entities...');
        const client = getHAClient();
        let states = await client.getStates();
        spin.stop();

        // Apply filters
        if (options.domain) {
          states = states.filter(e => e.entity_id.startsWith(options.domain + '.'));
        }

        if (options.area) {
          states = states.filter(e => 
            e.attributes.area_id === options.area ||
            e.attributes.friendly_name?.toLowerCase().includes(options.area.toLowerCase())
          );
        }

        if (options.search) {
          const term = options.search.toLowerCase();
          states = states.filter(e => 
            e.entity_id.toLowerCase().includes(term) ||
            e.attributes.friendly_name?.toLowerCase().includes(term)
          );
        }

        if (options.json) {
          output.outputJSON(states);
          return;
        }

        output.header(`Entities (${states.length})`);
        const table = output.createTable(['Entity ID', 'Name', 'State']);
        states.slice(0, 50).forEach(entity => {
          table.push([
            output.truncate(entity.entity_id, 35),
            output.truncate(entity.attributes.friendly_name || entity.entity_id, 30),
            output.formatState(entity.state)
          ]);
        });
        output.printTable(table);

        if (states.length > 50) {
          console.log();
          output.info(`Showing first 50 of ${states.length} entities. Use --json for full list.`);
        }
      } catch (error: any) {
        output.error(`Failed to list entities: ${error.message}`);
        process.exit(1);
      }
    });

  entities
    .command('get')
    .description('Get detailed information about an entity')
    .argument('<entity_id>', 'Entity ID to query')
    .option('--history <hours>', 'Include state history (hours)', '0')
    .option('--json', 'Output as JSON')
    .action(async (entityId, options) => {
      try {
        const spin = output.spinner(`Fetching ${entityId}...`);
        const client = getHAClient();
        
        const entity = await client.getState(entityId);
        
        let history = null;
        if (parseInt(options.history) > 0) {
          history = await client.getHistory(entityId, parseInt(options.history));
        }
        
        spin.stop();

        if (options.json) {
          output.outputJSON({ entity, history });
          return;
        }

        output.header(`Entity: ${entityId}`);
        output.keyValue('Name', entity.attributes.friendly_name || entityId);
        output.keyValue('State', output.formatState(entity.state));
        output.keyValue('Last Changed', new Date(entity.last_changed).toLocaleString());
        output.keyValue('Last Updated', new Date(entity.last_updated).toLocaleString());

        console.log();
        output.header('Attributes');
        Object.entries(entity.attributes).forEach(([key, value]) => {
          if (key !== 'friendly_name') {
            const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
            output.keyValue(key, output.truncate(valueStr, 50));
          }
        });

        if (history && history.length > 0) {
          console.log();
          output.header(`History (${options.history}h)`);
          output.info(`${history[0]?.length || 0} state changes`);
        }
      } catch (error: any) {
        output.error(`Failed to get entity: ${error.message}`);
        process.exit(1);
      }
    });

  entities
    .command('set')
    .description('Set entity state (advanced)')
    .argument('<entity_id>', 'Entity ID')
    .argument('<state>', 'New state')
    .option('--attr <key=value...>', 'Set attributes (repeatable)', [])
    .option('--json', 'Output as JSON')
    .action(async (entityId, state, options) => {
      try {
        output.warning('Direct state setting is advanced. Consider using domain-specific commands.');
        
        const attributes: Record<string, any> = {};
        if (options.attr) {
          const attrs = Array.isArray(options.attr) ? options.attr : [options.attr];
          attrs.forEach((attr: string) => {
            const [key, ...valueParts] = attr.split('=');
            attributes[key] = valueParts.join('=');
          });
        }

        output.info(`Setting ${entityId} to ${state}`);
        output.error('State setting via REST API is limited. Use service calls instead.');
        process.exit(1);
      } catch (error: any) {
        output.error(`Failed to set entity: ${error.message}`);
        process.exit(1);
      }
    });

  entities
    .command('call')
    .description('Call a service on an entity')
    .argument('<entity_id>', 'Entity ID')
    .argument('<service>', 'Service to call (e.g., turn_on, turn_off)')
    .option('--data <json>', 'Service data as JSON', '{}')
    .option('--json', 'Output as JSON')
    .action(async (entityId, service, options) => {
      try {
        const domain = entityId.split('.')[0];
        const data = JSON.parse(options.data);
        data.entity_id = entityId;

        const spin = output.spinner(`Calling ${domain}.${service}...`);
        const client = getHAClient();
        await client.callService(domain, service, data);
        spin.succeed(`Called ${domain}.${service} on ${entityId}`);

        if (!options.json) {
          output.success('Service call completed');
        }
      } catch (error: any) {
        output.error(`Failed to call service: ${error.message}`);
        process.exit(1);
      }
    });

  return entities;
}
