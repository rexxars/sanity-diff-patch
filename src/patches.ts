import {Path} from './paths'

export interface SetPatch {
  op: 'set'
  path: Path
  value: unknown
}

export interface UnsetPatch {
  op: 'unset'
  path: Path
}

export interface InsertPatch {
  op: 'insert'
  after: Path
  items: any[]
}

export type Patch = SetPatch | UnsetPatch | InsertPatch

export interface SanitySetPatch {
  id: string
  set: {[key: string]: any}
}

export interface SanityUnsetPatch {
  id: string
  unset: string[]
}

export interface SanityInsertPatch {
  id: string
  insert:
    | {before: string; items: any[]}
    | {after: string; items: any[]}
    | {replace: string; items: any[]}
}

export type SanityPatch = SanitySetPatch | SanityUnsetPatch | SanityInsertPatch

export interface SanityPatchMutation {
  patch: SanityPatch
}
