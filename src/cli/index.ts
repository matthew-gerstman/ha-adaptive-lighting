#!/usr/bin/env node
import { Command } from 'commander';
import { createInfoCommand } from './commands/info.js';
import { createEntitiesCommand } from './commands/entities.js';
import { createLightsCommand } from './commands/lights.js';
import { createConfigCommand } from './commands/config.js';
import { createAutomationCommand } from './commands/automation.js';
import { createAdaptiveCommand } from './commands/adaptive.js';
import { createScenesCommand } from './commands/scenes.js';
import { createWatchCommand } from './commands/watch.js';

const program = new Command();

program
  .name('ha')
  .description('HomeAssistant CLI utility for controlling your smart home')
  .version('1.0.0');

// Add all commands
program.addCommand(createInfoCommand());
program.addCommand(createEntitiesCommand());
program.addCommand(createLightsCommand());
program.addCommand(createConfigCommand());
program.addCommand(createAutomationCommand());
program.addCommand(createAdaptiveCommand());
program.addCommand(createScenesCommand());
program.addCommand(createWatchCommand());

program.parse();
