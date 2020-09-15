export const a = {
  _id: 'die-hard-iii',
  _type: 'movie',
  _rev: 'datrev',
  image: {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: 'image-a'
    },
    hotspot: {
      height: 1,
      width: 1,
      x: 0.5,
      y: 0.5
    },
    crop: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }
  }
}

export const b = {
  _id: 'die-hard-iii',
  _type: 'movie',
  _rev: 'datrev',
  image: {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: 'image-b'
    },
    hotspot: {
      height: 0.75,
      width: 0.75,
      x: 0.48,
      y: 0.5
    },
    crop: {
      top: 0.1,
      left: 0.2,
      right: 0.2,
      bottom: 0.1
    }
  }
}
