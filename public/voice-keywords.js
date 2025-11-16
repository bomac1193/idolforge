// Voice Characteristic Keywords
// Preset voice styles, tones, and characteristics

const VOICE_CHARACTERISTICS = {
    // Tone/Energy
    tone: [
        'Energetic', 'Calm', 'Confident', 'Playful', 'Mysterious',
        'Smooth', 'Intense', 'Gentle', 'Bold', 'Warm'
    ],

    // Style/Character
    style: [
        'Robotic', 'Digital', 'Synthetic', 'Human-like', 'Glitchy',
        'Crystalline', 'Smooth', 'Rough', 'Whisper', 'Loud'
    ],

    // Accent/Language Feel (for Bark)
    accent: [
        'Neutral', 'Expressive', 'Monotone', 'Melodic', 'Rhythmic'
    ],

    // Special Effects (for Bark)
    effects: [
        'Laughs', 'Sighs', 'Musical', 'Breathy', 'Crisp'
    ],

    // Processing (for RAVE)
    processing: [
        'RAVE Enhanced', 'Timbre Shift', 'Texture', 'Pitch Shift', 'Clean'
    ]
};

// Voice generation presets
const VOICE_PRESETS = [
    {
        name: 'AI Influencer Intro',
        text: "Hey everyone! I'm {name}, and welcome to my space. Let's create something amazing together!",
        characteristics: ['Energetic', 'Confident', 'Digital'],
        engine: 'hybrid'
    },
    {
        name: 'Mysterious Persona',
        text: "I exist between dimensions, where the digital meets the infinite. Who am I? I am {name}.",
        characteristics: ['Mysterious', 'Synthetic', 'Whisper'],
        engine: 'synthetic'
    },
    {
        name: 'Hype Announcement',
        text: "[laughs] Okay, this is HUGE! You're not ready for what's coming next!",
        characteristics: ['Energetic', 'Expressive', 'Laughs'],
        engine: 'bark'
    },
    {
        name: 'Chill Vibe',
        text: "Just vibing here, creating content, living in the flow. This is {name}, and this is my world.",
        characteristics: ['Calm', 'Warm', 'Smooth'],
        engine: 'elevenlabs'
    },
    {
        name: 'Glitch Entity',
        text: "I am not what you expect. I am the glitch in your feed, the anomaly in your algorithm.",
        characteristics: ['Glitchy', 'Robotic', 'Mysterious', 'RAVE Enhanced'],
        engine: 'synthetic'
    },
    {
        name: 'Music Drop',
        text: "♪ This is my sound, my frequency, my signature. Feel it. ♪",
        characteristics: ['Musical', 'Energetic', 'Melodic'],
        engine: 'bark'
    },
    {
        name: 'Professional Bio',
        text: "{name} - {niche} influencer bringing you {vibe} content. Follow for more.",
        characteristics: ['Confident', 'Human-like', 'Clean'],
        engine: 'elevenlabs'
    },
    {
        name: 'Cyberpunk Persona',
        text: "From the neon streets to the digital void, I'm {name}. Your guide through the synthetic reality.",
        characteristics: ['Digital', 'Bold', 'Timbre Shift'],
        engine: 'hybrid'
    }
];

// Apply preset
function applyVoicePreset(presetName) {
    const preset = VOICE_PRESETS.find(p => p.name === presetName);
    if (!preset) return;

    // Fill voice text
    document.getElementById('voiceText').value = preset.text;

    // Set engine
    document.getElementById('voiceEngine').value = preset.engine;

    // Clear all characteristic pills
    document.querySelectorAll('.voice-characteristic-pill').forEach(pill => {
        pill.classList.remove('selected');
    });

    // Select preset characteristics
    preset.characteristics.forEach(char => {
        const pill = Array.from(document.querySelectorAll('.voice-characteristic-pill'))
            .find(p => p.textContent === char);
        if (pill) {
            pill.classList.add('selected');
        }
    });

    // Update hidden input
    updateVoiceCharacteristics();
}

// Update voice characteristics hidden input
function updateVoiceCharacteristics() {
    const selected = Array.from(document.querySelectorAll('.voice-characteristic-pill.selected'))
        .map(pill => pill.textContent);

    const input = document.getElementById('voiceCharacteristics');
    if (input) {
        input.value = selected.join(', ');
    }
}

// Toggle voice characteristic
function toggleVoiceCharacteristic(element) {
    element.classList.toggle('selected');
    updateVoiceCharacteristics();
}

// Initialize voice keyword pills
function initializeVoiceKeywords() {
    const container = document.getElementById('voiceCharacteristicPills');
    if (!container) return;

    // Combine all characteristics
    const allCharacteristics = [
        ...VOICE_CHARACTERISTICS.tone,
        ...VOICE_CHARACTERISTICS.style,
        ...VOICE_CHARACTERISTICS.accent,
        ...VOICE_CHARACTERISTICS.effects,
        ...VOICE_CHARACTERISTICS.processing
    ];

    // Create pills
    allCharacteristics.forEach(char => {
        const pill = document.createElement('div');
        pill.className = 'voice-characteristic-pill';
        pill.textContent = char;
        pill.onclick = () => toggleVoiceCharacteristic(pill);
        container.appendChild(pill);
    });
}

// Fill voice text with persona variables
function fillVoiceTextVariables() {
    const text = document.getElementById('voiceText').value;
    const name = document.getElementById('vibe').value || 'Digital Entity';
    const niche = document.getElementById('niche').value || 'lifestyle';
    const vibe = document.getElementById('vibe').value || 'energetic';

    // Replace variables
    let filledText = text
        .replace(/\{name\}/g, name)
        .replace(/\{niche\}/g, niche)
        .replace(/\{vibe\}/g, vibe);

    return filledText;
}

// Make functions globally available
window.VOICE_CHARACTERISTICS = VOICE_CHARACTERISTICS;
window.VOICE_PRESETS = VOICE_PRESETS;
window.applyVoicePreset = applyVoicePreset;
window.toggleVoiceCharacteristic = toggleVoiceCharacteristic;
window.initializeVoiceKeywords = initializeVoiceKeywords;
window.updateVoiceCharacteristics = updateVoiceCharacteristics;
window.fillVoiceTextVariables = fillVoiceTextVariables;
