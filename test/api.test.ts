import {diffPatch, validateDocument} from '../src'
import {pathToString} from '../src/paths'
import * as setAndUnset from './fixtures/set-and-unset'

describe('module api', () => {
  test('can include ifRevisionID', () => {
    expect(diffPatch(setAndUnset.a, setAndUnset.b, {ifRevisionID: 'foo'})).toMatchSnapshot()
  })

  test('can include ifRevisionId (lowercase d)', () => {
    expect(diffPatch(setAndUnset.a, setAndUnset.b, {ifRevisionId: 'foo'})).toMatchSnapshot()
  })

  test('can pass different document ID', () => {
    expect(diffPatch(setAndUnset.a, setAndUnset.b, {id: 'moop'})).toMatchSnapshot()
  })

  test('throws if ids do not match', () => {
    const b = {...setAndUnset.b, _id: 'zing'}
    expect(() => diffPatch(setAndUnset.a, b)).toThrowError(
      `_id on itemA and itemB not present or differs, specify document id the mutations should be applied to`
    )
  })

  test('does not throw if ids do not match and id is provided', () => {
    const b = {...setAndUnset.b, _id: 'zing'}
    expect(diffPatch(setAndUnset.a, b, {id: 'yup'})).toHaveLength(2)
  })

  test('pathToString throws on invalid path segments', () => {
    expect(() =>
      pathToString(['foo', {foo: 'bar'} as any, 'blah'])
    ).toThrowErrorMatchingInlineSnapshot(`"Unsupported path segment \\"[object Object]\\""`)
  })

  test('validate throws on multidimensional arrays', () => {
    expect(() => {
      validateDocument({_id: 'abc123', arr: [['foo', 'bar']]})
    }).toThrowErrorMatchingInlineSnapshot(`"Multi-dimensional arrays not supported (at 'arr[0]')"`)
  })

  test('validate does not throw on legal documents', () => {
    expect(() => {
      validateDocument({
        _id: 'abc123',
        arr: [1, 2, 3],
        obj: {nested: 'values'},
        bool: true,
        number: 1337
      })
    }).not.toThrow()
  })
})
