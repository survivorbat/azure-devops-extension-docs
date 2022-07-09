import path from 'path';
import tmp from 'tmp';
import { exec, ExecException } from 'child_process';
import * as fs from 'fs';
import os from 'os';

tmp.setGracefulCleanup();

const nodePath = path.join(__dirname, '..', 'node_modules', '.bin', 'ts-node');
const basePath = path.join(__dirname, '..', 'examples');
const executable = path.join(__dirname, 'cli.ts');

interface CommandResult {
  code: number;
  error: ExecException | null;
  stdout: string;
  stderr: string;
}

/**
 * Method to run the cli.ts
 * @param args
 * @param cwd
 */
const cli = (args: string[], cwd: string): Promise<CommandResult> =>
  new Promise((resolve) => {
    exec(
      `${nodePath} ${executable} ${args.join(' ')}`,
      { cwd },
      (error, stdout, stderr) => {
        resolve({
          code: error && error.code ? error.code : 0,
          error,
          stdout,
          stderr,
        });
      },
    );
  });

describe('cli', () => {
  describe('generate', () => {
    const testData = [
      {
        input: path.join(basePath, 'simple', 'src'),
        expectedOutput: path.join(basePath, 'simple', 'overview.md'),
      },
      {
        input: path.join(basePath, 'simple-with-tasks', 'src'),
        expectedOutput: path.join(basePath, 'simple-with-tasks', 'overview.md'),
      },
      {
        input: path.join(basePath, 'custom-template', 'src'),
        expectedOutput: path.join(basePath, 'custom-template', 'overview.md'),
        customTemplate: path.join(basePath, 'custom-template', 'template.md'),
      },
      {
        input: path.join(basePath, 'simple-excluding-version', 'src'),
        expectedOutput: path.join(
          basePath,
          'simple-excluding-version',
          'overview.md',
        ),
        excludes: path.join(
          basePath,
          'simple-excluding-version',
          'excludes.md',
        ),
      },
      {
        input: path.join(basePath, 'embed-in-existing', 'src'),
        expectedOutput: path.join(basePath, 'embed-in-existing', 'overview.md'),
        excludes: path.join(basePath, 'embed-in-existing', 'excludes.md'),
        embed: true,
      },
    ];

    // Walk through all the examples and verify whether they are correct
    testData.forEach(
      ({ expectedOutput, embed, input, customTemplate, excludes }) => {
        const resultFile = tmp.fileSync().name;

        it(`generates ${expectedOutput} from ${input}`, async () => {
          // Arrange
          let args = ['--output', resultFile];

          if (embed) {
            // Write the expected output file to the tmp
            fs.writeFileSync(
              resultFile,
              fs.readFileSync(expectedOutput, 'utf-8'),
            );
          }

          if (customTemplate) {
            args.push('--template', customTemplate);
          }

          if (excludes) {
            fs.readFileSync(excludes, 'utf-8')
              .split(os.EOL)
              .forEach((exclude) => args.push('--exclude', exclude));
          }

          // Act
          const result = await cli(['generate', input, ...args], '.');

          // Assert
          expect(result.code).toEqual(0);

          const expected = fs.readFileSync(expectedOutput, 'utf-8');
          const actual = fs.readFileSync(resultFile, 'utf-8');
          expect(actual).toEqual(expected);
        });
      },
    );
  });
});
