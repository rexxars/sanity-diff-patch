import {diffPatch} from '../src/diff-patch'
import * as objectArrayAdd from './fixtures/object-array-add'
import * as objectArrayRemove from './fixtures/object-array-remove'
import * as objectArrayChange from './fixtures/object-array-change'

describe('object arrays', () => {
  test('change item', () => {
    expect(diffPatch(objectArrayChange.a, objectArrayChange.b)).toMatchSnapshot()
  })

  test('add to end (single)', () => {
    expect(diffPatch(objectArrayAdd.a, objectArrayAdd.b)).toMatchSnapshot()
  })

  test('add to end (multiple)', () => {
    expect(diffPatch(objectArrayAdd.a, objectArrayAdd.c)).toMatchSnapshot()
  })

  test('remove from end (single)', () => {
    expect(diffPatch(objectArrayRemove.a, objectArrayRemove.b)).toMatchSnapshot()
  })

  test('remove from end (multiple)', () => {
    expect(diffPatch(objectArrayRemove.a, objectArrayRemove.c)).toMatchSnapshot()
  })

  test('remove from middle (single)', () => {
    expect(diffPatch(objectArrayRemove.a, objectArrayRemove.d)).toMatchSnapshot()
  })
})
