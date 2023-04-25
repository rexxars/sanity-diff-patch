import {describe, test, expect} from 'vitest'
import {diffPatch} from '../src'
import * as simple from './fixtures/simple'
import * as nested from './fixtures/nested'
import * as image from './fixtures/image'
import * as setAndUnset from './fixtures/set-and-unset'

describe('set/unset', () => {
  test('simple root-level changes', () => {
    expect(diffPatch(simple.a, simple.b, {hideWarnings: true})).toMatchSnapshot()
  })

  test('basic nested changes', () => {
    expect(diffPatch(nested.a, nested.b, {hideWarnings: true})).toMatchSnapshot()
  })

  test('set + unset, nested changes', () => {
    expect(diffPatch(setAndUnset.a, setAndUnset.b, {hideWarnings: true})).toMatchSnapshot()
  })

  test('set + unset, image example', () => {
    expect(diffPatch(image.a, image.b, {hideWarnings: true})).toMatchSnapshot()
  })

  test('no diff', () => {
    expect(diffPatch(nested.a, nested.a, {hideWarnings: true})).toEqual([])
  })
})
