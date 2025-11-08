import chalk from 'chalk';
import Table from 'cli-table3';
import ora, { Ora } from 'ora';

export function outputJSON(data: any): void {
  console.log(JSON.stringify(data, null, 2));
}

export function createTable(head: string[], colWidths?: number[]): Table.Table {
  const config: any = {
    head: head.map(h => chalk.cyan.bold(h)),
    style: {
      head: [],
      border: ['gray']
    }
  };
  
  if (colWidths && colWidths.length > 0) {
    config.colWidths = colWidths;
  }
  
  return new Table(config);
}

export function success(message: string): void {
  console.log(chalk.green('✓'), message);
}

export function error(message: string): void {
  console.error(chalk.red('✗'), message);
}

export function warning(message: string): void {
  console.log(chalk.yellow('⚠'), message);
}

export function info(message: string): void {
  console.log(chalk.blue('ℹ'), message);
}

export function spinner(text: string): Ora {
  return ora(text).start();
}

export function formatState(state: string): string {
  switch (state.toLowerCase()) {
    case 'on':
      return chalk.green('on');
    case 'off':
      return chalk.gray('off');
    case 'unavailable':
      return chalk.red('unavailable');
    default:
      return state;
  }
}

export function formatBoolean(value: boolean): string {
  return value ? chalk.green('Yes') : chalk.gray('No');
}

export function formatNumber(value: number | undefined, suffix: string = ''): string {
  if (value === undefined) return chalk.gray('N/A');
  return `${value}${suffix}`;
}

export function formatKelvin(kelvin: number | undefined): string {
  if (kelvin === undefined) return chalk.gray('N/A');
  
  let color = chalk.white;
  if (kelvin < 3000) color = chalk.yellow;
  else if (kelvin > 5000) color = chalk.blue;
  
  return color(`${kelvin}K`);
}

export function formatBrightness(brightness: number | undefined): string {
  if (brightness === undefined) return chalk.gray('N/A');
  
  const percent = Math.round((brightness / 255) * 100);
  let color = chalk.white;
  if (percent < 30) color = chalk.gray;
  else if (percent > 70) color = chalk.yellow;
  
  return color(`${percent}%`);
}

export function truncate(str: string, maxLength: number = 40): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

export function header(text: string): void {
  console.log('\n' + chalk.bold.underline(text) + '\n');
}

export function section(title: string, content: string): void {
  console.log(chalk.bold(title + ':'), content);
}

export function keyValue(key: string, value: string): void {
  console.log(chalk.gray(key.padEnd(20)), value);
}

export function printTable(table: Table.Table): void {
  console.log(table.toString());
}
