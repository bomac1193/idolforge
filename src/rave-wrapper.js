// Node.js wrapper for RAVE audio processor
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAVE_SCRIPT = path.join(__dirname, 'rave-processor.py');
const RAVE_MODEL_PATH = process.env.RAVE_MODEL_PATH || null;

/**
 * Execute RAVE Python script
 */
function executeRAVE(args) {
    return new Promise((resolve, reject) => {
        const pythonArgs = ['python3', RAVE_SCRIPT, ...args];

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
                reject(new Error(`RAVE process exited with code ${code}\n${stderr}`));
            } else {
                try {
                    const result = JSON.parse(stdout);
                    resolve(result);
                } catch (e) {
                    reject(new Error(`Failed to parse RAVE output: ${stdout}\n${stderr}`));
                }
            }
        });

        process.on('error', (error) => {
            reject(new Error(`Failed to start RAVE process: ${error.message}`));
        });
    });
}

/**
 * Synthesize audio using RAVE
 */
export async function synthesizeAudio(duration = 5.0, temperature = 1.0, outputPath = null) {
    const args = [
        '--command', 'synthesize',
        '--duration', duration.toString(),
        '--temperature', temperature.toString()
    ];

    if (RAVE_MODEL_PATH) {
        args.push('--model', RAVE_MODEL_PATH);
    }

    if (outputPath) {
        args.push('--output', outputPath);
    }

    try {
        console.log(`🎛️  Synthesizing ${duration}s audio with RAVE...`);
        const result = await executeRAVE(args);

        if (result.success) {
            console.log(`✅ Audio synthesized: ${result.output_path}`);
        }

        return result;
    } catch (error) {
        console.error('❌ RAVE synthesis error:', error.message);
        return {
            success: false,
            error: error.message,
            note: 'Install RAVE dependencies: pip install acids-rave torch torchaudio'
        };
    }
}

/**
 * Apply audio effects using RAVE latent space manipulation
 */
export async function applyRAVEEffect(inputPath, effectType = 'timbre_shift', intensity = 0.5, outputPath = null) {
    const args = [
        '--command', 'effect',
        '--input', inputPath,
        '--effect', effectType,
        '--intensity', intensity.toString()
    ];

    if (RAVE_MODEL_PATH) {
        args.push('--model', RAVE_MODEL_PATH);
    }

    if (outputPath) {
        args.push('--output', outputPath);
    } else {
        outputPath = inputPath.replace('.mp3', '_rave_effect.mp3').replace('.wav', '_rave_effect.wav');
        args.push('--output', outputPath);
    }

    try {
        console.log(`🎛️  Applying RAVE effect: ${effectType} (intensity: ${intensity})...`);
        const result = await executeRAVE(args);

        if (result.success) {
            console.log(`✅ Effect applied: ${result.output_path}`);
        }

        return result;
    } catch (error) {
        console.error('❌ RAVE effect error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Process voice with RAVE for unique sonic character
 */
export async function processVoiceWithRAVE(voiceBuffer, persona, outputPath) {
    // Save voice buffer to temp file
    const tempInput = path.join('./output/temp', `temp_voice_${Date.now()}.wav`);
    const fs = await import('fs');
    fs.mkdirSync(path.dirname(tempInput), { recursive: true });
    fs.writeFileSync(tempInput, voiceBuffer);

    // Determine effect based on persona
    const effectMap = {
        'mysterious': { effect: 'timbre_shift', intensity: 0.7 },
        'energetic': { effect: 'texture', intensity: 0.8 },
        'calm': { effect: 'timbre_shift', intensity: 0.3 },
        'confident': { effect: 'texture', intensity: 0.5 },
        'playful': { effect: 'pitch_shift', intensity: 0.6 }
    };

    const toneEffect = effectMap[persona.tone_of_voice.toLowerCase()] || { effect: 'timbre_shift', intensity: 0.5 };

    // Apply RAVE processing
    const result = await applyRAVEEffect(
        tempInput,
        toneEffect.effect,
        toneEffect.intensity,
        outputPath
    );

    // Cleanup temp file
    try {
        fs.unlinkSync(tempInput);
    } catch (e) {
        // Ignore cleanup errors
    }

    return result;
}

/**
 * Create unique voice signature using RAVE
 */
export async function createVoiceSignature(persona) {
    const outputPath = path.join(
        './output/voice_signatures',
        `${persona.handle}_signature.wav`
    );

    // Generate base audio with varying temperature based on persona
    const temperatureMap = {
        'calm': 0.5,
        'confident': 0.8,
        'energetic': 1.2,
        'mysterious': 0.7,
        'playful': 1.0
    };

    const temperature = temperatureMap[persona.tone_of_voice.toLowerCase()] || 0.8;

    return await synthesizeAudio(3.0, temperature, outputPath);
}

/**
 * Combine Suno music with RAVE processing
 */
export async function enhanceMusicWithRAVE(musicPath, persona, outputPath = null) {
    console.log('🎵 Enhancing music with RAVE processing...');

    // Apply subtle effect to give music unique character
    return await applyRAVEEffect(
        musicPath,
        'texture',
        0.3, // Subtle enhancement
        outputPath || musicPath.replace('.mp3', '_enhanced.mp3')
    );
}

export default {
    synthesizeAudio,
    applyRAVEEffect,
    processVoiceWithRAVE,
    createVoiceSignature,
    enhanceMusicWithRAVE
};
