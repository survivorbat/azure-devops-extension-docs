import tmp, {dirSync} from 'tmp';
import path from 'path';
import * as fs from 'fs';
import {embedDelimiters, extensionManifestName, generateMarkdown, verifyPathExists, writeToFile} from './generate';
import {PathDoesNotExistError} from "./errors";
import {ExtensionData} from "./objects";
import {writeFileSync} from "fs";

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
        exclude: [],
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
        exclude: [],
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
        exclude: [],
      };

      // Act
      await generateMarkdown(basePath, config);

      // Assert
      const result = fs.existsSync(destination);
      expect(result).toBeTruthy();
    });
  });
});

describe('verifyPathExists', () => {
  const testData = [
    'my-file',
    path.join('some', 'deep', 'directory')
  ];

  testData.forEach((inputPath) => {
    const tmpDir = tmp.dirSync().name
    inputPath = path.join(tmpDir, inputPath);

    it( `Throws an error if ${inputPath} does not exist`, () => {
      // Act
      const result = () => verifyPathExists(inputPath);

      // Assert
      expect(result).toThrow(new PathDoesNotExistError(inputPath))
    })
  });

  testData.forEach((inputPath) => {
    const tmpDir = tmp.dirSync().name
    inputPath = path.join(tmpDir, inputPath);
    fs.mkdirSync(inputPath, {recursive: true})

    it( `Does not throw an error if ${inputPath} exists`, () => {
      // Act
      const result = () => verifyPathExists(inputPath);

      // Assert
      expect(result).not.toThrow(new PathDoesNotExistError(inputPath))
    })
  });
});

describe('writeToFile', () => {
  const testData = [
    // Normal template parsing
    {
      templatePath: path.join('template.md'),
      templateContents: '# {{ extension.name }}',
      destination: path.join('overview.md'),
      expected: '# testExtension',
      data: <ExtensionData>{
        extension: {
          name: 'testExtension',
        }
      },
    },
    // Overwrite existing without embed comments
    {
      templatePath: path.join('template.md'),
      templateContents: '# {{ extension.name }}',
      destination: path.join('overview.md'),
      destinationContents: 'existing',
      expected: '# testExtension',
      data: <ExtensionData>{
        extension: {
          name: 'testExtension',
        }
      },
    },
    // Embed with beginning and end
    {
      templatePath: path.join('template.md'),
      templateContents: '# {{ extension.name }}',
      destination: path.join('overview.md'),
      destinationContents: `before${embedDelimiters.start}${embedDelimiters.end}after`,
      expected: `before${embedDelimiters.start}# testExtension${embedDelimiters.end}after`,
      data: <ExtensionData>{
        extension: {
          name: 'testExtension',
        }
      },
    },
    // Embed with beginning only
    {
      templatePath: path.join('template.md'),
      templateContents: '# {{ extension.name }}',
      destination: path.join('overview.md'),
      destinationContents: `before${embedDelimiters.start}`,
      expected: `before${embedDelimiters.start}# testExtension`,
      data: <ExtensionData>{
        extension: {
          name: 'testExtension',
        }
      },
    },
  ];

  testData.forEach(({templatePath, data, templateContents, destinationContents, expected, destination}) => {
    const tmpDir = tmp.dirSync().name;
    templatePath = path.join(tmpDir, templatePath);
    destination = path.join(tmpDir, destination);

    it(`writes expected output to ${destination}`, async () => {
      // Arrange
      fs.writeFileSync(templatePath, templateContents);

      if (destinationContents) {
        fs.writeFileSync(destination, destinationContents);
      }

      // Act
      await writeToFile(destination, templatePath, data);

      // Assert
      const result = fs.readFileSync(destination, 'utf-8');
      expect(result).toEqual(expected);
    });
  });
});
