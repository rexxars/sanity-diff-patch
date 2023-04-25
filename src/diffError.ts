import {type Path, pathToString} from './paths.js'

/**
 * Represents an error that occurred during a diff process.
 * Contains `path`, `value` and `serializedPath` properties,
 * which is helpful for debugging and showing friendly messages.
 *
 * @public
 */
export class DiffError extends Error {
  public path: Path
  public value: unknown
  public serializedPath: string

  constructor(message: string, path: Path, value?: unknown) {
    const serializedPath = pathToString(path)
    super(`${message} (at '${serializedPath}')`)

    this.path = path
    this.serializedPath = serializedPath
    this.value = value
  }
}
