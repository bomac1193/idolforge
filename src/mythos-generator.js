/**
 * Mythos & Backstory Generator
 * Creates compelling origin stories and character backgrounds
 */

export function generateMythos(persona) {
  const { name, niche, vibe, tone_of_voice, aesthetic_words } = persona;

  const origin = generateOriginStory(name, niche, vibe);
  const philosophy = generatePhilosophy(niche, tone_of_voice);
  const journey = generateJourney(niche, aesthetic_words);
  const signature = generateSignatureElements(niche, vibe);

  return {
    tagline: generateTagline(name, niche),
    origin_story: origin,
    core_philosophy: philosophy,
    the_journey: journey,
    signature_elements: signature,
    manifesto: generateManifesto(niche, tone_of_voice)
  };
}

function generateTagline(name, niche) {
  const taglines = {
    beauty: [
      `${name}: Where beauty meets authenticity`,
      `Redefining beauty standards, one post at a time`,
      `Your guide to effortless beauty`
    ],
    fitness: [
      `${name}: Strength beyond the surface`,
      `Building bodies and breaking barriers`,
      `From the ground up, one rep at a time`
    ],
    fashion: [
      `${name}: Style is a language`,
      `Where fashion meets fearlessness`,
      `Curating confidence through style`
    ],
    lifestyle: [
      `${name}: Living intentionally`,
      `Crafting a life worth sharing`,
      `More than moments, a movement`
    ],
    food: [
      `${name}: Where flavor tells a story`,
      `Cooking with heart and heritage`,
      `Every dish has a tale`
    ],
    travel: [
      `${name}: Collecting moments, not things`,
      `The world is my canvas`,
      `Wandering with purpose`
    ]
  };

  const nicheKey = Object.keys(taglines).find(k => niche.toLowerCase().includes(k)) || 'lifestyle';
  const options = taglines[nicheKey];
  return options[Math.floor(Math.random() * options.length)];
}

function generateOriginStory(name, niche, vibe) {
  const stories = {
    beauty: [
      `${name} grew up in a small town where she learned that true beauty comes from self-acceptance. After years of struggling with conventional beauty standards, she discovered her unique aesthetic and decided to share her journey with the world.`,
      `Born into a family of artists, ${name} always saw beauty as an art form. Her unconventional approach to ${niche} started as a personal experiment but quickly became a movement.`,
      `${name}'s journey began in a bustling city where she felt lost in the crowd. ${niche} became her way of standing out while staying true to herself.`
    ],
    fitness: [
      `${name}'s transformation started at rock bottom. After a life-changing moment, she discovered that strength wasn't just physical—it was mental, emotional, and spiritual. Now she helps others find their own power.`,
      `Growing up as the underdog, ${name} found solace in training. What started as a way to cope became a lifestyle, and eventually, a calling to inspire others.`,
      `${name} comes from a lineage of athletes, but chose to forge her own path in ${niche}, combining traditional discipline with modern innovation.`
    ],
    fashion: [
      `${name} never fit the mold. Growing up, she created her own style as an act of rebellion and self-expression. Today, she helps others find their unique fashion voice.`,
      `After years in the corporate world, ${name} left it all behind to pursue her true passion: ${niche}. Her journey from conformity to creativity inspires thousands.`,
      `${name}'s style evolution mirrors her personal growth. Each outfit tells a story of transformation, confidence, and unapologetic self-love.`
    ],
    lifestyle: [
      `${name} rebuilt her life from scratch after realizing she was living someone else's dream. Now she documents her journey toward an authentic, intentional life.`,
      `What started as a personal blog about finding balance became ${name}'s full-time mission: showing others that you can design a life you love.`,
      `${name} traveled the world searching for meaning before realizing it was waiting at home. Her ${niche} content reflects the wisdom gained from that journey.`
    ]
  };

  const nicheKey = Object.keys(stories).find(k => niche.toLowerCase().includes(k)) || 'lifestyle';
  const options = stories[nicheKey];
  return options[Math.floor(Math.random() * options.length)];
}

function generatePhilosophy(niche, tone) {
  const philosophies = {
    beauty: "Beauty is not about perfection—it's about authenticity. I believe everyone has a unique glow that deserves to be celebrated.",
    fitness: "True strength comes from consistency, not intensity. I'm here to show you that fitness is a lifestyle, not a destination.",
    fashion: "Style is personal freedom. There are no rules, only self-expression. Wear what makes you feel powerful.",
    lifestyle: "Life is meant to be intentional. Every choice is an opportunity to align with your values and create meaning.",
    food: "Food is love made visible. Every recipe tells a story, and every meal is a chance to nourish body and soul.",
    travel: "Travel isn't about the destinations—it's about the transformation that happens along the way."
  };

  const nicheKey = Object.keys(philosophies).find(k => niche.toLowerCase().includes(k)) || 'lifestyle';
  return philosophies[nicheKey];
}

function generateJourney(niche, aesthetic) {
  const milestones = [
    "Started sharing journey online",
    "Hit first viral moment",
    "Launched signature program/product",
    "Built community of thousands",
    "Expanded into new platforms",
    "Became voice for authenticity"
  ];

  return {
    phase_1: "The Beginning - Finding my voice",
    phase_2: "The Growth - Building community",
    phase_3: "The Evolution - Expanding impact",
    key_milestones: milestones.slice(0, 3)
  };
}

function generateSignatureElements(niche, vibe) {
  return {
    visual_trademark: `${vibe} aesthetic with consistent color story`,
    content_style: "Authentic, relatable, educational",
    community_vibe: "Supportive, inspiring, real",
    unique_approach: `Combines ${niche} expertise with genuine storytelling`
  };
}

function generateManifesto(niche, tone) {
  const manifestos = {
    beauty: "I believe in beauty that celebrates individuality, not conformity. In self-care that nourishes the soul, not just the skin. In confidence that comes from within.",
    fitness: "I stand for strength that empowers, not exhausts. For progress over perfection. For showing up, even when it's hard. For building a body that serves your life.",
    fashion: "I champion style as self-expression, not imitation. Fashion that makes you feel like yourself, only amplified. Confidence that comes from wearing what you love.",
    lifestyle: "I advocate for living with intention, not on autopilot. For creating rather than consuming. For building a life that reflects your values, not someone else's highlight reel.",
    food: "I celebrate food as connection, not restriction. Recipes rooted in culture and love. Meals that nourish body, mind, and relationships.",
    travel: "I believe in traveling with curiosity, not just a camera. In experiencing cultures, not just visiting them. In coming home changed."
  };

  const nicheKey = Object.keys(manifestos).find(k => niche.toLowerCase().includes(k)) || 'lifestyle';
  return manifestos[nicheKey];
}
