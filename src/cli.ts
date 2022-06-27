#!/usr/bin/env node

import { program} from 'commander';
import {AzeDoc} from "./core";

program
  .command('generate <basePath>')
  .description('Generate a markdown file based on your manifests')
  .action((basePath) => new AzeDoc(basePath).generate());

try {
  program.parse();
} catch (e) {
  if (e instanceof Error) {
    console.error(`Error occurred: ${e.message}`);
  }
}