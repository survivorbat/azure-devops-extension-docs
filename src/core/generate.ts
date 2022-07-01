import * as fs from 'fs';
import { PathDoesNotExistError } from './errors';
import path from 'path';
import twig from 'twig';
import glob from 'glob-promise';
import { ExtensionData } from './objects';
import consola from 'consola';

export const overviewPath = path.join(
  __dirname,
  '..',
  'templates',
  'overview.twig',
);
export const extensionManifestName = 'vss-extension.json';
export const taskManifestName = 'task.json';

const verifyPathExists = async (basePath: string) => {
  consola.debug(`Verifying whether ${basePath} exists`);
  if (!fs.existsSync(basePath)) {
    throw new PathDoesNotExistError(basePath);
  }
};

const writeToFile = async (destination: string, data: ExtensionData) => {
  consola.debug(`Converting data using ${overviewPath}`);
  const output: string = await new Promise((resolve, reject) => {
    twig.renderFile(overviewPath, data, (err: Error, result: string) => {
      if (err) {
        reject(err.message);
      }

      resolve(result);
    });
  });

  consola.debug(`Writing ${output.length} characters to ${destination}`);
  await fs.promises.writeFile(destination, output);
};

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

export const generateMarkdown = async (basePath: string, output: string) => {
  const expectedManifestPath = path.join(basePath, extensionManifestName);

  // Wanted to make these parallel, but that's harder to test
  await verifyPathExists(basePath);
  await verifyPathExists(expectedManifestPath);

  const data = await readData(basePath, expectedManifestPath);

  await writeToFile(output, data);

  consola.success(`Successfully turned ${basePath} into ${output}`);
};
