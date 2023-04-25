import type {Path} from './paths.js'

/**
 * A `set` operation
 * Replaces the current path, does not merge
 * Note: NOT a serializable mutation, see {@link SanitySetPatch} for that
 *
 * @public
 */
export interface SetPatch {
  op: 'set'
  path: Path
  value: unknown
}

/**
 * A `unset` operation
 * Unsets the entire value of the given path
 * Note: NOT a serializable mutation, see {@link SanityUnsetPatch} for that
 *
 * @public
 */
export interface UnsetPatch {
  op: 'unset'
  path: Path
}

/**
 * A `insert` operation
 * Inserts the given items _after_ the given path
 * Note: NOT a serializable mutation, see {@link SanityInsertPatch} for that
 *
 * @public
 */
export interface InsertAfterPatch {
  op: 'insert'
  after: Path
  items: any[]
}

/**
 * A `diffMatchPatch` operation
 * Applies the given `value` (unidiff format) to the given path. Must be a string.
 * Note: NOT a serializable mutation, see {@link SanityDiffMatchPatch} for that
 *
 * @public
 */
export interface DiffMatchPatch {
  op: 'diffMatchPatch'
  path: Path
  value: string
}

/**
 * A patch containing either a Sanity set, unset, insert or diffMatchPatch operation
 *
 * @public
 */
export type Patch = SetPatch | UnsetPatch | InsertAfterPatch | DiffMatchPatch

/**
 * A Sanity `set` patch mutation operation
 * Replaces the current path, does not merge
 *
 * @public
 */
export interface SanitySetPatch {
  id: string
  set: {[key: string]: any}
}

/**
 * A Sanity `unset` patch mutation operation
 * Unsets the entire value of the given path
 *
 * @public
 */
export interface SanityUnsetPatch {
  id: string
  unset: string[]
}

/**
 * A Sanity `insert` patch mutation operation
 * Inserts the given items at the given path (before/after)
 *
 * @public
 */
export interface SanityInsertPatch {
  id: string
  insert:
    | {before: string; items: any[]}
    | {after: string; items: any[]}
    | {replace: string; items: any[]}
}

/**
 * A Sanity `diffMatchPatch` patch mutation operation
 * Patches the given path with the given unidiff string.
 *
 * @public
 */
export interface SanityDiffMatchPatch {
  id: string
  diffMatchPatch: {[key: string]: string}
}

/**
 * A patch containing either a set, unset, insert or diffMatchPatch operation
 *
 * @public
 */
export type SanityPatch =
  | SanitySetPatch
  | SanityUnsetPatch
  | SanityInsertPatch
  | SanityDiffMatchPatch

/**
 * A mutation containing a single patch
 *
 * @public
 */
export interface SanityPatchMutation {
  patch: SanityPatch
}
