const base = {
  _id: 'die-hard-ix',
  _type: 'movie',
  _createdAt: new Date().toISOString(),
  _updatedAt: new Date(Date.now() + 5000).toISOString(),
}

// Below absolute threshold
export const absoluteIn = {
  ...base,
  its: 'short',
}

export const absoluteOut = {
  ...base,
  its: 'also short',
}

// Above relative threshold (too large patch)
export const relativeOverIn = {
  ...base,
  synopsis: `When a confetti cake explodes at the Bonwit Teller department store, a man calling himself "Simon" phones Major Case Unit Inspector Walter Cobb at the police station and claims responsibility for the confetti. He orders suspended police officer Lt. John McClane to walk through the middle of Harlem, in his underwear. McClane is driven there by Cobb and three other officers. Harlem electrician Zeus Carver spots McClane and tries to get him off the street before he is killed, but a gang of youths attacks McClane and Carver, who barely escape.`,
}

export const relativeOverOut = {
  ...base,
  synopsis: `When a sack of coffee explodes at the Ultra Gnoch asteroid, a man calling himself "Ziltoid" phones Major Case Unit Inspector Mark Cimino at the Tellus police station and claims responsibility for the sack. He orders suspended police officer Lt. John McClane to travel to the asteroid, in his underwear. McClane is flown there by Cimino and three other officers. Ultra Gnoch miner Dave Young spots McClane and tries to get him off the asteroid before the coffee bugs infiltrate the asteroid, but a gang of underpant gnomes attacks McClane and Young, who barely escape.`,
}

// Within relative threshold (patch is smallish)
export const relativeUnderIn = {
  ...base,
  reviews: [
    {_type: 'review', _key: 'abc123', text: 'I liked this one better than #7 - it was really fun.'},
  ],
}

export const relativeUnderOut = {
  ...base,
  reviews: [
    {_type: 'review', _key: 'abc123', text: 'I liked this one better than #8! It was really fun.'},
  ],
}

// _type changed (within threshold, but don't use DMP for "privates" (readability))
export const privateChangeIn = {
  ...base,
  useDmp: 'reviewFromUser',
  reviews: [
    {
      _type: 'reviewFromUser',
      _key: 'abc123',
      text: 'I liked this one better than #7 - it was really fun.',
    },
  ],
}

export const privateChangeOut = {
  ...base,
  useDmp: 'reviewFromUserRepresentingMovieOrNovelOrSomethingVeryLongThatCanBeShownAsStars',
  reviews: [
    {
      _type: 'reviewFromUserRepresentingMovieOrNovelOrSomethingVeryLongThatCanBeShownAsStars',
      _key: 'abc123',
      text: 'I liked this one better than #7 - it was really fun.',
    },
  ],
}

// Don't use for type changes (both needs to be string)
export const typeChangeIn = {
  ...base,
  rating: 3,
}

export const typeChangeOut = {
  ...base,
  rating: 'I would give it a solid 9 on a scale from 1 to 26',
}

export const unicodeChangeIn = {
  ...base,
  ascii: 'Honestly? I thought it was total xx, really.',
  reviews: [
    {_type: 'review', _key: 'abc123', text: 'Honestly? I thought it was total 😉, really.'},
  ],
}

export const unicodeChangeOut = {
  ...base,
  ascii: 'Honestly? I thought it was total <3, really.',
  reviews: [
    {_type: 'review', _key: 'abc123', text: 'Honestly? I thought it was total 😀, really.'},
  ],
}
