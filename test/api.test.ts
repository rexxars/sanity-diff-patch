import {describe, test, expect} from 'vitest'
import {diffPatch} from '../src'
import {pathToString} from '../src/paths'
import * as setAndUnset from './fixtures/set-and-unset'

describe('module api', () => {
  test('can include ifRevisionID', () => {
    expect(
      diffPatch(setAndUnset.a, setAndUnset.b, {ifRevisionID: 'foo', hideWarnings: true})
    ).toMatchSnapshot()
  })

  test('can pass different document ID', () => {
    expect(
      diffPatch(setAndUnset.a, setAndUnset.b, {id: 'moop', hideWarnings: true})
    ).toMatchSnapshot()
  })

  test('throws if ids do not match', () => {
    const b = {...setAndUnset.b, _id: 'zing'}
    expect(() => diffPatch(setAndUnset.a, b, {hideWarnings: true})).toThrowError(
      `_id on itemA and itemB not present or differs, specify document id the mutations should be applied to`
    )
  })

  test('does not throw if ids do not match and id is provided', () => {
    const b = {...setAndUnset.b, _id: 'zing'}
    expect(diffPatch(setAndUnset.a, b, {id: 'yup', hideWarnings: true})).toHaveLength(2)
  })

  test('pathToString throws on invalid path segments', () => {
    expect(() =>
      pathToString(['foo', {foo: 'bar'} as any, 'blah'])
    ).toThrowErrorMatchingInlineSnapshot(`"Unsupported path segment \\"[object Object]\\""`)
  })
})
