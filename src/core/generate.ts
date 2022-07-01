import * as fs from 'fs';
import { PathDoesNotExistError } from './errors';
import path from 'path';
import glob from 'glob-promise';
import { ExtensionData } from './objects';
import consola from 'consola';
import Handlebars from 'handlebars';
import * as os from 'os';

export const templatePath = path.join(
  __dirname,
  '..',
  'templates',
  'overview.md',
);
export const extensionManifestName = 'vss-extension.json';
export const taskManifestName = 'task.json';

// Helper to show the options as a list
Handlebars.registerHelper(
  'inputType',
  (inputType: string, options: Record<string, string>): string => {
    if (inputType !== 'radio') {
      return inputType;
    }

    return Object.keys(options).join(', ');
  },
);

// Helper to strip newlines
Handlebars.registerHelper('strip-newlines', (input: string): string =>
  (input || '').replace(os.EOL, ' '),
);

/**
 * Is a helper method to throw an error on a non-existent file
 * @param filePath
 */
const verifyPathExists = async (filePath: string) => {
  consola.debug(`Verifying whether ${filePath} exists`);
  if (!fs.existsSync(filePath)) {
    throw new PathDoesNotExistError(filePath);
  }
};

/**
 * Write the extension data to the given destination
 * @param destination
 * @param data
 */
const writeToFile = async (
  destination: string,
  data: ExtensionData,
): Promise<void> => {
  consola.debug(`Converting data using ${templatePath}`);
  const templateContents = await fs.promises.readFile(templatePath, 'utf-8');
  const template = Handlebars.compile(templateContents);
  const output: string = template(data);

  consola.debug(`Writing ${output.length} characters to ${destination}`);
  return fs.promises.writeFile(destination, output);
};

/**
 * Read data from vss-extension.json and any task.json files in the underlying directories
 * @param basePath
 * @param manifestPath
 */
const readData = async (
  basePath: string,
  manifestPath: string,
): Promise<ExtensionData> => {
  const taskGlob = path.join(basePath, '**', taskManifestName);
  const taskFiles = await glob.promise(taskGlob);

  const promises = [manifestPath, ...taskFiles].map(async (filePath) => {
    consola.debug(`Reading ${filePath}`);
    return fs.promises.readFile(filePath, 'utf-8');
  });

  const results = await Promise.all(promises);

  return {
    extension: JSON.parse(results[0]),
    tasks: results.slice(1).map((data) => JSON.parse(data)),
  };
};

/**
 * Main method, reads data and writes it to the output
 * @param basePath
 * @param output
 */
export const generateMarkdown = async (basePath: string, output: string) => {
  const expectedManifestPath = path.join(basePath, extensionManifestName);

  // Wanted to make these parallel, but that's harder to test
  await verifyPathExists(basePath);
  await verifyPathExists(expectedManifestPath);

  const data = await readData(basePath, expectedManifestPath);

  await writeToFile(output, data);

  consola.success(`Successfully turned ${basePath} into ${output}`);
};
