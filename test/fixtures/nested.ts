import * as simple from './simple'

export const a = {slug: {_type: 'short', current: 'die-hard-iii'}, ...simple.a}
export const b = {...a, slug: {_type: 'slug', current: 'die-hard-with-a-vengeance'}}
