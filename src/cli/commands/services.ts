import { Command } from 'commander';
import { getHAClient } from '../utils/ha-client.js';
import * as output from '../utils/output.js';

export function createServicesCommand(): Command {
  const services = new Command('services')
    .description('Discover and inspect available services');

  services
    .command('list')
    .description('List all available services')
    .option('--domain <domain>', 'Filter by domain')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      try {
        const spin = output.spinner('Fetching services...');
        const client = getHAClient();
        const serviceData = await client.getServices();
        spin.stop();

        let services: any[] = [];
        Object.entries(serviceData).forEach(([domain, data]: [string, any]) => {
          if (options.domain && domain !== options.domain) return;
          
          Object.entries(data.services || data).forEach(([service, details]: [string, any]) => {
            services.push({
              domain,
              service,
              name: details.name || service,
              description: details.description || 'No description'
            });
          });
        });

        if (options.json) {
          output.outputJSON(services);
          return;
        }

        output.header(`Services (${services.length})`);
        const table = output.createTable(['Domain', 'Service', 'Description']);
        services.slice(0, 50).forEach(svc => {
          table.push([
            svc.domain,
            svc.service,
            output.truncate(svc.description, 40)
          ]);
        });
        output.printTable(table);

        if (services.length > 50) {
          console.log();
          output.info(`Showing first 50 of ${services.length} services. Use --json for full list.`);
        }
      } catch (error: any) {
        output.error(`Failed to list services: ${error.message}`);
        process.exit(1);
      }
    });

  services
    .command('get')
    .description('Get detailed service information')
    .argument('<domain>', 'Service domain')
    .argument('<service>', 'Service name')
    .option('--json', 'Output as JSON')
    .action(async (domain, service, options) => {
      try {
        const spin = output.spinner(`Fetching ${domain}.${service}...`);
        const client = getHAClient();
        const serviceData = await client.getServices();
        spin.stop();

        const domainData = serviceData[domain as keyof typeof serviceData];
        if (!domainData) {
          output.error(`Domain '${domain}' not found`);
          process.exit(1);
        }

        const svcData = (domainData.services || domainData)[service];
        if (!svcData) {
          output.error(`Service '${service}' not found in domain '${domain}'`);
          process.exit(1);
        }

        if (options.json) {
          output.outputJSON(svcData);
          return;
        }

        output.header(`Service: ${domain}.${service}`);
        output.keyValue('Name', svcData.name || service);
        output.keyValue('Description', svcData.description || 'No description');

        if (svcData.fields && Object.keys(svcData.fields).length > 0) {
          console.log();
          output.header('Fields');
          Object.entries(svcData.fields).forEach(([field, details]: [string, any]) => {
            console.log();
            output.section(`  ${field}`, '');
            output.keyValue('    Description', details.description || 'No description');
            output.keyValue('    Required', details.required ? 'Yes' : 'No');
            if (details.example) {
              output.keyValue('    Example', JSON.stringify(details.example));
            }
          });
        } else {
          console.log();
          output.info('No fields defined');
        }
      } catch (error: any) {
        output.error(`Failed to get service: ${error.message}`);
        process.exit(1);
      }
    });

  services
    .command('call')
    .description('Call a service with custom data')
    .argument('<domain>', 'Service domain')
    .argument('<service>', 'Service name')
    .option('--data <json>', 'Service data as JSON', '{}')
    .option('--json', 'Output as JSON')
    .action(async (domain, service, options) => {
      try {
        const data = JSON.parse(options.data);

        const spin = output.spinner(`Calling ${domain}.${service}...`);
        const client = getHAClient();
        await client.callService(domain, service, data);
        spin.succeed(`Called ${domain}.${service}`);

        if (!options.json) {
          output.success('Service call completed');
        }
      } catch (error: any) {
        output.error(`Failed to call service: ${error.message}`);
        process.exit(1);
      }
    });

  return services;
}
