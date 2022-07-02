import tmp from 'tmp';
import path from 'path';
import * as fs from 'fs';
import { extensionManifestName, generateMarkdown } from './generate';

tmp.setGracefulCleanup();

const defaultTemplate = path.join(__dirname, '..', 'templates', 'overview.md');

describe('generateMarkdown', () => {
  const testData = [
    {
      basePath: 'test-folder',
      destination: 'other-test',
    },
    {
      basePath: 'another',
      destination: 'yup',
    },
  ];

  testData.forEach(({ basePath, destination }) => {
    it(`throws error if ${basePath} does not exist`, async () => {
      // Arrange
      const config = {
        output: destination,
        template: defaultTemplate,
        excludes: [],
      };

      // Act
      const result = async () => generateMarkdown(basePath, config);

      // Assert
      await expect(result).rejects.toThrow(
        `Failed to access '${basePath}', does it exist?`,
      );
    });
  });

  testData.forEach(({ basePath, destination }) => {
    const tmpDir = tmp.dirSync().name;
    basePath = path.join(tmpDir, basePath);
    fs.mkdirSync(basePath);

    it(`throws error if ${basePath}/${extensionManifestName} does not exist`, async () => {
      // Arrange
      const config = {
        output: destination,
        template: defaultTemplate,
        excludes: [],
      };

      // Act
      const result = async () => generateMarkdown(basePath, config);

      // Assert
      await expect(result).rejects.toThrow(
        `Failed to access '${path.join(
          basePath,
          extensionManifestName,
        )}', does it exist?`,
      );
    });
  });

  // These tests are super basic, we run full tests in cli.test.ts
  testData.forEach(({ basePath, destination }) => {
    const tmpDir = tmp.dirSync().name;
    basePath = path.join(tmpDir, basePath);
    destination = path.join(tmpDir, destination);
    fs.mkdirSync(basePath);

    it(`creates '${destination}' from '${basePath}'`, async () => {
      // Arrange
      const fullPath = path.join(basePath, extensionManifestName);
      fs.writeFileSync(fullPath, '{}');

      const config = {
        output: destination,
        template: defaultTemplate,
        excludes: [],
      };

      // Act
      await generateMarkdown(basePath, config);

      // Assert
      const result = fs.existsSync(destination);
      expect(result).toBeTruthy();
    });
  });
});
