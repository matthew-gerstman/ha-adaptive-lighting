#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { createInfoCommand } from './commands/info.js';
import { createEntitiesCommand } from './commands/entities.js';

const program = new Command();

program
  .name('ha')
  .description('HomeAssistant CLI utility for controlling your smart home')
  .version('1.0.0');

// Add commands
program.addCommand(createInfoCommand());
program.addCommand(createEntitiesCommand());

// Placeholder commands
program
  .command('lights')
  .description('Control and query lights')
  .action(() => {
    console.log(chalk.yellow('Lights command - coming soon'));
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
