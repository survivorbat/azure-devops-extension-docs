#!/usr/bin/env node

import { program } from 'commander';
import { generateMarkdown } from './core/generate';
import consola from 'consola';
import path from 'path';
import './templates/helpers';

const collect = (val: string, result: string[]) => result.concat(val);

program
  .command('generate <basePath>')
  .description('Generate a markdown file based on your manifests')
  .option('-o, --output <output>', 'File to write to', 'overview.md')
  .option(
    '-e, --exclude <exclude>',
    'Exclude field from the output, multiple allowed',
    collect,
    [],
  )
  .option(
    '-t, --template <template>',
    'Custom handlebars template to use',
    path.join(__dirname, 'templates', 'overview.md'),
  )
  .action(generateMarkdown);

try {
  program.parse();
} catch (e) {
  if (e instanceof Error) {
    consola.error(`Something went wrong: ${e.message}`);
  }
}
