/**
 * IdolForge Persona Generator
 * Generates complete influencer personas from vibes
 */

const AESTHETICS = {
  soft: ['ethereal', 'dreamy', 'gentle', 'pastel', 'whimsical'],
  edgy: ['bold', 'dark', 'rebellious', 'gritty', 'raw'],
  luxury: ['elegant', 'refined', 'opulent', 'sophisticated', 'polished'],
  natural: ['organic', 'earthy', 'authentic', 'fresh', 'minimal'],
  vibrant: ['energetic', 'colorful', 'dynamic', 'playful', 'bright']
};

const COLOR_PALETTES = {
  soft: ['#FFE4E1', '#E6E6FA', '#F0E68C', '#FFF5EE', '#F5F5DC'],
  edgy: ['#1C1C1C', '#8B0000', '#2F4F4F', '#36454F', '#FF6347'],
  luxury: ['#C9A063', '#000000', '#FFFFFF', '#8B7355', '#DAA520'],
  natural: ['#8FBC8F', '#F5DEB3', '#DEB887', '#D2B48C', '#FAEBD7'],
  vibrant: ['#FF69B4', '#FFD700', '#00CED1', '#FF6347', '#7B68EE']
};

const TONES = {
  playful: 'fun, casual, uses emojis, conversational',
  professional: 'polished, informative, authoritative, clear',
  sassy: 'witty, confident, bold, direct',
  inspiring: 'motivational, uplifting, empowering, warm',
  mysterious: 'enigmatic, intriguing, poetic, artistic'
};

export function generatePersona(input) {
  const { vibe, niche, traits, imageDescription } = input;

  // Determine aesthetic from vibe
  const aesthetic = determineAesthetic(vibe, traits);
  const tone = determineTone(vibe, traits);

  // Generate name and handle
  const name = generateName(vibe, niche);
  const handle = generateHandle(name, niche);

  // Generate bio
  const bio = generateBio(name, niche, vibe, traits);

  return {
    name,
    handle,
    bio,
    niche,
    tone_of_voice: TONES[tone],
    style: `${aesthetic} with ${tone} energy`,
    aesthetic_words: AESTHETICS[aesthetic],
    colour_palette: COLOR_PALETTES[aesthetic],
    styling_notes: generateStylingNotes(aesthetic, imageDescription)
  };
}

function determineAesthetic(vibe, traits) {
  const vibeWords = (vibe + ' ' + (traits || '')).toLowerCase();

  if (vibeWords.match(/soft|gentle|pastel|dreamy|cute/)) return 'soft';
  if (vibeWords.match(/edgy|dark|bold|rebel|grunge/)) return 'edgy';
  if (vibeWords.match(/luxury|elegant|glam|rich|chic/)) return 'luxury';
  if (vibeWords.match(/natural|organic|earth|minimal|raw/)) return 'natural';
  if (vibeWords.match(/vibrant|color|bright|fun|energetic/)) return 'vibrant';

  return 'natural'; // default
}

function determineTone(vibe, traits) {
  const vibeWords = (vibe + ' ' + (traits || '')).toLowerCase();

  if (vibeWords.match(/fun|playful|silly|cute/)) return 'playful';
  if (vibeWords.match(/professional|expert|authority|business/)) return 'professional';
  if (vibeWords.match(/sassy|bold|confident|fierce/)) return 'sassy';
  if (vibeWords.match(/inspiring|motivat|empower|uplift/)) return 'inspiring';
  if (vibeWords.match(/mysterious|dark|enigma|artistic/)) return 'mysterious';

  return 'playful'; // default
}

function generateName(vibe, niche) {
  const firstNames = ['Luna', 'Nova', 'Aria', 'Jade', 'Phoenix', 'Sage', 'River', 'Sky'];
  const lastNames = ['Rose', 'Moon', 'Stone', 'Wild', 'Grace', 'Fox', 'Rain', 'Star'];

  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

function generateHandle(name, niche) {
  const nameBase = name.toLowerCase().replace(' ', '');
  const nicheShort = niche.toLowerCase().replace(/\s+/g, '');

  const patterns = [
    `@${nameBase}`,
    `@${nameBase}_${nicheShort}`,
    `@the${nameBase}`,
    `@${nameBase}hq`
  ];

  return patterns[Math.floor(Math.random() * patterns.length)];
}

function generateBio(name, niche, vibe, traits) {
  const bios = [
    `${niche} enthusiast ✨ | ${vibe} vibes only | Building my dream life`,
    `Your go-to for ${niche} | ${vibe} aesthetic | Let's grow together`,
    `${niche} creator | ${vibe} energy | Inspiring you daily`,
    `Living for ${niche} | ${vibe} always | Join the journey`
  ];

  return bios[Math.floor(Math.random() * bios.length)];
}

function generateStylingNotes(aesthetic, imageDescription) {
  const notes = {
    soft: 'Soft lighting, muted tones, flowing fabrics, gentle expressions',
    edgy: 'High contrast, bold angles, leather/denim, confident poses',
    luxury: 'Clean backgrounds, designer pieces, perfect lighting, polished finish',
    natural: 'Natural light, minimal makeup, organic textures, candid moments',
    vibrant: 'Bright colors, dynamic poses, playful props, energetic compositions'
  };

  let styling = notes[aesthetic];

  if (imageDescription) {
    styling += ` | Based on image: ${imageDescription}`;
  }

  return styling;
}
