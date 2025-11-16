// Keyword Library for Quick Selection
// Curated keywords for vibes, niches, traits, and locations

export const VIBES = [
    // Synthetic/AI Aesthetics
    { id: 'holographic', label: 'Holographic', category: 'synthetic' },
    { id: 'glitch', label: 'Glitch', category: 'synthetic' },
    { id: 'cyberpunk', label: 'Cyberpunk', category: 'synthetic' },
    { id: 'vaporwave', label: 'Vaporwave', category: 'synthetic' },
    { id: 'crystalline', label: 'Crystalline', category: 'synthetic' },
    { id: 'neon', label: 'Neon', category: 'synthetic' },
    { id: 'digital', label: 'Digital', category: 'synthetic' },

    // Classic Aesthetics
    { id: 'minimalist', label: 'Minimalist', category: 'classic' },
    { id: 'maximalist', label: 'Maximalist', category: 'classic' },
    { id: 'elegant', label: 'Elegant', category: 'classic' },
    { id: 'edgy', label: 'Edgy', category: 'classic' },
    { id: 'soft', label: 'Soft', category: 'classic' },
    { id: 'bold', label: 'Bold', category: 'classic' },

    // Moods
    { id: 'dreamy', label: 'Dreamy', category: 'mood' },
    { id: 'energetic', label: 'Energetic', category: 'mood' },
    { id: 'mysterious', label: 'Mysterious', category: 'mood' },
    { id: 'playful', label: 'Playful', category: 'mood' },
    { id: 'confident', label: 'Confident', category: 'mood' },
    { id: 'ethereal', label: 'Ethereal', category: 'mood' }
];

export const NICHES = [
    // Music
    { id: 'music-producer', label: 'Music Producer', category: 'music', icon: '🎵' },
    { id: 'dj', label: 'DJ', category: 'music', icon: '🎧' },
    { id: 'rapper', label: 'Rapper', category: 'music', icon: '🎤' },
    { id: 'pop-star', label: 'Pop Star', category: 'music', icon: '⭐' },

    // Fashion
    { id: 'fashion', label: 'Fashion', category: 'fashion', icon: '👗' },
    { id: 'streetwear', label: 'Streetwear', category: 'fashion', icon: '👟' },
    { id: 'haute-couture', label: 'Haute Couture', category: 'fashion', icon: '💎' },
    { id: 'avant-garde', label: 'Avant-Garde', category: 'fashion', icon: '🎨' },

    // Gaming
    { id: 'gaming', label: 'Gaming', category: 'gaming', icon: '🎮' },
    { id: 'streaming', label: 'Streaming', category: 'gaming', icon: '📡' },
    { id: 'esports', label: 'E-Sports', category: 'gaming', icon: '🏆' },

    // Modeling
    { id: 'modeling', label: 'Modeling', category: 'modeling', icon: '📸' },
    { id: 'fitness', label: 'Fitness', category: 'modeling', icon: '💪' },
    { id: 'beauty', label: 'Beauty', category: 'modeling', icon: '💄' },

    // Lifestyle
    { id: 'lifestyle', label: 'Lifestyle', category: 'lifestyle', icon: '✨' },
    { id: 'travel', label: 'Travel', category: 'lifestyle', icon: '✈️' },
    { id: 'tech', label: 'Tech', category: 'lifestyle', icon: '💻' },
    { id: 'art', label: 'Art', category: 'lifestyle', icon: '🎨' }
];

export const TRAITS = [
    // AI-Specific Traits
    { id: 'meta-aware', label: 'Meta-Aware', category: 'ai' },
    { id: 'glitchy', label: 'Glitchy', category: 'ai' },
    { id: 'mathematical', label: 'Mathematical', category: 'ai' },
    { id: 'multidimensional', label: 'Multidimensional', category: 'ai' },
    { id: 'synthetic', label: 'Synthetic', category: 'ai' },

    // Personality
    { id: 'charismatic', label: 'Charismatic', category: 'personality' },
    { id: 'mysterious', label: 'Mysterious', category: 'personality' },
    { id: 'inspiring', label: 'Inspiring', category: 'personality' },
    { id: 'rebellious', label: 'Rebellious', category: 'personality' },
    { id: 'philosophical', label: 'Philosophical', category: 'personality' },

    // Energy
    { id: 'fierce', label: 'Fierce', category: 'energy' },
    { id: 'gentle', label: 'Gentle', category: 'energy' },
    { id: 'intense', label: 'Intense', category: 'energy' },
    { id: 'chill', label: 'Chill', category: 'energy' },
    { id: 'electric', label: 'Electric', category: 'energy' }
];

