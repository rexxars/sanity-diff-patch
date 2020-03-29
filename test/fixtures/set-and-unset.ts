import * as nested from './nested'

export const a = {...nested.a, year: 1995, slug: {auto: true, ...nested.a.slug}}

export const b = {...nested.b}
