import * as simple from './simple'

export const a = {
  ...simple.a,
  products: [
    {
      _key: 'item-1',
      name: 'Item 1',
      comparisonFields: {
        'support-level': 'basic',
      },
      variants: [
        {
          _key: 'variant-1',
          name: 'Variant 1',
          price: 100,
          'lace-type': 'waxed',
        },
        {
          _key: 'variant-2',
          name: 'Variant 2',
          price: 200,
          'lace-type': 'knurled',
        },
      ],
    },
  ],
}
export const b = {
  ...a,
  products: [
    {
      ...a.products[0],
      comparisonFields: {'support-level': 'advanced'},
      variants: [
        {
          _key: 'variant-1',
          name: 'Variant 1',
          price: 100,
          'lace-type': 'slick',
        },
        {
          _key: 'variant-2',
          name: 'Variant 2',
          price: 200,
        },
      ],
    },
  ],
}
