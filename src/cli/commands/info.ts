import { Command } from 'commander';
import { getHAClient } from '../utils/ha-client.js';
import * as output from '../utils/output.js';

export function createInfoCommand(): Command {
  const info = new Command('info')
    .description('Show HomeAssistant instance information');

  info
    .command('connection', { isDefault: true })
    .description('Show connection status and instance info')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      try {
        const spin = output.spinner('Connecting to HomeAssistant...');
        const client = getHAClient();
        
        const connected = await client.testConnection();
        if (!connected) {
          spin.fail('Failed to connect to HomeAssistant');
          process.exit(1);
        }

        const config = await client.getConfig();
        spin.succeed('Connected to HomeAssistant');

        if (options.json) {
          output.outputJSON({
            connected: true,
            version: config.version,
            location: config.location_name,
            timezone: config.time_zone,
            units: config.unit_system,
          });
        } else {
          output.header('HomeAssistant Info');
          output.keyValue('Version', config.version);
          output.keyValue('Location', config.location_name);
          output.keyValue('Timezone', config.time_zone);
          output.keyValue('Unit System', JSON.stringify(config.unit_system));
          output.keyValue('Latitude', config.latitude.toString());
          output.keyValue('Longitude', config.longitude.toString());
          console.log();
        }
      } catch (error: any) {
        output.error(`Failed to get info: ${error.message}`);
        process.exit(1);
      }
    });

  info
    .command('areas')
    .description('List all areas')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      try {
        const spin = output.spinner('Fetching areas...');
        const client = getHAClient();
        const areas = await client.getAreas();
        spin.stop();

        if (options.json) {
          output.outputJSON(areas);
          return;
        }

        if (areas.length === 0) {
          output.warning('No areas found (may require newer HA version)');
          return;
        }

        output.header(`Areas (${areas.length})`);
        const table = output.createTable(['Area ID', 'Name']);
        areas.forEach(area => {
          table.push([area.area_id, area.name]);
        });
        output.printTable(table);
      } catch (error: any) {
        output.error(`Failed to get areas: ${error.message}`);
        process.exit(1);
      }
    });

  info
    .command('domains')
    .description('List all domains and entity counts')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      try {
        const spin = output.spinner('Fetching entities...');
        const client = getHAClient();
        const states = await client.getStates();
        spin.stop();

        // Group by domain
        const domains = new Map<string, number>();
        states.forEach(entity => {
          const domain = entity.entity_id.split('.')[0];
          domains.set(domain, (domains.get(domain) || 0) + 1);
        });

        const domainList = Array.from(domains.entries())
          .map(([domain, count]) => ({ domain, count }))
          .sort((a, b) => b.count - a.count);

        if (options.json) {
          output.outputJSON(domainList);
          return;
        }

        output.header(`Domains (${domainList.length})`);
        const table = output.createTable(['Domain', 'Entities']);
        domainList.forEach(({ domain, count }) => {
          table.push([domain, count.toString()]);
        });
        output.printTable(table);
        
        console.log();
        output.info(`Total entities: ${states.length}`);
      } catch (error: any) {
        output.error(`Failed to get domains: ${error.message}`);
        process.exit(1);
      }
    });

  return info;
}
