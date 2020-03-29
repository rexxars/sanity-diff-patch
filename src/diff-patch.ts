const ignoredKeys = ['_id', '_type', '_createdAt', '_updatedAt', '_rev']

type PrimitiveValue = string | number | boolean | null | undefined
type PathSegment = string | number | {_key: string} | [number | '', number | '']
type Path = PathSegment[]

interface KeyedSanityObject {
  [key: string]: any
  _key: string
}

type SanityObject = KeyedSanityObject | Partial<KeyedSanityObject>

interface DocumentStub {
  _id?: string
  _type?: string
  _rev?: string
  _createdAt?: string
  _updatedAt?: string
  [key: string]: any
}

interface PatchOptions {
  id?: string
  ifRevisionID?: string
  ifRevisionId?: string
  basePath?: Path
}

interface SetPatch {
  op: 'set'
  path: Path
  value: unknown
}

interface UnsetPatch {
  op: 'unset'
  path: Path
}

interface InsertPatch {
  op: 'insert'
  after: Path
  items: any[]
}

type Patch = SetPatch | UnsetPatch | InsertPatch

interface SanitySetPatch {
  id: string
  set: {[key: string]: any}
}

interface SanityUnsetPatch {
  id: string
  unset: string[]
}

interface SanityInsertPatch {
  id: string
  insert:
    | {before: string; items: any[]}
    | {after: string; items: any[]}
    | {replace: string; items: any[]}
}

type SanityPatch = SanitySetPatch | SanityUnsetPatch | SanityInsertPatch

interface SanityPatchMutation {
  patch: SanityPatch
}

export function diffPatch(itemA: DocumentStub, itemB: DocumentStub, options: PatchOptions = {}) {
  const id = options.id || (itemA._id === itemB._id && itemA._id)
  const ifRevisionID = options.ifRevisionID || options.ifRevisionId
  if (!id) {
    throw new Error(
      '_id on itemA and itemB not present or differs, specify document id the mutations should be applied to'
    )
  }

  const basePath = options.basePath || []
  const operations = diffItem(itemA, itemB, basePath, [])
  return serializePatches(operations, {id, ifRevisionID})
}

function diffItem(itemA: unknown, itemB: unknown, path: Path, patches: Patch[]) {
  if (itemA === itemB) {
    return patches
  }

  const aType = Array.isArray(itemA) ? 'array' : typeof itemA
  const bType = Array.isArray(itemB) ? 'array' : typeof itemB

  const aIsUndefined = aType === 'undefined'
  const bIsUndefined = bType === 'undefined'

  if (aIsUndefined && !bIsUndefined) {
    patches.push({op: 'set', path, value: itemB})
    return patches
  }

  if (!aIsUndefined && bIsUndefined) {
    patches.push({op: 'unset', path})
    return patches
  }

  const dataType = aIsUndefined ? bType : aType
  const isContainer = dataType === 'object' || dataType === 'array'
  if (!isContainer) {
    return diffPrimitive(itemA as PrimitiveValue, itemB as PrimitiveValue, path, patches)
  }

  if (aType !== bType) {
    // Array => Object / Object => Array
    patches.push({op: 'set', path, value: itemB})
    return patches
  }

  return dataType === 'array'
    ? diffArray(itemA as any[], itemB as any[], path, patches)
    : diffObject(itemA as object, itemB as object, path, patches)
}

function diffObject(itemA: SanityObject, itemB: SanityObject, path: Path, patches: Patch[]) {
  const atRoot = path.length === 0
  const aKeys = Object.keys(itemA).filter(atRoot ? withoutReadOnly : yes)
  const aKeysLength = aKeys.length
  const bKeys = Object.keys(itemB).filter(atRoot ? withoutReadOnly : yes)
  const bKeysLength = bKeys.length

  // Check for deleted items
  for (let i = 0; i < aKeysLength; i++) {
    const key = aKeys[i]
    if (!(key in itemB)) {
      patches.push({op: 'unset', path: path.concat(key)})
    }
  }

  // Check for changed items
  for (let i = 0; i < bKeysLength; i++) {
    const key = bKeys[i]
    diffItem(itemA[key], itemB[key], path.concat([key]), patches)
  }

  return patches
}

function diffArray(itemA: any[], itemB: any[], path: Path, patches: Patch[]) {
  // Check for new items
  if (itemB.length > itemA.length) {
    patches.push({
      op: 'insert',
      after: path.concat([-1]),
      items: itemB.slice(itemA.length)
    })
  }

  // Check for deleted items
  if (itemB.length < itemA.length) {
    const isSingle = itemA.length - itemB.length === 1
    patches.push({
      op: 'unset',
      path: path.concat([isSingle ? itemB.length : [itemB.length, '']])
    })
  }

  const overlapping = Math.min(itemA.length, itemB.length)
  const segmentA = itemA.slice(0, overlapping)
  const segmentB = itemB.slice(0, overlapping)
  const isKeyed = isUniquelyKeyed(segmentA) && isUniquelyKeyed(segmentB)
  return isKeyed
    ? diffArrayByKey(segmentA, segmentB, path, patches)
    : diffArrayByIndex(segmentA, segmentB, path, patches)
}

