/**
 * Platform-specific post generator
 */

const HASHTAG_GROUPS = {
  fitness: ['#FitnessMotivation', '#WorkoutRoutine', '#FitLife', '#GymLife', '#HealthyLiving'],
  fashion: ['#OOTD', '#FashionInspo', '#StyleGuide', '#FashionBlogger', '#Fashionista'],
  beauty: ['#BeautyTips', '#MakeupTutorial', '#Skincare', '#BeautyRoutine', '#GlowUp'],
  lifestyle: ['#LifestyleContent', '#DailyVlog', '#LifestyleBlogger', '#Aesthetic', '#Vibes'],
  food: ['#FoodPhotography', '#Foodie', '#Recipes', '#HomeCooking', '#FoodLover'],
  travel: ['#TravelGram', '#Wanderlust', '#TravelPhotography', '#ExploreMore', '#TravelBlogger']
};

export function generatePosts(persona, platforms, count = 5) {
  const posts = [];

  platforms.forEach(platform => {
    const platformCount = Math.ceil(count / platforms.length);

    for (let i = 0; i < platformCount; i++) {
      posts.push(generatePost(persona, platform, i));
    }
  });

  return posts;
}

function generatePost(persona, platform, index) {
  const concepts = generateConcepts(persona.niche);
  const concept = concepts[index % concepts.length];

  const basePost = {
    platform,
    concept,
    visual_idea: generateVisualIdea(concept, persona),
    alt_text: generateAltText(concept, persona)
  };

  switch (platform.toLowerCase()) {
    case 'x':
    case 'twitter':
      return generateXPost(basePost, persona);
    case 'tiktok':
      return generateTikTokPost(basePost, persona);
    case 'instagram':
    case 'ig':
      return generateInstagramPost(basePost, persona);
    case 'onlyfans':
      return generateOnlyFansPost(basePost, persona);
    default:
      return generateInstagramPost(basePost, persona);
  }
}

function generateConcepts(niche) {
  const concepts = {
    fitness: [
      'Morning workout routine',
      'Healthy meal prep',
      'Transformation journey update',
      'Workout tips for beginners',
      'Fitness motivation'
    ],
    fashion: [
      'Styling one piece three ways',
      'Closet organization tips',
      'Thrift flip transformation',
      'Seasonal wardrobe essentials',
      'Get ready with me'
    ],
    beauty: [
      'Skincare routine reveal',
      'Everyday makeup tutorial',
      'Product review and demo',
      'Glow up transformation',
      'Skincare myth busting'
    ],
    lifestyle: [
      'Day in my life',
      'Morning routine that changed my life',
      'Productivity tips',
      'Self-care Sunday',
      'Weekly reset routine'
    ],
    food: [
      'Easy 15-minute recipe',
      'What I eat in a day',
      'Cooking hack you need',
      'Restaurant recreation',
      'Meal prep for the week'
    ],
    travel: [
      'Hidden gem location reveal',
      'Travel packing tips',
      'Budget travel guide',
      'Must-visit spots',
      'Travel vlog highlights'
    ]
  };

  const nicheKey = Object.keys(concepts).find(k => niche.toLowerCase().includes(k)) || 'lifestyle';
  return concepts[nicheKey];
}

function generateVisualIdea(concept, persona) {
  const { aesthetic_words, colour_palette } = persona;
  const primaryColor = colour_palette[0];
  const aesthetic = aesthetic_words[0];

  return `${aesthetic} setting with ${primaryColor} accent colors. ${concept}. Match persona's ${persona.style} aesthetic.`;
}

function generateAltText(concept, persona) {
  return `${persona.name} - ${concept}. ${persona.niche} content creator sharing ${persona.style} vibes.`;
}

// X/Twitter Post Generator
function generateXPost(basePost, persona) {
  const hooks = [
    'Hot take:',
    'Real talk:',
    'Nobody talks about this:',
    'Unpopular opinion:',
    'This changed everything:'
  ];

  const hook = hooks[Math.floor(Math.random() * hooks.length)];
  const caption = `${hook} ${basePost.concept.toLowerCase()} is the key to leveling up. Who's with me?`;

  return {
    ...basePost,
    hook,
    caption: caption.substring(0, 280), // X character limit
    hashtags: [] // X doesn't rely heavily on hashtags
  };
}

// TikTok Post Generator
function generateTikTokPost(basePost, persona) {
  const hooks = [
    'Wait for it...',
    'POV:',
    'This is your sign to...',
    'No one told me that...',
    'The way I...'
  ];

  const hook = hooks[Math.floor(Math.random() * hooks.length)];
  const caption = `${hook} ${basePost.concept} #${persona.niche.replace(/\s+/g, '')} #fyp #viral`;

  const hashtags = getHashtagsForNiche(persona.niche);
  hashtags.push('#fyp', '#viral', '#foryou');

  return {
    ...basePost,
    hook,
    caption,
    hashtags,
    music: generateMusicSuggestion(persona, basePost.concept)
  };
}

// Instagram Post Generator
function generateInstagramPost(basePost, persona) {
  const hooks = [
    'Swipe for the full story',
    'Save this for later',
    'You need to see this',
    'Let me show you how',
    'This is everything'
  ];

  const hook = hooks[Math.floor(Math.random() * hooks.length)];

  const caption = `${hook} ✨\n\n${basePost.concept} - and I'm here for it.\n\nDouble tap if you agree! 💫\n\n${persona.bio}\n\n---`;

  const hashtags = getHashtagsForNiche(persona.niche).slice(0, 8);

  return {
    ...basePost,
    hook,
    caption,
    hashtags
  };
}

// OnlyFans Post Generator
function generateOnlyFansPost(basePost, persona) {
  const caption = `Exclusive: ${basePost.concept} 💋\n\nFor my VIPs only. You know what to do.\n\n- ${persona.name}`;

  return {
    ...basePost,
    hook: 'Exclusive content',
    caption,
    hashtags: [] // OnlyFans doesn't use hashtags
  };
}

function getHashtagsForNiche(niche) {
  const nicheKey = Object.keys(HASHTAG_GROUPS).find(k => niche.toLowerCase().includes(k)) || 'lifestyle';
  return [...HASHTAG_GROUPS[nicheKey]];
}

function generateMusicSuggestion(persona, concept) {
  const toneMap = {
    playful: 'upbeat pop',
    professional: 'smooth jazz or lofi',
    sassy: 'confident hip-hop',
    inspiring: 'epic orchestral',
    mysterious: 'ambient electronic'
  };

  const tone = Object.keys(toneMap).find(t => persona.tone_of_voice.includes(t)) || 'upbeat pop';

  return `${toneMap[tone]} - trending sounds that match ${concept}`;
}
