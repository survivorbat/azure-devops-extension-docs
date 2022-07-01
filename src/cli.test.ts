import path from 'path';
import tmp from 'tmp';
import { exec, ExecException } from 'child_process';
import * as fs from 'fs';

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
    // Read the examples folder and use those for testing
    const inputs = fs.readdirSync(basePath).map((dirName) => {
      const contents = fs.readdirSync(path.join(basePath, dirName));

      return {
        expectedOutput: path.join(
          basePath,
          dirName,
          contents.find((c) => c.endsWith('.md'))!,
        ),
        input: path.join(
          basePath,
          dirName,
          contents.find((c) => !c.endsWith('.md'))!,
        ),
      };
    });

    // Walk through all the examples and verify whether they are correct
    inputs.forEach(({ expectedOutput, input }) => {
      const resultFile = tmp.fileSync().name;

      it(`generates ${expectedOutput} from ${input}`, async () => {
        // Act
        const result = await cli(
          ['generate', input, '--output', resultFile],
          '.',
        );

        // Assert
        expect(result.code).toEqual(0);

        const expected = fs.readFileSync(expectedOutput, 'utf-8');
        const actual = fs.readFileSync(resultFile, 'utf-8');
        expect(actual).toEqual(expected);
      });
    });
  });
});
