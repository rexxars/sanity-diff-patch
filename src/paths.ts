import type {KeyedSanityObject} from './diffPatch.js'

const IS_DOTTABLE_RE = /^[A-Za-z_][A-Za-z0-9_]*$/

/**
 * A segment of a path
 *
 * @public
 */
export type PathSegment =
  | string // Property
  | number // Array index
  | {_key: string} // Array `_key` lookup
  | [number | '', number | ''] // From/to array index

/**
 * An array of path segments representing a path in a document
 *
 * @public
 */
export type Path = PathSegment[]

/**
 * Converts an array path to a string path
 *
 * @param path - The array path to convert
 * @returns A stringified path
 * @internal
 */
export function pathToString(path: Path): string {
  return path.reduce((target: string, segment: PathSegment, i: number) => {
    if (Array.isArray(segment)) {
      return `${target}[${segment.join(':')}]`
    }

    if (isKeyedObject(segment)) {
      return `${target}[_key=="${segment._key}"]`
    }

    if (typeof segment === 'number') {
      return `${target}[${segment}]`
    }

    if (typeof segment === 'string' && !IS_DOTTABLE_RE.test(segment)) {
      return `${target}['${segment}']`
    }

    if (typeof segment === 'string') {
      const separator = i === 0 ? '' : '.'
      return `${target}${separator}${segment}`
    }

    throw new Error(`Unsupported path segment "${segment}"`)
  }, '')
}

function isKeyedObject(obj: any): obj is KeyedSanityObject {
  return typeof obj === 'object' && typeof obj._key === 'string'
}
