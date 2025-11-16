// Unified Voice Generation System
// Combines ElevenLabs, Bark, and RAVE for unique AI voices
import { generateVoice as generateElevenLabsVoice } from './voice-generator.js';
import { generateBarkVoice, generateExpressiveBarkVoice, listBarkVoices } from './bark-wrapper.js';
import { processVoiceWithRAVE, applyRAVEEffect } from './rave-wrapper.js';
import { generateSyntheticVoice, listVoiceProfiles as listSyntheticProfiles } from './synthetic-voice-generator.js';
import fs from 'fs';
import path from 'path';

/**
 * Voice generation engines available
 */
export const VOICE_ENGINES = {
    ELEVENLABS: 'elevenlabs',      // High quality, realistic
    BARK: 'bark',                  // Expressive, synthetic
    SYNTHETIC: 'synthetic',        // RAVE + ElevenLabs (beautifully AI)
    HYBRID: 'hybrid'               // Best of all engines
};

/**
 * Generate voice using specified engine
 */
export async function generateVoiceWithEngine(
    persona,
    text,
    engine = VOICE_ENGINES.ELEVENLABS,
    options = {}
) {
    console.log(`\n🎤 === VOICE GENERATION ===`);
    console.log(`   Persona: ${persona.name}`);
    console.log(`   Engine: ${engine}`);
    console.log(`   Text length: ${text.length} characters`);

    const outputDir = './output/voice';
    fs.mkdirSync(outputDir, { recursive: true });

    let result;

    switch (engine) {
        case VOICE_ENGINES.ELEVENLABS:
            result = await generateElevenLabsVoice(persona, text);
            if (result.success && !options.skipSave) {
                const savePath = path.join(outputDir, `${persona.handle}_elevenlabs.mp3`);
                fs.writeFileSync(savePath, result.audio);
                result.path = savePath;
            }
            break;

        case VOICE_ENGINES.BARK:
            const barkPath = path.join(outputDir, `${persona.handle}_bark.wav`);
            result = await generateBarkVoice(text, persona, barkPath);
            break;

        case VOICE_ENGINES.SYNTHETIC:
            result = await generateSyntheticVoice(persona, text);
            break;

        case VOICE_ENGINES.HYBRID:
            result = await generateHybridVoice(persona, text, options);
            break;

        default:
            result = {
                success: false,
                error: `Unknown engine: ${engine}`
            };
    }

    if (result.success) {
        console.log(`✅ Voice generated successfully`);
        console.log(`   Path: ${result.path || 'in-memory'}`);
    } else {
        console.log(`❌ Voice generation failed: ${result.error}`);
    }

    return result;
}

/**
 * Generate hybrid voice (combines multiple engines)
 * 1. Generate base with ElevenLabs OR Bark
 * 2. Apply RAVE processing for uniqueness
 */
export async function generateHybridVoice(persona, text, options = {}) {
    console.log('🔄 Generating hybrid voice (multi-engine)...');

    const tempDir = './output/temp';
    fs.mkdirSync(tempDir, { recursive: true });

    // Step 1: Generate base voice
    let baseVoice;
    const useElevenLabs = !options.useBark && process.env.ELEVENLABS_API_KEY;

    if (useElevenLabs) {
        console.log('   Step 1: Generating base with ElevenLabs...');
        baseVoice = await generateElevenLabsVoice(persona, text);
    } else {
        console.log('   Step 1: Generating base with Bark...');
        const barkPath = path.join(tempDir, `temp_bark_${Date.now()}.wav`);
        baseVoice = await generateBarkVoice(text, persona, barkPath);
    }

    if (!baseVoice.success) {
        return baseVoice;
    }

    // Step 2: Apply RAVE processing for unique character
    console.log('   Step 2: Applying RAVE processing...');

    const tempInput = path.join(tempDir, `temp_input_${Date.now()}.wav`);
    const finalOutput = path.join('./output/voice', `${persona.handle}_hybrid.wav`);

    fs.writeFileSync(tempInput, baseVoice.audio);

    const raveResult = await processVoiceWithRAVE(
        baseVoice.audio,
        persona,
        finalOutput
    );

    // Cleanup temp files
    try {
        fs.unlinkSync(tempInput);
        if (baseVoice.path && baseVoice.path.includes('temp')) {
            fs.unlinkSync(baseVoice.path);
        }
    } catch (e) {
        // Ignore cleanup errors
    }

    if (raveResult.success) {
        const finalAudio = fs.readFileSync(finalOutput);
        return {
            success: true,
            audio: finalAudio,
            path: finalOutput,
            engine: 'hybrid',
            baseEngine: useElevenLabs ? 'elevenlabs' : 'bark',
            processing: 'RAVE enhanced',
            format: 'wav'
        };
    }

    // If RAVE fails, return base voice
    console.log('   ⚠️  RAVE processing failed, returning base voice');
    return {
        ...baseVoice,
        engine: 'hybrid',
        baseEngine: useElevenLabs ? 'elevenlabs' : 'bark',
        processing: 'base only'
    };
}

