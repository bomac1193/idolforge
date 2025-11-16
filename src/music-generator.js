/**
 * Music/Song Generator for Influencer Content
 */

export function generateSong(persona, genreMood = 'pop upbeat') {
  const { name, niche, tone_of_voice } = persona;

  const title = generateTitle(niche, genreMood);
  const concept = generateConcept(niche, tone_of_voice);
  const hookLyrics = generateHook(niche, name);
  const verseLyrics = generateVerse(niche, tone_of_voice);

  return {
    title,
    concept,
    hook_lyrics: hookLyrics,
    verse_lyrics: verseLyrics
  };
}

function generateTitle(niche, genreMood) {
  const titles = {
    fitness: ['Stronger Every Day', 'Rise and Grind', 'Built Different', 'No Days Off'],
    fashion: ['Runway Ready', 'Style Icon', 'Dress to Impress', 'Fashion Forward'],
    beauty: ['Glow Up', 'Beauty Within', 'Flawless', 'Confidence Looks Good'],
    lifestyle: ['Living My Best Life', 'Main Character Energy', 'Dream Life', 'Vibe Check'],
    food: ['Taste of Heaven', 'Kitchen Magic', 'Flavor Paradise', 'Food for the Soul'],
    travel: ['Wanderlust Dreams', 'Passport Ready', 'Adventure Calls', 'World in View']
  };

  const nicheKey = Object.keys(titles).find(k => niche.toLowerCase().includes(k)) || 'lifestyle';
  const titleList = titles[nicheKey];

  return titleList[Math.floor(Math.random() * titleList.length)];
}

function generateConcept(niche, tone) {
  return `${tone.split(',')[0]} anthem about ${niche} journey and self-empowerment`;
}

function generateHook(niche, name) {
  const hooks = {
    fitness: [
      "I'm getting stronger, can't you see\nEvery rep, I'm breaking free\nThis is who I'm meant to be\nWatch me rise, just wait and see"
    ],
    fashion: [
      "Walking like I own the street\nEvery look is incomplete\nWithout this confidence I bring\nFashion is my everything"
    ],
    beauty: [
      "Watch me glow, watch me shine\nEvery day I'm feeling fine\nBeauty starts from deep within\nThis is where my life begins"
    ],
    lifestyle: [
      "Living life on my own terms\nEvery lesson that I learned\nBrought me here to where I stand\nMain character, this is my plan"
    ],
    food: [
      "Cooking up my dreams tonight\nEvery flavor feels so right\nIn this kitchen I am free\nFood is love, you'll see"
    ],
    travel: [
      "Take me where the wild things grow\nEvery place I need to know\nWanderlust inside my soul\nThe world's my home, I'm in control"
    ]
  };

  const nicheKey = Object.keys(hooks).find(k => niche.toLowerCase().includes(k)) || 'lifestyle';
  return hooks[nicheKey][0];
}

function generateVerse(niche, tone) {
  const verses = {
    fitness: [
      "Started from the bottom, now I'm reaching for the top\nEvery single morning, I refuse to ever stop\nPushing past my limits, breaking through the pain\nThis body is my temple, I'm dancing in the rain"
    ],
    fashion: [
      "Mirror on the wall, tell me what you see\nA vision of perfection staring back at me\nEvery stitch and pattern tells a story of my own\nIn this world of fashion, I have found my throne"
    ],
    beauty: [
      "They told me I should change, fit inside a mold\nBut I learned that real beauty can't be bought or sold\nIt's in the way I carry myself with grace\nIt's written in the smile that lights up my face"
    ],
    lifestyle: [
      "Waking up with purpose, gratitude my guide\nNo more playing small, I'm done trying to hide\nEvery day's a blessing, every moment mine\nCreating my own magic, watch me shine"
    ],
    food: [
      "Grandma's secret recipes mixed with something new\nEvery dish I'm making tells a story true\nGathered round the table, love in every bite\nFood connects our souls and makes everything right"
    ],
    travel: [
      "Passport in my hand, I'm ready for the ride\nEvery destination opens up my eyes\nDifferent cultures, people, places to explore\nEvery journey taken leaves me wanting more"
    ]
  };

  const nicheKey = Object.keys(verses).find(k => niche.toLowerCase().includes(k)) || 'lifestyle';
  return verses[nicheKey][0];
}
