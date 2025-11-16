// Advanced Music Generation using Suno API
import axios from 'axios';
import fs from 'fs';
import path from 'path';

/**
 * Suno API integration (unofficial/community API)
 * When official API is available, update the endpoints
 */

const SUNO_API_BASE = process.env.SUNO_API_URL || 'https://api.suno.ai/v1';
const SUNO_API_KEY = process.env.SUNO_API_KEY;

/**
 * Generate music prompt from persona and mood
 */
function createMusicPrompt(persona, genreMood) {
    const { tone_of_voice, aesthetic_words, niche } = persona;

    // Combine aesthetic and mood for rich prompt
    const aestheticStr = aesthetic_words.join(', ');
    const vibe = `${tone_of_voice}, ${aestheticStr}`;

    return {
        genre: genreMood,
        mood: vibe,
        theme: niche,
        style: `${genreMood} with ${tone_of_voice} energy`
    };
}

/**
 * Generate song using Suno API
 */
export async function generateSong(persona, lyrics, genreMood = 'pop electronic') {
    if (!SUNO_API_KEY) {
        console.warn('⚠️  SUNO_API_KEY not set - using mock music generation');
        return generateMockSong(persona, lyrics, genreMood);
    }

    try {
        const prompt = createMusicPrompt(persona, genreMood);

        console.log(`🎵 Generating song for ${persona.name}...`);
        console.log(`   Genre/Mood: ${genreMood}`);
        console.log(`   Style: ${prompt.style}`);

        // Create song generation request
        const response = await axios.post(
            `${SUNO_API_BASE}/songs`,
            {
                lyrics,
                prompt: prompt.style,
                genre: genreMood,
                make_instrumental: false,
                wait_audio: true // Wait for audio to be generated
            },
            {
                headers: {
                    'Authorization': `Bearer ${SUNO_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 120000 // 2 minute timeout
            }
        );

        const songData = response.data;

        console.log(`✅ Song generated: ${songData.id}`);

        // Download audio file if URL provided
        let audioBuffer = null;
        if (songData.audio_url) {
            const audioResponse = await axios.get(songData.audio_url, {
                responseType: 'arraybuffer'
            });
            audioBuffer = Buffer.from(audioResponse.data);

            // Save to file
            const outputDir = './output/music';
            fs.mkdirSync(outputDir, { recursive: true });
            const fileName = `${persona.handle}_${songData.id}.mp3`;
            const filePath = path.join(outputDir, fileName);
            fs.writeFileSync(filePath, audioBuffer);
            console.log(`   Saved to: ${filePath}`);
        }

        return {
            success: true,
            id: songData.id,
            title: songData.title,
            audioUrl: songData.audio_url,
            audio: audioBuffer,
            duration: songData.duration,
            genre: genreMood,
            lyrics
        };

    } catch (error) {
        console.error('❌ Suno generation error:', error.message);

        // Fallback to mock
        if (error.response?.status === 401) {
            console.warn('   Invalid API key, using mock generation');
        } else if (error.code === 'ECONNREFUSED') {
            console.warn('   API unavailable, using mock generation');
        }

        return generateMockSong(persona, lyrics, genreMood);
    }
}

/**
 * Generate song with auto-created lyrics
 */
export async function generateSongAuto(persona, theme, genreMood = 'pop electronic') {
    const lyrics = generateLyrics(persona, theme, genreMood);
    return await generateSong(persona, lyrics, genreMood);
}

/**
 * Generate lyrics based on persona and theme
 */
function generateLyrics(persona, theme, genreMood) {
    const { name, tone_of_voice, niche } = persona;

    // Create thematic lyrics
    const verses = [
        `In the ${niche} world, I found my way`,
        `Living ${tone_of_voice}, every single day`,
        `${theme} is more than just a dream`,
        `It's the essence of my everything`
    ];

    const chorus = [
        `I'm ${name}, breaking through the noise`,
        `My voice, my choice, I'm making my own choice`,
        `${theme} running through my veins`,
        `Nothing's gonna break these chains`
    ];

    return `
[Verse 1]
${verses[0]}
${verses[1]}

[Pre-Chorus]
${verses[2]}
${verses[3]}

[Chorus]
${chorus.join('\n')}

[Verse 2]
Every moment, every beat
${tone_of_voice} energy, can't be beat
In this ${niche} space I've made
My legacy will never fade

[Chorus]
${chorus.join('\n')}

[Bridge]
This is who I am
This is where I stand
${theme} in my soul
I'm in control

[Outro]
I'm ${name}
And I'm here to stay
    `.trim();
}

/**
 * Mock song generation (for when API is unavailable)
 */
function generateMockSong(persona, lyrics, genreMood) {
    console.log('📝 Using mock song generation (no API key)');

    return {
        success: true,
        mock: true,
        title: `${persona.name}'s Anthem`,
        genre: genreMood,
        lyrics,
        duration: 180, // 3 minutes
        note: 'Set SUNO_API_KEY to generate real audio',
        audioUrl: null,
        audio: null
    };
}

/**
 * Generate instrumental track (no lyrics)
 */
export async function generateInstrumental(persona, mood, duration = 120) {
    if (!SUNO_API_KEY) {
        return {
            success: false,
            note: 'Set SUNO_API_KEY to generate instrumentals'
        };
    }

    try {
        const prompt = createMusicPrompt(persona, mood);

        const response = await axios.post(
            `${SUNO_API_BASE}/songs`,
            {
                prompt: `Instrumental ${prompt.style}, ${duration} seconds`,
                make_instrumental: true,
                duration,
                wait_audio: true
            },
            {
                headers: {
                    'Authorization': `Bearer ${SUNO_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return {
            success: true,
            ...response.data
        };

    } catch (error) {
        console.error('❌ Instrumental generation error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

export default {
    generateSong,
    generateSongAuto,
    generateInstrumental,
    generateLyrics
};
