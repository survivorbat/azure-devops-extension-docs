import * as fs from 'fs';
import { PathDoesNotExistError } from './errors';
import path from 'path';
import glob from 'glob-promise';
import { ExtensionData } from './objects';
import consola from 'consola';
import Handlebars from 'handlebars';
import { deleteProperties } from 'delete-object-property';
import os from "os";

export const extensionManifestName = 'vss-extension.json';
export const taskManifestName = 'task.json';
export const embedDelimiters = {
  start: '[//]: # (azure-devops-extension-docs-embed-start)',
  end: '[//]: # (azure-devops-extension-docs-embed-end)'
}

/**
 * Is a helper method to throw an error on a non-existent file
 * @param filePath
 */
export const verifyPathExists = (filePath: string) => {
  consola.debug(`Verifying whether ${filePath} exists`);
  if (!fs.existsSync(filePath)) {
    throw new PathDoesNotExistError(filePath);
  }
};

/**
 * Write the extension data to the given destination
 * @param destination
 * @param templatePath
 * @param data
 */
export const writeToFile = async (
  destination: string,
  templatePath: string,
  data: ExtensionData,
): Promise<void> => {
  consola.debug(`Converting data using ${templatePath}`);
  const templateContents = await fs.promises.readFile(templatePath, 'utf-8');
  const template = Handlebars.compile(templateContents);
  const output: string = template(data);

  if (!fs.existsSync(destination)) {
    consola.debug(`Writing ${output.length} characters to ${destination}`);
    return fs.promises.writeFile(destination, output);
  }

  consola.debug(`${destination} already exists, checking whether it contains embedding delimiters`);

  const contents = await fs.promises.readFile(destination, 'utf-8');

  let start = 0;
  let end = contents.length;

  if (contents.includes(embedDelimiters.start)) {
    consola.debug(`Found ${embedDelimiters.start} in ${destination}`);
    start = contents.indexOf(embedDelimiters.start);
  }

  if (contents.includes(embedDelimiters.end)) {
    consola.debug(`Found ${embedDelimiters.end} in ${destination}`);
    end = contents.indexOf(embedDelimiters.end);
  }

  // No delimiters, just write it
  if (start === 0 && end === contents.length) {
    consola.debug(`Writing ${output.length} characters to ${destination}`);
    return fs.promises.writeFile(destination, output);
  }

  const result = contents.substring(0, start + embedDelimiters.start.length) + output + contents.substring(end)

  consola.debug(`Writing ${result.length} characters to ${destination}`);
  return fs.promises.writeFile(destination, result);
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

interface GenerateOptions {
  output: string;
  template: string;
  exclude: string[];
}

/**
 * Main method, reads data and writes it to the output
 * @param basePath
 * @param options
 */
export const generateMarkdown = async (
  basePath: string,
  { output, template, exclude }: GenerateOptions,
) => {
  const expectedManifestPath = path.join(basePath, extensionManifestName);

  // Wanted to make these parallel, but that's harder to test
  verifyPathExists(basePath);
  verifyPathExists(expectedManifestPath);

  const data = await readData(basePath, expectedManifestPath);

  const excludedData = <ExtensionData>(
    deleteProperties(data, ...(exclude || []))
  );

  await writeToFile(output, template, excludedData);

  consola.success(`Successfully turned ${basePath} into ${output}`);
};
