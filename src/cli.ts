#!/usr/bin/env node

import { program } from 'commander';
import { generateMarkdown } from './core/generate';
import consola from 'consola';

program
  .command('generate <basePath>')
  .description('Generate a markdown file based on your manifests')
  .option('-o, --output <output>', 'File to write to', 'overview.md')
  .action((basePath, { output }) => generateMarkdown(basePath, output));

try {
  program.parse();
} catch (e) {
  if (e instanceof Error) {
    consola.error(`Something went wrong: ${e.message}`);
  }
}
