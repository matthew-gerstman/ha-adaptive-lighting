import { Command } from 'commander';
import { getHAClient } from '../utils/ha-client.js';
import * as output from '../utils/output.js';
import type { HAEntity } from '../../lib/types.js';

export function createQueryCommand(): Command {
  const query = new Command('query')
    .description('Advanced entity queries and filtering');

  query
    .command('find')
    .description('Find entities using complex filters')
    .option('--domain <domain>', 'Filter by domain')
    .option('--state <state>', 'Filter by state')
    .option('--attr <key=value>', 'Filter by attribute (repeatable)', [])
    .option('--name <pattern>', 'Filter by name pattern (case-insensitive)')
    .option('--unavailable', 'Show only unavailable entities')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      try {
        const spin = output.spinner('Querying entities...');
        const client = getHAClient();
        let states = await client.getStates();
        spin.stop();

        // Apply filters
        if (options.domain) {
          states = states.filter(e => e.entity_id.startsWith(options.domain + '.'));
        }

        if (options.state) {
          states = states.filter(e => e.state === options.state);
        }

        if (options.unavailable) {
          states = states.filter(e => e.state === 'unavailable');
        }

        if (options.name) {
          const pattern = options.name.toLowerCase();
          states = states.filter(e => 
            e.entity_id.toLowerCase().includes(pattern) ||
            e.attributes.friendly_name?.toLowerCase().includes(pattern)
          );
        }

        if (options.attr && options.attr.length > 0) {
          const attrs = Array.isArray(options.attr) ? options.attr : [options.attr];
          attrs.forEach((attr: string) => {
            const [key, value] = attr.split('=');
            states = states.filter(e => {
              const attrValue = e.attributes[key];
              if (attrValue === undefined) return false;
              return String(attrValue).toLowerCase() === value.toLowerCase();
            });
          });
        }

        if (options.json) {
          output.outputJSON(states);
          return;
        }

        output.header(`Query Results (${states.length})`);
        const table = output.createTable(['Entity ID', 'Name', 'State', 'Domain']);
        states.slice(0, 50).forEach(entity => {
          table.push([
            output.truncate(entity.entity_id, 30),
            output.truncate(entity.attributes.friendly_name || entity.entity_id, 25),
            output.formatState(entity.state),
            entity.entity_id.split('.')[0]
          ]);
        });
        output.printTable(table);

        if (states.length > 50) {
          console.log();
          output.info(`Showing first 50 of ${states.length} entities. Use --json for full list.`);
        }
      } catch (error: any) {
        output.error(`Failed to query entities: ${error.message}`);
        process.exit(1);
      }
    });

  query
    .command('count')
    .description('Count entities by domain, state, or attribute')
    .option('--by <field>', 'Group by field (domain, state, area)', 'domain')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      try {
        const spin = output.spinner('Analyzing entities...');
        const client = getHAClient();
        const states = await client.getStates();
        spin.stop();

        const counts = new Map<string, number>();

        states.forEach(entity => {
          let key: string;
          
          switch (options.by) {
            case 'domain':
              key = entity.entity_id.split('.')[0];
              break;
            case 'state':
              key = entity.state;
              break;
            case 'area':
              key = entity.attributes.area_id || 'no_area';
              break;
            default:
              key = 'unknown';
          }
          
          counts.set(key, (counts.get(key) || 0) + 1);
        });

        const countList = Array.from(counts.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        if (options.json) {
          output.outputJSON(countList);
          return;
        }

        output.header(`Entity Counts by ${options.by}`);
        const table = output.createTable([options.by.toUpperCase(), 'Count']);
        countList.forEach(({ name, count }) => {
          table.push([name, count.toString()]);
        });
        output.printTable(table);
        
        console.log();
        output.info(`Total: ${states.length} entities`);
      } catch (error: any) {
        output.error(`Failed to count entities: ${error.message}`);
        process.exit(1);
      }
    });

  query
    .command('stats')
    .description('Get statistics about your HomeAssistant setup')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      try {
        const spin = output.spinner('Gathering statistics...');
        const client = getHAClient();
        const states = await client.getStates();
        const config = await client.getConfig();
        spin.stop();

        const stats = {
          total_entities: states.length,
          domains: new Set(states.map(e => e.entity_id.split('.')[0])).size,
          unavailable: states.filter(e => e.state === 'unavailable').length,
          lights: states.filter(e => e.entity_id.startsWith('light.')).length,
          lights_on: states.filter(e => e.entity_id.startsWith('light.') && e.state === 'on').length,
          switches: states.filter(e => e.entity_id.startsWith('switch.')).length,
          sensors: states.filter(e => e.entity_id.startsWith('sensor.')).length,
          automations: states.filter(e => e.entity_id.startsWith('automation.')).length,
          automations_enabled: states.filter(e => e.entity_id.startsWith('automation.') && e.state === 'on').length,
          scripts: states.filter(e => e.entity_id.startsWith('script.')).length,
          scenes: states.filter(e => e.entity_id.startsWith('scene.')).length,
          version: config.version,
          location: config.location_name,
        };

        if (options.json) {
          output.outputJSON(stats);
          return;
        }

        output.header('HomeAssistant Statistics');
        
        output.section('Instance', '');
        output.keyValue('  Version', stats.version);
        output.keyValue('  Location', stats.location);
        
        console.log();
        output.section('Entities', '');
        output.keyValue('  Total', stats.total_entities.toString());
        output.keyValue('  Domains', stats.domains.toString());
        output.keyValue('  Unavailable', stats.unavailable.toString());
        
        console.log();
        output.section('Devices', '');
        output.keyValue('  Lights', `${stats.lights} (${stats.lights_on} on)`);
        output.keyValue('  Switches', stats.switches.toString());
        output.keyValue('  Sensors', stats.sensors.toString());
        
        console.log();
        output.section('Automation', '');
        output.keyValue('  Automations', `${stats.automations} (${stats.automations_enabled} enabled)`);
        output.keyValue('  Scripts', stats.scripts.toString());
        output.keyValue('  Scenes', stats.scenes.toString());
      } catch (error: any) {
        output.error(`Failed to get statistics: ${error.message}`);
        process.exit(1);
      }
    });

  return query;
}
