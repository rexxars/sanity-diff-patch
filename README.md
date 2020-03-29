# sanity-diff-patch

[![npm version](http://img.shields.io/npm/v/sanity-diff-patch.svg?style=flat-square)](https://www.npmjs.com/package/sanity-diff-patch)[![npm bundle size](https://img.shields.io/bundlephobia/minzip/sanity-diff-patch.svg?style=flat-square)](https://bundlephobia.com/result?p=sanity-diff-patch)[![Build Status](http://img.shields.io/travis/rexxars/sanity-diff-patch/master.svg?style=flat-square)](https://travis-ci.org/rexxars/sanity-diff-patch)

Generates a set of Sanity patches needed to change an item (usually a document) from one shape to another.

Most values will become simple `set`, `unset` or `insert` operations, but it will also (by default) try to use [diff-match-patch](https://www.sanity.io/docs/http-patches#diffmatchpatch-aTbJhlAJ) for strings ([read more](#diff-match-patch)).

An `ifRevisionID` constraint can be given to generate patches that include this revision as a safeguard, to prevent modifying documents that has changed since the diff was generated.

The document ID used in the patches is either extracted from item A and item B (`_id` property), or can be set explicitly by using the `id` option. This is _required_ if the `_id` property differs in the two items, to prevent patching the wrong document.

If encountering `undefined` values within an array, they will be converted to `null` values and print a warning to the console. Should you want to remove undefined values from arrays, manually remove them from the array prior to diffing (`array.filter(item => typeof item === 'undefined')` is your friend).

## Getting started

npm install --save sanity-diff-patch

## Usage

```js
import {diffPatch} from 'sanity-diff-patch'

const patch = diffPatch(itemA, itemB)
/*
[
  {patch: {id: 'docId', set: {...}}},
  {patch: {id: 'docId', unset: [...]}},
  {patch: {id: 'docId', insert: {...}}}
]
*/
```

## Usage with mutations

```js
import {diffPatch} from 'sanity-diff-patch'
import sanityClient from './myConfiguredSanityClient'

const itemA = {
  _id: 'die-hard-iii',
  _type: 'movie',
  _rev: 'k0k0s',
  name: 'Die Hard 3',
  year: 1995,
  characters: [
    {
      _key: 'ma4sg31',
      name: 'John McClane'
    },
    {
      _key: 'l13ma92',
      name: 'Simon Gruber'
    }
  ]
}

const itemB = {
  _id: 'drafts.die-hard-iii',
  _type: 'movie',
  name: 'Die Hard with a Vengeance',
  characters: [
    {
      _key: 'ma4sg31',
      name: 'John McClane'
    },
    {
      _key: 'l13ma92',
      name: 'Simon Grüber'
    }
  ]
}

// Specify id if the two documents do not match
const operations = diffPatch(itemA, itemB, {id: itemA._id, ifRevisionID: itemA._rev})
await sanityClient.transaction(operations).commit()

// Patches generated:
const generatedPatches = [
  {
    patch: {
      id: 'die-hard-iii',
      ifRevisionID: 'k0k0s',
      set: {
        'name': 'Die Hard with a Vengeance',
        'characters[_key=="l13ma92"].name': 'Simon Grüber'
      },
    }
  },
  {
    patch: {
      id: 'die-hard-iii',
      unset: ['year']
    }
  }
}
```

## Needs improvement

- Improve patch on array item move
- Improve patch on array item delete

## License

MIT-licensed. See LICENSE.
