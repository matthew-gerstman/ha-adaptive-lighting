import { Command } from 'commander';
import { getHAClient } from '../utils/ha-client.js';
import * as output from '../utils/output.js';

export function createConfigCommand(): Command {
  const config = new Command('config')
    .description('HomeAssistant configuration management');

  config
    .command('show')
    .description('Show HomeAssistant configuration')
    .option('--section <section>', 'Show specific section')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      try {
        const spin = output.spinner('Fetching configuration...');
        const client = getHAClient();
        const haConfig = await client.getConfig();
        spin.stop();

        if (options.json) {
          if (options.section) {
            output.outputJSON(haConfig[options.section]);
          } else {
            output.outputJSON(haConfig);
          }
          return;
        }

        output.header('HomeAssistant Configuration');
        
        if (options.section) {
          const sectionData = haConfig[options.section];
          if (sectionData) {
            console.log(JSON.stringify(sectionData, null, 2));
          } else {
            output.warning(`Section '${options.section}' not found`);
          }
        } else {
          output.keyValue('Version', haConfig.version);
          output.keyValue('Location', haConfig.location_name);
          output.keyValue('Timezone', haConfig.time_zone);
          output.keyValue('Elevation', haConfig.elevation?.toString() || 'N/A');
          output.keyValue('Unit System', JSON.stringify(haConfig.unit_system));
          output.keyValue('Currency', haConfig.currency || 'N/A');
          output.keyValue('Country', haConfig.country || 'N/A');
          output.keyValue('Language', haConfig.language || 'N/A');
          
          console.log();
          output.section('Coordinates', `${haConfig.latitude}, ${haConfig.longitude}`);
          
          console.log();
          output.info('Use --section <name> to view specific configuration sections');
          output.info('Use --json for machine-readable output');
        }
      } catch (error: any) {
        output.error(`Failed to get configuration: ${error.message}`);
        process.exit(1);
      }
    });

  config
    .command('reload')
    .description('Reload HomeAssistant core configuration')
    .action(async () => {
      try {
        output.warning('This will reload HomeAssistant core configuration');
        
        const spin = output.spinner('Reloading configuration...');
        const client = getHAClient();
        await client.reloadConfig();
        spin.succeed('Configuration reloaded successfully');
        
        output.info('Some changes may require a full restart');
      } catch (error: any) {
        output.error(`Failed to reload configuration: ${error.message}`);
        process.exit(1);
      }
    });

  config
    .command('validate')
    .description('Check HomeAssistant configuration')
    .action(async () => {
      try {
        const spin = output.spinner('Validating configuration...');
        const client = getHAClient();
        
        try {
          await client.checkConfig();
          spin.succeed('Configuration is valid');
        } catch (error: any) {
          spin.fail('Configuration validation failed');
          output.error(error.message);
          process.exit(1);
        }
      } catch (error: any) {
        output.error(`Failed to validate configuration: ${error.message}`);
        process.exit(1);
      }
    });

  config
    .command('backup')
    .description('Information about backing up configuration')
    .action(() => {
      output.header('Configuration Backup');
      output.info('HomeAssistant configuration backup is typically done through:');
      console.log();
      output.keyValue('1. Snapshots', 'Use the Supervisor panel for full backups');
      output.keyValue('2. Git', 'Version control your configuration.yaml');
      output.keyValue('3. Add-ons', 'Install backup add-ons like "Home Assistant Google Drive Backup"');
      console.log();
      output.warning('This CLI does not directly create backups');
      output.info('Consider using HA built-in backup features or add-ons');
    });

  return config;
}
