import {AzeDoc} from "./index";
import tmp from "tmp";
import path from "path";
import * as fs from "fs";

describe('AzeDoc', () => {
  describe('constructor', () => {
    const testData = [
      {basePath: 'test-folder'},
      {basePath: 'another'}
    ];

    testData.forEach(({basePath}) => {
      it(`throws error if ${basePath} does not exist`, () => {
        // Act
        const result = () => new AzeDoc(basePath);

        // Assert
        expect(result).toThrow(`Failed to access '${basePath}', does it exist?`);
      })
    });

    testData.forEach(({basePath}) => {
      const tmpDir = tmp.dirSync().name
      basePath = path.join(tmpDir, basePath);
      fs.mkdirSync(basePath)

      it(`sets basePath if ${basePath} exists`, () => {
        // Act
        const result = new AzeDoc(basePath);

        // Assert
        expect(result.basePath).toEqual(basePath);
      })
    });
  });
});