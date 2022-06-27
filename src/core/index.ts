import {PathLike} from "fs";
import * as fs from "fs";
import {DirectoryDoesNotExistError} from "./errors";

export class AzeDoc {
  constructor(readonly basePath: PathLike) {
    const stat = fs.existsSync(basePath);

    if (!stat) {
      throw new DirectoryDoesNotExistError(basePath);
    }
  }

  generate() {

  }
}