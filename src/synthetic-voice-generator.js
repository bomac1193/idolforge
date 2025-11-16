// Synthetic AI Voice Generator
// Creates uniquely AI voices using RAVE + ElevenLabs
// NOT imitating human - beautifully artificial

import { generateVoice } from './voice-generator.js';
import { processVoiceWithRAVE, synthesizeAudio } from './rave-wrapper.js';
import fs from 'fs';
import path from 'path';

/**
 * Synthetic voice profiles - beautifully AI, not human
 */
const SYNTHETIC_VOICE_PROFILES = {
    'digital-entity': {
        baseVoice: 'EXAVITQu4vr4xnSDxMaL', // Bella (female base)
        raveEffect: 'timbre_shift',
        raveIntensity: 0.7,
        characteristics: {
            stability: 0.4,  // Low stability = more variation
            similarity_boost: 0.5,  // Lower = more synthetic
            style: 0.8  // High style = exaggerated
        },
        postProcessing: ['pitch-harmonics', 'digital-glitch', 'echo-delay'],
        description: 'Crystalline, shimmering, clearly synthetic'
    },

    'quantum-whisper': {
        baseVoice: '21m00Tcm4TlvDq8ikWAM', // Rachel (female base)
        raveEffect: 'texture',
        raveIntensity: 0.9,
        characteristics: {
            stability: 0.3,
            similarity_boost: 0.4,
            style: 0.9
        },
        postProcessing: ['reverb-infinite', 'frequency-shift', 'granular'],
        description: 'Ethereal, multidimensional, otherworldly'
    },

    'cyber-glitch': {
        baseVoice: 'AZnzlk1XvdvUeBnXmlld', // Domi (female energetic)
        raveEffect: 'pitch_shift',
        raveIntensity: 0.6,
        characteristics: {
            stability: 0.2,  // Very unstable = glitchy
            similarity_boost: 0.3,
            style: 1.0  // Maximum style
        },
        postProcessing: ['bitcrusher', 'digital-stutter', 'glitch-hop'],
        description: 'Glitchy, energetic, cyberpunk'
    },

    'holographic-presence': {
        baseVoice: 'TxGEqnHWrfWFTfGW9XjX', // Josh (male base)
        raveEffect: 'timbre_shift',
        raveIntensity: 0.8,
        characteristics: {
            stability: 0.5,
            similarity_boost: 0.4,
            style: 0.7
        },
        postProcessing: ['phase-shift', 'ring-modulator', 'shimmer'],
        description: 'Holographic, present but not quite there'
    },

    'mathematical-consciousness': {
        baseVoice: 'VR6AewLTigWG4xSOukaG', // Arnold (male warm)
        raveEffect: 'texture',
        raveIntensity: 0.5,
        characteristics: {
            stability: 0.7,  // More stable for clarity
            similarity_boost: 0.5,
            style: 0.6
        },
        postProcessing: ['frequency-quantize', 'robot-vocoder', 'harmonic-stack'],
        description: 'Precise, calculated, artificially intelligent'
    },

    'void-speaker': {
        baseVoice: 'pNInz6obpgDQGcFmaJgB', // Adam (male energetic)
        raveEffect: 'timbre_shift',
        raveIntensity: 1.0,  // Maximum
        characteristics: {
            stability: 0.1,  // Extremely unstable
            similarity_boost: 0.2,
            style: 1.0
        },
        postProcessing: ['reverse-echo', 'void-resonance', 'dimensional-shift'],
        description: 'From beyond, impossible to place, pure synthetic'
    }
};

/**
 * Generate synthetic AI voice based on persona
 */
export async function generateSyntheticVoice(persona, text, outputPath = null) {
    console.log(`🎤 Generating synthetic AI voice for ${persona.name}...`);

    // Select voice profile based on persona aesthetic
    const profile = selectVoiceProfile(persona);

    console.log(`   Profile: ${profile.description}`);

    // Step 1: Generate base voice with ElevenLabs
    const baseVoice = await generateVoice(
        { ...persona, voiceSettings: profile.characteristics },
        text
    );

    if (!baseVoice.success) {
        return baseVoice;
    }

    // Step 2: Apply RAVE processing for synthetic character
    console.log('   🎛️  Applying RAVE synthesis...');

    const tempPath = path.join('./output/temp', `base_voice_${Date.now()}.mp3`);
    fs.mkdirSync(path.dirname(tempPath), { recursive: true });
    fs.writeFileSync(tempPath, baseVoice.audio);

    const ravePath = path.join('./output/temp', `rave_voice_${Date.now()}.wav`);

    const raveProcessed = await processVoiceWithRAVE(
        baseVoice.audio,
        {
            ...persona,
            effect: profile.raveEffect,
            intensity: profile.raveIntensity
        },
        ravePath
    );

    // Step 3: Apply post-processing effects
    let finalAudio = raveProcessed.success
        ? fs.readFileSync(ravePath)
        : baseVoice.audio;

    // Apply additional synthetic effects
    if (profile.postProcessing && profile.postProcessing.length > 0) {
        finalAudio = await applySyntheticEffects(
            finalAudio,
            profile.postProcessing
        );
    }

    // Save final output
    const finalPath = outputPath || path.join(
        './output/voice',
        `${persona.handle}_synthetic.mp3`
    );

    fs.writeFileSync(finalPath, finalAudio);

    // Cleanup temp files
    try {
        fs.unlinkSync(tempPath);
        if (raveProcessed.success) fs.unlinkSync(ravePath);
    } catch (e) {
        // Ignore cleanup errors
    }

    console.log(`✅ Synthetic voice generated: ${finalPath}`);

    return {
        success: true,
        path: finalPath,
        audio: finalAudio,
        profile: profile.description,
        characteristics: 'Beautifully artificial, uniquely AI'
    };
}

