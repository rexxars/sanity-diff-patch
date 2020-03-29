import {diffPatch} from '../src/diff-patch'

describe('safeguards', () => {
  test('cannot change `_type` at root', () => {
    expect(
      diffPatch(
        {_id: 'foo', _type: 'bar', author: {_type: 'author', name: 'Espen'}},
        {_id: 'foo', _type: 'bar2', author: {_type: 'person', name: 'Espen'}}
      )
    ).toEqual([
      {
        patch: {
          id: 'foo',
          set: {
            'author._type': 'person'
          }
        }
      }
    ])
  })
})
