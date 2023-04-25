export const a = {
  _id: 'abc123',
  _type: 'isrequired',
  number: 13,
  string: 'foo',
  bool: true,
  array: ['zero', 1, {two: {levels: {deep: 'value'}}}],
  object: {f13: 13},
  unset: 'me',
}

export const b = {
  _id: 'abc123',
  _type: 'isrequired',
  number: 1337,
  string: 'bar',
  bool: false,
  array: [0, 'one', {two: {levels: {other: 'value'}}}],
  object: {b12: '12', f13: null},
}
