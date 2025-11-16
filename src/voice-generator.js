// Voice Generation using ElevenLabs
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import fs from 'fs';
import path from 'path';

let client = null;

function initElevenLabs() {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
        console.warn('⚠️  ELEVENLABS_API_KEY not set - voice generation disabled');
        return null;
    }

    if (!client) {
        client = new ElevenLabsClient({ apiKey });
    }
    return client;
}

/**
 * Generate voice characteristics based on persona
 */
function getVoiceSettings(persona) {
    const { tone_of_voice, aesthetic_words } = persona;

    // Map persona traits to voice characteristics
    const toneMap = {
        'confident': { stability: 0.7, similarity_boost: 0.8, style: 0.6 },
        'warm': { stability: 0.6, similarity_boost: 0.7, style: 0.5 },
        'energetic': { stability: 0.5, similarity_boost: 0.9, style: 0.8 },
        'calm': { stability: 0.8, similarity_boost: 0.6, style: 0.3 },
        'playful': { stability: 0.4, similarity_boost: 0.8, style: 0.7 },
        'professional': { stability: 0.75, similarity_boost: 0.7, style: 0.4 },
        'mysterious': { stability: 0.6, similarity_boost: 0.5, style: 0.6 }
    };

    // Get base settings from tone
    const baseSettings = toneMap[tone_of_voice.toLowerCase()] || toneMap['confident'];

    return {
        stability: baseSettings.stability,
        similarity_boost: baseSettings.similarity_boost,
        style: baseSettings.style,
        use_speaker_boost: true
    };
}

/**
 * Select appropriate voice based on persona characteristics
 */
function selectVoice(persona) {
    // ElevenLabs voice IDs (these are default voices, can be customized)
    const voices = {
        'female_confident': 'EXAVITQu4vr4xnSDxMaL', // Bella
        'female_warm': '21m00Tcm4TlvDq8ikWAM', // Rachel
        'female_energetic': 'AZnzlk1XvdvUeBnXmlld', // Domi
        'male_confident': 'TxGEqnHWrfWFTfGW9XjX', // Josh
        'male_warm': 'VR6AewLTigWG4xSOukaG', // Arnold
        'male_energetic': 'pNInz6obpgDQGcFmaJgB' // Adam
    };

    const aesthetic = persona.aesthetic_words.join(' ').toLowerCase();
    const gender = persona.name.length % 2 === 0 ? 'female' : 'male'; // Simple heuristic

    // Determine voice type from persona
    let voiceType = 'confident';
    if (aesthetic.includes('warm') || aesthetic.includes('gentle')) voiceType = 'warm';
    if (aesthetic.includes('energetic') || aesthetic.includes('vibrant')) voiceType = 'energetic';

    const voiceKey = `${gender}_${voiceType}`;
    return voices[voiceKey] || voices['female_confident'];
}

/**
 * Generate voice audio from text using ElevenLabs
 */
export async function generateVoice(persona, text, outputPath = null) {
    const elevenLabs = initElevenLabs();

    if (!elevenLabs) {
        return {
            success: false,
            error: 'ElevenLabs API not configured',
            note: 'Set ELEVENLABS_API_KEY environment variable to enable voice generation'
        };
    }

    try {
        const voiceId = selectVoice(persona);
        const voiceSettings = getVoiceSettings(persona);

        console.log(`🎤 Generating voice for ${persona.name}...`);
        console.log(`   Voice ID: ${voiceId}`);
        console.log(`   Text length: ${text.length} characters`);

        // Generate audio
        const audio = await elevenLabs.textToSpeech.convert(voiceId, {
            text,
            model_id: 'eleven_multilingual_v2', // Support multiple languages
            voice_settings: voiceSettings
        });

        // Convert audio stream to buffer
        const chunks = [];
        for await (const chunk of audio) {
            chunks.push(chunk);
        }
        const audioBuffer = Buffer.concat(chunks);

        // Save to file if path provided
        if (outputPath) {
            const fullPath = path.resolve(outputPath);
            fs.mkdirSync(path.dirname(fullPath), { recursive: true });
            fs.writeFileSync(fullPath, audioBuffer);
            console.log(`✅ Voice saved to: ${fullPath}`);
        }

        return {
            success: true,
            audio: audioBuffer,
            voiceId,
            settings: voiceSettings,
            duration: Math.ceil(text.length / 15), // Rough estimate: ~15 chars/second
            format: 'mp3'
        };

    } catch (error) {
        console.error('❌ Voice generation error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Generate voice introduction for influencer
 */
export async function generateIntroVoice(persona, mythos) {
    const introText = `
        Hi, I'm ${persona.name}. ${mythos.tagline}
        ${mythos.core_philosophy}
    `.trim();

    const outputDir = './output/voice';
    const fileName = `${persona.handle}_intro.mp3`;
    const outputPath = path.join(outputDir, fileName);

    const result = await generateVoice(persona, introText, outputPath);

    if (result.success) {
        return {
            ...result,
            path: outputPath,
            text: introText
        };
    }

    return result;
}

/**
 * Generate voice for post content
 */
export async function generatePostVoice(persona, post) {
    const voiceText = post.caption || post.hook || post.concept;

    const outputDir = './output/voice/posts';
    const fileName = `${persona.handle}_${Date.now()}.mp3`;
    const outputPath = path.join(outputDir, fileName);

    return await generateVoice(persona, voiceText, outputPath);
}

/**
 * Clone voice from audio sample (requires paid ElevenLabs plan)
 */
export async function cloneVoice(audioFilePath, voiceName, description) {
    const elevenLabs = initElevenLabs();

    if (!elevenLabs) {
        return {
            success: false,
            error: 'ElevenLabs API not configured'
        };
    }

    try {
        console.log(`🎭 Cloning voice: ${voiceName}...`);

        // Read audio file
        const audioFile = fs.readFileSync(audioFilePath);

        // Create voice clone
        const voice = await elevenLabs.voices.add({
            name: voiceName,
            description,
            files: [audioFile]
        });

        console.log(`✅ Voice cloned successfully: ${voice.voice_id}`);

        return {
            success: true,
            voiceId: voice.voice_id,
            name: voiceName
        };

    } catch (error) {
        console.error('❌ Voice cloning error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

export default {
    generateVoice,
    generateIntroVoice,
    generatePostVoice,
    cloneVoice
};
