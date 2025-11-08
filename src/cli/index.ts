#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program
  .name('ha')
  .description('HomeAssistant CLI utility for controlling your smart home')
  .version('1.0.0');

program
  .command('info')
  .description('Show HomeAssistant instance information')
  .action(() => {
    console.log(chalk.yellow('Info command - coming soon'));
  });

program
  .command('lights')
  .description('Control and query lights')
  .action(() => {
    console.log(chalk.yellow('Lights command - coming soon'));
  });

program
  .command('entities')
  .description('Query and manage entities')
  .action(() => {
    console.log(chalk.yellow('Entities command - coming soon'));
  });

program
  .command('config')
  .description('Update HomeAssistant configuration')
  .action(() => {
    console.log(chalk.yellow('Config command - coming soon'));
  });

program
  .command('automation')
  .description('Manage automations')
  .action(() => {
    console.log(chalk.yellow('Automation command - coming soon'));
  });

program
  .command('adaptive')
  .description('Control adaptive lighting')
  .action(() => {
    console.log(chalk.yellow('Adaptive command - coming soon'));
  });

program.parse();