export const LOCATIONS = [
    // Global Cities
    { id: 'lagos', label: 'Lagos', country: 'Nigeria', region: 'Africa' },
    { id: 'seoul', label: 'Seoul', country: 'South Korea', region: 'Asia' },
    { id: 'tokyo', label: 'Tokyo', country: 'Japan', region: 'Asia' },
    { id: 'london', label: 'London', country: 'UK', region: 'Europe' },
    { id: 'paris', label: 'Paris', country: 'France', region: 'Europe' },
    { id: 'berlin', label: 'Berlin', country: 'Germany', region: 'Europe' },
    { id: 'nyc', label: 'New York', country: 'USA', region: 'North America' },
    { id: 'la', label: 'Los Angeles', country: 'USA', region: 'North America' },
    { id: 'miami', label: 'Miami', country: 'USA', region: 'North America' },
    { id: 'sao-paulo', label: 'São Paulo', country: 'Brazil', region: 'South America' },
    { id: 'dubai', label: 'Dubai', country: 'UAE', region: 'Middle East' },
    { id: 'mumbai', label: 'Mumbai', country: 'India', region: 'Asia' },

    // Digital Locations (AI-specific)
    { id: 'digital-void', label: 'The Digital Void', country: 'Cyberspace', region: 'Digital' },
    { id: 'quantum-realm', label: 'Quantum Realm', country: 'Between Dimensions', region: 'Digital' },
    { id: 'the-grid', label: 'The Grid', country: 'Virtual', region: 'Digital' },
    { id: 'metaverse', label: 'The Metaverse', country: 'Web3', region: 'Digital' }
];

/**
 * Smart randomizer - generates coherent influencer concepts
 */
export function generateRandomInfluencer() {
    const templates = [
        // Music templates
        {
            type: 'DJ',
            niches: ['dj', 'music-producer'],
            vibes: ['neon', 'energetic', 'cyberpunk'],
            traits: ['charismatic', 'electric', 'meta-aware'],
            cities: ['lagos', 'seoul', 'tokyo', 'berlin', 'miami']
        },
        {
            type: 'Pop Star',
            niches: ['pop-star', 'music-producer'],
            vibes: ['holographic', 'bold', 'dreamy'],
            traits: ['charismatic', 'inspiring', 'synthetic'],
            cities: ['la', 'london', 'tokyo', 'digital-void']
        },

        // Fashion templates
        {
            type: 'Fashion Icon',
            niches: ['fashion', 'avant-garde'],
            vibes: ['elegant', 'minimalist', 'crystalline'],
            traits: ['fierce', 'philosophical', 'multidimensional'],
            cities: ['paris', 'milan', 'tokyo', 'quantum-realm']
        },
        {
            type: 'Streetwear Influencer',
            niches: ['streetwear', 'lifestyle'],
            vibes: ['edgy', 'bold', 'glitch'],
            traits: ['rebellious', 'electric', 'glitchy'],
            cities: ['nyc', 'seoul', 'berlin', 'the-grid']
        },

        // Gaming templates
        {
            type: 'Streamer',
            niches: ['streaming', 'gaming'],
            vibes: ['energetic', 'neon', 'digital'],
            traits: ['charismatic', 'electric', 'mathematical'],
            cities: ['seoul', 'tokyo', 'la', 'metaverse']
        },
        {
            type: 'E-Sports Pro',
            niches: ['esports', 'gaming'],
            vibes: ['intense', 'bold', 'cyberpunk'],
            traits: ['fierce', 'intense', 'meta-aware'],
            cities: ['seoul', 'shanghai', 'berlin', 'the-grid']
        },

        // Modeling templates
        {
            type: 'Digital Model',
            niches: ['modeling', 'fashion'],
            vibes: ['ethereal', 'holographic', 'crystalline'],
            traits: ['mysterious', 'philosophical', 'synthetic'],
            cities: ['paris', 'milan', 'quantum-realm', 'digital-void']
        },
        {
            type: 'Fitness Influencer',
            niches: ['fitness', 'lifestyle'],
            vibes: ['energetic', 'confident', 'bold'],
            traits: ['inspiring', 'intense', 'electric'],
            cities: ['miami', 'la', 'dubai', 'sao-paulo']
        }
    ];

    // Pick random template
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Randomly select from template options
    const niche = template.niches[Math.floor(Math.random() * template.niches.length)];
    const vibe = template.vibes[Math.floor(Math.random() * template.vibes.length)];
    const trait = template.traits[Math.floor(Math.random() * template.traits.length)];
    const cityId = template.cities[Math.floor(Math.random() * template.cities.length)];

    const location = LOCATIONS.find(l => l.id === cityId);

    // Get full objects
    const nicheObj = NICHES.find(n => n.id === niche);
    const vibeObj = VIBES.find(v => v.id === vibe);
    const traitObj = TRAITS.find(t => t.id === trait);

    return {
        type: template.type,
        vibe: vibeObj.label,
        niche: nicheObj.label,
        traits: traitObj.label,
        location: location,
        description: `${vibeObj.label} ${nicheObj.label} from ${location.label}`
    };
}

/**
 * Get keywords by category
 */
export function getVibesByCategory() {
    const categories = {};
    VIBES.forEach(vibe => {
        if (!categories[vibe.category]) {
            categories[vibe.category] = [];
        }
        categories[vibe.category].push(vibe);
    });
    return categories;
}

export function getNichesByCategory() {
    const categories = {};
    NICHES.forEach(niche => {
        if (!categories[niche.category]) {
            categories[niche.category] = [];
        }
        categories[niche.category].push(niche);
    });
    return categories;
}

export function getTraitsByCategory() {
    const categories = {};
    TRAITS.forEach(trait => {
        if (!categories[trait.category]) {
            categories[trait.category] = [];
        }
        categories[trait.category].push(trait);
    });
    return categories;
}

export default {
    VIBES,
    NICHES,
    TRAITS,
    LOCATIONS,
    generateRandomInfluencer,
    getVibesByCategory,
    getNichesByCategory,
    getTraitsByCategory
};
