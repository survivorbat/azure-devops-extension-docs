import tmp from 'tmp';
import path from 'path';
import * as fs from 'fs';
import {
  extensionManifestName,
  generateMarkdown,
  taskManifestName,
} from './generate';

tmp.setGracefulCleanup();

describe('generateMarkdown', () => {
  const testData = [
    {
      basePath: 'test-folder',
      destination: 'other-test',
      expected: `# My Super Extension

This extension is amazing`,
      files: [
        {
          name: extensionManifestName,
          directory: '.',
          contents: {
            name: 'My Super Extension',
            description: 'This extension is amazing',
          },
        },
      ],
    },
    {
      basePath: 'another',
      destination: 'yup',
      expected: `# I Love Extensions

Or maybe I don't`,
      files: [
        {
          name: extensionManifestName,
          directory: '.',
          contents: {
            name: 'I Love Extensions',
            description: "Or maybe I don't",
          },
        },
        {
          name: taskManifestName,
          directory: 'task1',
          contents: {},
        },
        {
          name: taskManifestName,
          directory: 'task2',
          contents: {},
        },
      ],
    },
  ];

  testData.forEach(({ basePath, destination }) => {
    it(`throws error if ${basePath} does not exist`, async () => {
      // Act
      const result = async () => generateMarkdown(basePath, destination);

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
      // Act
      const result = async () => generateMarkdown(basePath, destination);

      // Assert
      await expect(result).rejects.toThrow(
        `Failed to access '${path.join(
          basePath,
          extensionManifestName,
        )}', does it exist?`,
      );
    });
  });

  testData.forEach(({ basePath, destination, files, expected }) => {
    const tmpDir = tmp.dirSync().name;
    destination = path.join(tmpDir, destination);
    basePath = path.join(tmpDir, basePath);
    fs.mkdirSync(basePath);

    it(`writes expected output to '${destination}' in '${basePath}'`, async () => {
      // Arrange
      files.forEach(({ directory, name, contents }) => {
        const fullDirectory = path.join(basePath, directory);
        fs.mkdirSync(fullDirectory, { recursive: true });

        const fullPath = path.join(fullDirectory, name);
        fs.writeFileSync(fullPath, JSON.stringify(contents));
      });

      // Act
      await generateMarkdown(basePath, destination);

      // Assert
      const result = fs.readFileSync(destination, 'utf-8');
      expect(result).toEqual(expected);
    });
  });
});
