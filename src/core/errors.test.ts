import { PathDoesNotExistError } from './errors';

describe('PathDoesNotExistError', () => {
  describe('constructor', () => {
    const testData = ['test.ts', 'other.py'];

    testData.forEach((pathName) => {
      it(`sets expected message on construction`, () => {
        // Act
        const result = new PathDoesNotExistError(pathName);

        // Assert
        expect(result.message).toEqual(
          `Failed to access '${pathName}', does it exist?`,
        );
      });
    });
  });
});
