import {Path, pathToString} from './paths'

export class DiffError extends Error {
  public path: Path
  public serializedPath: string

  constructor(message: string, path: Path) {
    const serializedPath = pathToString(path)
    super(`${message} (at '${serializedPath}')`)

    this.path = path
    this.serializedPath = serializedPath
  }
}
