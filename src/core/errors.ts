import { PathLike } from 'fs';

export class PathDoesNotExistError extends Error {
  constructor(readonly path: PathLike) {
    super(`Failed to access '${path}', does it exist?`);
  }
}
