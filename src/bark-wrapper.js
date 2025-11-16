// Node.js wrapper for Bark TTS (Suno AI)
// Bark is excellent for synthetic, expressive AI voices
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BARK_SCRIPT = path.join(__dirname, 'bark-processor.py');

/**
 * Execute Bark Python script
 */
function executeBark(args) {
    return new Promise((resolve, reject) => {
        const pythonArgs = ['python3', BARK_SCRIPT, ...args];

        const process = spawn(pythonArgs[0], pythonArgs.slice(1));

        let stdout = '';
        let stderr = '';

        process.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        process.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        process.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Bark process exited with code ${code}\n${stderr}`));
            } else {
                try {
                    const result = JSON.parse(stdout);
                    resolve(result);
                } catch (e) {
                    reject(new Error(`Failed to parse Bark output: ${stdout}\n${stderr}`));
                }
            }
        });

        process.on('error', (error) => {
            reject(new Error(`Failed to start Bark process: ${error.message}`));
        });
    });
}

/**
 * Bark voice presets optimized for AI influencers
 */
const BARK_VOICE_PRESETS = {
    // English voices
    'digital_female': 'v2/en_speaker_6',      // Clear, digital female
    'energetic_female': 'v2/en_speaker_9',    // Energetic, young female
    'confident_male': 'v2/en_speaker_0',      // Deep, confident male
    'smooth_male': 'v2/en_speaker_8',         // Smooth, professional male
    'neutral': 'v2/en_speaker_1',             // Neutral, versatile

    // Multi-language voices (for global AI influencers)
    'spanish': 'v2/es_speaker_3',
    'french': 'v2/fr_speaker_5',
    'german': 'v2/de_speaker_3',
    'italian': 'v2/it_speaker_0',
    'portuguese': 'v2/pt_speaker_4',
    'chinese': 'v2/zh_speaker_7',
    'japanese': 'v2/ja_speaker_2',
    'korean': 'v2/ko_speaker_1'
};

/**
 * Generate voice using Bark TTS
 */
export async function generateBarkVoice(text, persona, outputPath = null) {
    const voicePreset = selectBarkVoice(persona);

    const args = [
        '--text', text,
        '--voice', voicePreset
    ];

    if (outputPath) {
        args.push('--output', outputPath);
    } else {
        const defaultPath = path.join('./output/voice', `${persona.handle}_bark_${Date.now()}.wav`);
        args.push('--output', defaultPath);
        outputPath = defaultPath;
    }

    try {
        console.log(`🐕 Generating Bark voice...`);
        console.log(`   Voice preset: ${voicePreset}`);
        console.log(`   Text: ${text.substring(0, 50)}...`);

        const result = await executeBark(args);

        if (result.success) {
            console.log(`✅ Bark voice generated: ${result.output_path}`);

            // Read the generated file
            const audioBuffer = fs.readFileSync(result.output_path);

            return {
                success: true,
                audio: audioBuffer,
                path: result.output_path,
                voicePreset,
                duration: result.duration || 0,
                format: 'wav'
            };
        }

        return result;
    } catch (error) {
        console.error('❌ Bark generation error:', error.message);
        return {
            success: false,
            error: error.message,
            note: 'Install Bark: pip install git+https://github.com/suno-ai/bark.git'
        };
    }
}

/**
 * Select Bark voice preset based on persona characteristics
 */
function selectBarkVoice(persona) {
    const aesthetic = persona.aesthetic_words?.join(' ').toLowerCase() || '';
    const tone = persona.tone_of_voice?.toLowerCase() || '';

    // Map persona to voice preset
    if (aesthetic.includes('energetic') || tone.includes('energetic')) {
        return BARK_VOICE_PRESETS['energetic_female'];
    }

    if (aesthetic.includes('digital') || aesthetic.includes('synthetic')) {
        return BARK_VOICE_PRESETS['digital_female'];
    }

    if (aesthetic.includes('confident') || tone.includes('confident')) {
        return BARK_VOICE_PRESETS['confident_male'];
    }

    if (aesthetic.includes('smooth') || aesthetic.includes('elegant')) {
        return BARK_VOICE_PRESETS['smooth_male'];
    }

    // Default to neutral
    return BARK_VOICE_PRESETS['neutral'];
}

/**
 * Generate voice with special effects (laughter, music notes, etc.)
 * Bark supports special tokens: [laughs], [sighs], [music], etc.
 */
export async function generateExpressiveBarkVoice(text, persona, emotion = null, outputPath = null) {
    let enhancedText = text;

    // Add emotional expressions based on emotion type
    if (emotion === 'happy') {
        enhancedText = `[laughs] ${text}`;
    } else if (emotion === 'sigh') {
        enhancedText = `[sighs] ${text}`;
    } else if (emotion === 'music') {
        enhancedText = `♪ ${text} ♪`;
    }

    return await generateBarkVoice(enhancedText, persona, outputPath);
}

/**
 * Generate voice in multiple languages
 */
export async function generateMultilingualVoice(text, persona, language = 'english', outputPath = null) {
    const languageMap = {
        'spanish': 'spanish',
        'french': 'french',
        'german': 'german',
        'italian': 'italian',
        'portuguese': 'portuguese',
        'chinese': 'chinese',
        'japanese': 'japanese',
        'korean': 'korean'
    };

    const voicePreset = BARK_VOICE_PRESETS[languageMap[language.toLowerCase()]] || BARK_VOICE_PRESETS['neutral'];

    const args = [
        '--text', text,
        '--voice', voicePreset
    ];

    if (outputPath) {
        args.push('--output', outputPath);
    }

    try {
        console.log(`🌍 Generating ${language} voice with Bark...`);
        const result = await executeBark(args);

        if (result.success) {
            const audioBuffer = fs.readFileSync(result.output_path);
            return {
                success: true,
                audio: audioBuffer,
                path: result.output_path,
                language,
                voicePreset
            };
        }

        return result;
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * List all available Bark voice presets
 */
export function listBarkVoices() {
    return Object.entries(BARK_VOICE_PRESETS).map(([name, preset]) => ({
        name,
        preset,
        description: getBarkVoiceDescription(name)
    }));
}

/**
 * Get description for Bark voice preset
 */
function getBarkVoiceDescription(name) {
    const descriptions = {
        'digital_female': 'Clear, digital-sounding female voice',
        'energetic_female': 'Energetic, youthful female voice',
        'confident_male': 'Deep, confident male voice',
        'smooth_male': 'Smooth, professional male voice',
        'neutral': 'Neutral, versatile voice',
        'spanish': 'Spanish language voice',
        'french': 'French language voice',
        'german': 'German language voice',
        'italian': 'Italian language voice',
        'portuguese': 'Portuguese language voice',
        'chinese': 'Chinese language voice',
        'japanese': 'Japanese language voice',
        'korean': 'Korean language voice'
    };

    return descriptions[name] || 'Voice preset';
}

export default {
    generateBarkVoice,
    generateExpressiveBarkVoice,
    generateMultilingualVoice,
    listBarkVoices,
    BARK_VOICE_PRESETS
};