/**
 * Generate voice comparison samples (all engines)
 */
export async function generateVoiceComparison(persona, text) {
    console.log('\n🎭 Generating voice comparison across all engines...\n');

    const results = {};

    // ElevenLabs
    console.log('1️⃣  ElevenLabs:');
    results.elevenlabs = await generateVoiceWithEngine(
        persona,
        text,
        VOICE_ENGINES.ELEVENLABS
    );

    // Bark
    console.log('\n2️⃣  Bark:');
    results.bark = await generateVoiceWithEngine(
        persona,
        text,
        VOICE_ENGINES.BARK
    );

    // Synthetic (RAVE + ElevenLabs)
    console.log('\n3️⃣  Synthetic:');
    results.synthetic = await generateVoiceWithEngine(
        persona,
        text,
        VOICE_ENGINES.SYNTHETIC
    );

    // Hybrid
    console.log('\n4️⃣  Hybrid:');
    results.hybrid = await generateVoiceWithEngine(
        persona,
        text,
        VOICE_ENGINES.HYBRID
    );

    // Summary
    console.log('\n📊 Comparison Summary:');
    Object.entries(results).forEach(([engine, result]) => {
        const status = result.success ? '✅' : '❌';
        console.log(`   ${status} ${engine}: ${result.success ? result.path : result.error}`);
    });

    return results;
}

/**
 * Generate voice for different use cases
 */
export async function generateVoiceForUseCase(persona, useCase, text = null) {
    const useCases = {
        'intro': {
            text: text || `Hi, I'm ${persona.name}. ${persona.mythos?.tagline || ''}`,
            engine: VOICE_ENGINES.SYNTHETIC,
            filename: 'intro'
        },
        'post': {
            text: text || persona.bio,
            engine: VOICE_ENGINES.ELEVENLABS,
            filename: 'post'
        },
        'announcement': {
            text: text || `Hey everyone! ${persona.name} here with exciting news!`,
            engine: VOICE_ENGINES.HYBRID,
            filename: 'announcement'
        },
        'signature': {
            text: text || persona.mythos?.tagline || persona.name,
            engine: VOICE_ENGINES.SYNTHETIC,
            filename: 'signature'
        }
    };

    const config = useCases[useCase];
    if (!config) {
        return {
            success: false,
            error: `Unknown use case: ${useCase}. Available: ${Object.keys(useCases).join(', ')}`
        };
    }

    return await generateVoiceWithEngine(persona, config.text, config.engine);
}

/**
 * List all available voice options
 */
export function listAllVoiceOptions() {
    return {
        engines: Object.values(VOICE_ENGINES),
        elevenlabs: {
            available: !!process.env.ELEVENLABS_API_KEY,
            description: 'High-quality, realistic voice synthesis'
        },
        bark: {
            available: true, // Python package check would be async
            description: 'Expressive, synthetic AI voices with emotions',
            voices: listBarkVoices()
        },
        synthetic: {
            available: !!process.env.ELEVENLABS_API_KEY,
            description: 'Beautifully AI voices (RAVE + ElevenLabs)',
            profiles: listSyntheticProfiles()
        },
        hybrid: {
            available: true,
            description: 'Best of all engines combined'
        }
    };
}

/**
 * Generate voice with auto-engine selection
 */
export async function generateVoiceAuto(persona, text, options = {}) {
    // Auto-select best engine based on availability and persona
    const aesthetic = persona.aesthetic_words?.join(' ').toLowerCase() || '';

    let selectedEngine;

    // If persona is explicitly synthetic/AI, use synthetic engine
    if (aesthetic.includes('synthetic') || aesthetic.includes('digital') || aesthetic.includes('ai')) {
        selectedEngine = VOICE_ENGINES.SYNTHETIC;
    }
    // If high quality needed and ElevenLabs available
    else if (process.env.ELEVENLABS_API_KEY && !options.forceBark) {
        selectedEngine = VOICE_ENGINES.ELEVENLABS;
    }
    // Default to Bark
    else {
        selectedEngine = VOICE_ENGINES.BARK;
    }

    console.log(`🤖 Auto-selected engine: ${selectedEngine}`);

    return await generateVoiceWithEngine(persona, text, selectedEngine, options);
}

export default {
    generateVoiceWithEngine,
    generateHybridVoice,
    generateVoiceComparison,
    generateVoiceForUseCase,
    listAllVoiceOptions,
    generateVoiceAuto,
    VOICE_ENGINES
};