function diffArrayByIndex(itemA: any[], itemB: any[], path: Path, patches: Patch[]) {
  for (let i = 0; i < itemA.length; i++) {
    diffItem(itemA[i], itemB[i], path.concat(i), patches)
  }

  return patches
}

function diffArrayByKey(
  itemA: KeyedSanityObject[],
  itemB: KeyedSanityObject[],
  path: Path,
  patches: Patch[]
) {
  const keyedA = indexByKey(itemA)
  const keyedB = indexByKey(itemB)

  // There's a bunch of hard/semi-hard problems related to using keys
  // Unless we have the exact same order, just use indexes for now
  if (!arrayIsEqual(keyedA.keys, keyedB.keys)) {
    return diffArrayByIndex(itemA, itemB, path, patches)
  }

  for (let i = 0; i < keyedB.keys.length; i++) {
    const key = keyedB.keys[i]
    diffItem(keyedA.index[key], keyedB.index[key], path.concat({_key: key}), patches)
  }

  return patches
}

function diffPrimitive(
  _itemA: PrimitiveValue,
  itemB: PrimitiveValue,
  path: Path,
  patches: Patch[]
) {
  patches.push({
    op: 'set',
    path,
    value: itemB
  })

  return patches
}

function withoutReadOnly(key: string) {
  return ignoredKeys.indexOf(key) === -1
}

function serializePatches(
  patches: Patch[],
  options: PatchOptions & {id: string}
): SanityPatchMutation[] {
  if (patches.length === 0) {
    return []
  }

  const {id, ifRevisionID} = options
  const set = patches.filter((patch): patch is SetPatch => patch.op === 'set')
  const unset = patches.filter((patch): patch is UnsetPatch => patch.op === 'unset')
  const insert = patches.filter((patch): patch is InsertPatch => patch.op === 'insert')

  const withSet =
    set.length > 0 &&
    set.reduce(
      (patch: SanitySetPatch, item: SetPatch) => {
        const path = pathToString(item.path)
        patch.set[path] = item.value
        return patch
      },
      {id, set: {}}
    )

  const withUnset =
    unset.length > 0 &&
    unset.reduce(
      (patch: SanityUnsetPatch, item: UnsetPatch) => {
        const path = pathToString(item.path)
        patch.unset.push(path)
        return patch
      },
      {id, unset: []}
    )

  const withInsert = insert.reduce((acc: SanityInsertPatch[], item: InsertPatch) => {
    const after = pathToString(item.after)
    return acc.concat({id, insert: {after, items: item.items}})
  }, [])

  const patchSet: SanityPatch[] = [withSet, withUnset, ...withInsert].filter(
    (item): item is SanityPatch => item !== false
  )

  return patchSet.map((patch, i) => ({
    patch: ifRevisionID && i === 0 ? {...patch, ifRevisionID} : patch
  }))
}

function isUniquelyKeyed(arr: any[]): arr is KeyedSanityObject[] {
  const keys = []

  for (let i = 0; i < arr.length; i++) {
    const key = arr[i] && arr[i]._key
    if (!key || keys.indexOf(key) !== -1) {
      return false
    }

    keys.push(key)
  }

  return true
}

function isKeyedObject(obj: any): obj is KeyedSanityObject {
  return typeof obj === 'object' && typeof obj._key === 'string'
}

function indexByKey(arr: KeyedSanityObject[]) {
  return arr.reduce(
    (acc, item) => {
      acc.keys.push(item._key)
      acc.index[item._key] = item
      return acc
    },
    {keys: [] as string[], index: {} as {[key: string]: KeyedSanityObject}}
  )
}

function arrayIsEqual(itemA: any[], itemB: any[]) {
  return itemA.length === itemB.length && itemA.every((item, i) => itemB[i] === item)
}

function pathToString(path: Path): string {
  return path.reduce((target: string, segment: PathSegment, i: number) => {
    if (Array.isArray(segment)) {
      return `${target}[${segment.join(':')}]`
    }

    if (isKeyedObject(segment)) {
      return `${target}[_key=="${segment._key}"]`
    }

    if (typeof segment === 'number') {
      return `${target}[${segment}]`
    } else if (/^\d+$/.test(segment)) {
      return `${target}["${segment}"]`
    }

    if (typeof segment === 'string') {
      const separator = i === 0 ? '' : '.'
      return `${target}${separator}${segment}`
    }

    throw new Error(`Unsupported path segment "${segment}"`)
  }, '')
}

function yes(_: any) {
  return true
}