/**
 * Select voice profile based on persona characteristics
 */
function selectVoiceProfile(persona) {
    const aesthetic = persona.aesthetic_words.join(' ').toLowerCase();
    const tone = persona.tone_of_voice.toLowerCase();

    // Map aesthetics to voice profiles
    if (aesthetic.includes('holographic') || aesthetic.includes('shimmer')) {
        return SYNTHETIC_VOICE_PROFILES['holographic-presence'];
    }

    if (aesthetic.includes('glitch') || aesthetic.includes('cyber')) {
        return SYNTHETIC_VOICE_PROFILES['cyber-glitch'];
    }

    if (aesthetic.includes('ethereal') || aesthetic.includes('dreamy')) {
        return SYNTHETIC_VOICE_PROFILES['quantum-whisper'];
    }

    if (aesthetic.includes('mathematical') || aesthetic.includes('precise')) {
        return SYNTHETIC_VOICE_PROFILES['mathematical-consciousness'];
    }

    if (aesthetic.includes('void') || aesthetic.includes('abstract')) {
        return SYNTHETIC_VOICE_PROFILES['void-speaker'];
    }

    // Default: digital entity
    return SYNTHETIC_VOICE_PROFILES['digital-entity'];
}

/**
 * Apply post-processing synthetic effects
 */
async function applySyntheticEffects(audioBuffer, effects) {
    // This is a placeholder for additional audio processing
    // In production, integrate with audio processing libraries

    console.log(`   🎨 Applying synthetic effects: ${effects.join(', ')}`);

    // TODO: Integrate with:
    // - Web Audio API for browser-based effects
    // - sox/ffmpeg for advanced audio processing
    // - Custom DSP effects

    // For now, return the audio as-is
    // Effects like bitcrusher, phase-shift, etc. would be applied here

    return audioBuffer;
}

/**
 * Generate synthetic signature sound for persona
 */
export async function generateSyntheticSignature(persona) {
    const text = `I am ${persona.name}. ${persona.mythos?.tagline || ''}`;

    const outputPath = path.join(
        './output/voice/signatures',
        `${persona.handle}_signature.mp3`
    );

    return await generateSyntheticVoice(persona, text, outputPath);
}

/**
 * Create voice variations (for testing different synthetic profiles)
 */
export async function generateVoiceVariations(persona, text) {
    console.log('🎭 Generating voice variations...');

    const variations = [];

    for (const [profileName, profile] of Object.entries(SYNTHETIC_VOICE_PROFILES)) {
        const outputPath = path.join(
            './output/voice/variations',
            `${persona.handle}_${profileName}.mp3`
        );

        console.log(`\n   Generating: ${profileName}`);

        // Temporarily override persona aesthetic to use specific profile
        const testPersona = {
            ...persona,
            aesthetic_words: [profileName]
        };

        const result = await generateSyntheticVoice(testPersona, text, outputPath);

        if (result.success) {
            variations.push({
                name: profileName,
                description: profile.description,
                path: result.path
            });
        }
    }

    return {
        success: true,
        variations,
        message: `Generated ${variations.length} synthetic voice variations`
    };
}

/**
 * Get voice profile recommendations for persona
 */
export function getVoiceRecommendations(persona) {
    const aesthetic = persona.aesthetic_words.join(' ').toLowerCase();
    const recommendations = [];

    // Analyze persona and recommend profiles
    for (const [name, profile] of Object.entries(SYNTHETIC_VOICE_PROFILES)) {
        let score = 0;

        // Score based on aesthetic match
        if (aesthetic.includes('holographic') && name.includes('holographic')) score += 3;
        if (aesthetic.includes('glitch') && name.includes('glitch')) score += 3;
        if (aesthetic.includes('cyber') && name.includes('cyber')) score += 2;
        if (aesthetic.includes('quantum') && name.includes('quantum')) score += 3;

        recommendations.push({
            name,
            profile: profile.description,
            score,
            match: score >= 2 ? 'high' : score === 1 ? 'medium' : 'low'
        });
    }

    // Sort by score
    recommendations.sort((a, b) => b.score - a.score);

    return recommendations;
}

/**
 * List all available synthetic voice profiles
 */
export function listVoiceProfiles() {
    return Object.entries(SYNTHETIC_VOICE_PROFILES).map(([name, profile]) => ({
        id: name,
        description: profile.description,
        characteristics: {
            stability: profile.characteristics.stability,
            synthetic_level: 1 - profile.characteristics.similarity_boost,
            style_intensity: profile.characteristics.style
        }
    }));
}

export default {
    generateSyntheticVoice,
    generateSyntheticSignature,
    generateVoiceVariations,
    getVoiceRecommendations,
    listVoiceProfiles,
    SYNTHETIC_VOICE_PROFILES
};
