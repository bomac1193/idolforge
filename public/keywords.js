// Client-side keyword library (simplified from server-side version)

const VIBES = [
    // Synthetic/AI
    'Holographic', 'Glitch', 'Cyberpunk', 'Vaporwave', 'Crystalline', 'Neon', 'Digital',
    // Classic
    'Minimalist', 'Maximalist', 'Elegant', 'Edgy', 'Soft', 'Bold',
    // Moods
    'Dreamy', 'Energetic', 'Mysterious', 'Playful', 'Confident', 'Ethereal'
];

const NICHES = [
    { label: 'Music Producer', icon: '🎵' },
    { label: 'DJ', icon: '🎧' },
    { label: 'Pop Star', icon: '⭐' },
    { label: 'Fashion', icon: '👗' },
    { label: 'Streetwear', icon: '👟' },
    { label: 'Gaming', icon: '🎮' },
    { label: 'Streaming', icon: '📡' },
    { label: 'Modeling', icon: '📸' },
    { label: 'Fitness', icon: '💪' },
    { label: 'Beauty', icon: '💄' },
    { label: 'Lifestyle', icon: '✨' },
    { label: 'Tech', icon: '💻' }
];

const TRAITS = [
    // AI-Specific
    'Meta-Aware', 'Glitchy', 'Mathematical', 'Multidimensional', 'Synthetic',
    // Personality
    'Charismatic', 'Mysterious', 'Inspiring', 'Rebellious', 'Philosophical',
    // Energy
    'Fierce', 'Gentle', 'Intense', 'Chill', 'Electric'
];

const LOCATIONS = [
    'Lagos', 'Seoul', 'Tokyo', 'London', 'Paris', 'Berlin',
    'New York', 'Los Angeles', 'Miami', 'São Paulo', 'Dubai',
    'The Digital Void', 'Quantum Realm', 'The Grid', 'The Metaverse'
];

// Randomizer templates
const TEMPLATES = [
    {
        type: 'DJ',
        niches: ['DJ', 'Music Producer'],
        vibes: ['Neon', 'Energetic', 'Cyberpunk'],
        traits: ['Charismatic', 'Electric', 'Meta-Aware'],
        cities: ['Lagos', 'Seoul', 'Tokyo', 'Berlin', 'Miami']
    },
    {
        type: 'Streamer',
        niches: ['Streaming', 'Gaming'],
        vibes: ['Energetic', 'Neon', 'Digital'],
        traits: ['Charismatic', 'Electric', 'Mathematical'],
        cities: ['Seoul', 'Tokyo', 'Los Angeles', 'The Metaverse']
    },
    {
        type: 'Fashion Icon',
        niches: ['Fashion'],
        vibes: ['Elegant', 'Minimalist', 'Crystalline'],
        traits: ['Fierce', 'Philosophical', 'Multidimensional'],
        cities: ['Paris', 'Milan', 'Tokyo', 'Quantum Realm']
    }
];

function randomize() {
    const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];

    const vibe = template.vibes[Math.floor(Math.random() * template.vibes.length)];
    const niche = template.niches[Math.floor(Math.random() * template.niches.length)];
    const trait = template.traits[Math.floor(Math.random() * template.traits.length)];
    const city = template.cities[Math.floor(Math.random() * template.cities.length)];

    return {
        vibe,
        niche,
        traits: trait,
        location: city,
        type: template.type,
        description: `${vibe} ${niche} from ${city}`
    };
}

// Make functions globally available
window.VIBES = VIBES;
window.NICHES = NICHES;
window.TRAITS = TRAITS;
window.LOCATIONS = LOCATIONS;
window.randomizeInfluencer = randomize;
