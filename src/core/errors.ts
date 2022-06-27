import {PathLike} from "fs";

export class DirectoryDoesNotExistError extends Error {
  constructor(readonly path: PathLike) {
    super(`Failed to access '${path}', does it exist?`);
  }
}