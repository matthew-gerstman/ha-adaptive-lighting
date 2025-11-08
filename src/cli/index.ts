#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { createInfoCommand } from './commands/info.js';
import { createEntitiesCommand } from './commands/entities.js';
import { createLightsCommand } from './commands/lights.js';
import { createConfigCommand } from './commands/config.js';
import { createAutomationCommand } from './commands/automation.js';

const program = new Command();

program
  .name('ha')
  .description('HomeAssistant CLI utility for controlling your smart home')
  .version('1.0.0');

// Add commands
program.addCommand(createInfoCommand());
program.addCommand(createEntitiesCommand());
program.addCommand(createLightsCommand());
program.addCommand(createConfigCommand());
program.addCommand(createAutomationCommand());

// Placeholder command
program
  .command('adaptive')
  .description('Control adaptive lighting')
  .action(() => {
    console.log(chalk.yellow('Adaptive command - coming soon'));
  });

program.parse();
