// Autonomous Influencer Orchestration System
// Combines all AI capabilities into a unified autonomous agent

import { createInfluencerAssistant, createThread, chatWithAgent } from './autonomous-agent.js';
import { generateIntroVoice, generatePostVoice } from './voice-generator.js';
import { generateSongAuto } from './suno-generator.js';
import { processVoiceWithRAVE, enhanceMusicWithRAVE } from './rave-wrapper.js';
import { generatePersonaImages } from './image-generator.js';

/**
 * Create a complete autonomous influencer with all capabilities
 */
export async function createAutonomousInfluencer(persona, mythos, options = {}) {
    const {
        includeVoice = true,
        includeMusic = true,
        includeRAVE = false,
        includeAgent = true,
        includeImages = true
    } = options;

    console.log('\n🚀 Creating Autonomous Influencer...\n');

    const result = {
        persona,
        mythos,
        capabilities: {}
    };

    // 1. Create AI Assistant (autonomous agent)
    if (includeAgent) {
        console.log('🤖 Creating autonomous AI assistant...');
        const assistant = await createInfluencerAssistant(persona, mythos);

        if (assistant.success) {
            // Create initial thread
            const threadId = await createThread(assistant.assistantId,
                `Hello! I am ${persona.name}. Let's start creating amazing content together.`
            );

            result.capabilities.agent = {
                assistantId: assistant.assistantId,
                threadId,
                status: 'active',
                canGenerateContent: true,
                canRespondToEngagement: true,
                canAnalyzePerformance: true,
                canPlanStrategy: true
            };

            console.log(`   ✅ Assistant ID: ${assistant.assistantId}`);
            console.log(`   ✅ Thread ID: ${threadId}`);
        } else {
            console.log(`   ⚠️  ${assistant.note || assistant.error}`);
            result.capabilities.agent = { status: 'unavailable' };
        }
    }

    // 2. Generate Images
    if (includeImages) {
        console.log('\n📸 Generating AI images...');
        const images = await generatePersonaImages(persona);

        if (images.profile_image) {
            result.capabilities.images = images;
            console.log('   ✅ Images generated');
        } else {
            console.log(`   ⚠️  ${images.note}`);
            result.capabilities.images = { status: 'unavailable' };
        }
    }

    // 3. Generate Voice
    if (includeVoice) {
        console.log('\n🎤 Generating voice signature...');
        const voice = await generateIntroVoice(persona, mythos);

        if (voice.success) {
            // Apply RAVE processing if enabled
            if (includeRAVE && voice.audio) {
                console.log('🎛️  Applying RAVE processing to voice...');
                const raveResult = await processVoiceWithRAVE(
                    voice.audio,
                    persona,
                    voice.path.replace('.mp3', '_rave.wav')
                );

                if (raveResult.success) {
                    voice.rave_enhanced = raveResult.output_path;
                    console.log('   ✅ RAVE enhancement applied');
                }
            }

            result.capabilities.voice = {
                introPath: voice.path,
                voiceId: voice.voiceId,
                settings: voice.settings,
                raveEnhanced: voice.rave_enhanced || null,
                canGeneratePostVoice: true,
                canCloneVoice: true
            };

            console.log('   ✅ Voice signature created');
        } else {
            console.log(`   ⚠️  ${voice.note || voice.error}`);
            result.capabilities.voice = { status: 'unavailable' };
        }
    }

    // 4. Generate Music
    if (includeMusic) {
        console.log('\n🎵 Generating signature music...');
        const musicTheme = mythos.tagline || `${persona.niche} anthem`;
        const genreMood = options.genreMood || 'electronic pop';

        const music = await generateSongAuto(persona, musicTheme, genreMood);

        if (music.success) {
            // Apply RAVE enhancement if enabled and audio is available
            if (includeRAVE && music.audio && !music.mock) {
                console.log('🎛️  Applying RAVE processing to music...');
                const outputDir = './output/music';
                const enhancedPath = `${outputDir}/${persona.handle}_${music.id}_enhanced.mp3`;

                const raveResult = await enhanceMusicWithRAVE(
                    `${outputDir}/${persona.handle}_${music.id}.mp3`,
                    persona,
                    enhancedPath
                );

                if (raveResult.success) {
                    music.rave_enhanced = raveResult.output_path;
                    console.log('   ✅ RAVE enhancement applied');
                }
            }

            result.capabilities.music = {
                title: music.title,
                audioUrl: music.audioUrl,
                lyrics: music.lyrics,
                genre: music.genre,
                raveEnhanced: music.rave_enhanced || null,
                mock: music.mock || false
            };

            console.log(`   ✅ Music generated: "${music.title}"`);
        } else {
            console.log('   ⚠️  Music generation unavailable');
            result.capabilities.music = { status: 'unavailable' };
        }
    }

    console.log('\n✨ Autonomous Influencer Created!\n');

    return result;
}

/**
 * Generate autonomous content using all available capabilities
 */
export async function generateAutonomousContent(influencer, prompt) {
    const { persona, capabilities } = influencer;

    console.log(`\n🎬 Generating autonomous content for ${persona.name}...`);

    const content = {
        timestamp: new Date().toISOString(),
        persona: persona.name
    };

    // 1. Use AI agent to generate content concept
    if (capabilities.agent?.status === 'active') {
        console.log('🤖 AI Agent generating content idea...');

        const agentResponse = await chatWithAgent(
            capabilities.agent.assistantId,
            capabilities.agent.threadId,
            `Generate a ${prompt} post that aligns with my personality and brand. Provide: concept, caption, and call-to-action.`
        );

        if (agentResponse.success) {
            content.text = agentResponse.content;
            console.log('   ✅ Content concept created');
        }
    }

    // 2. Generate voice for the content
    if (capabilities.voice?.canGeneratePostVoice && content.text) {
        console.log('🎤 Generating voice narration...');

        const voiceResult = await generatePostVoice(persona, { caption: content.text });

        if (voiceResult.success) {
            content.voicePath = voiceResult.path;
            console.log('   ✅ Voice narration created');
        }
    }

    // 3. Generate image if available
    if (capabilities.images && !capabilities.images.status) {
        content.suggestedImage = capabilities.images.sample_posts[
            Math.floor(Math.random() * capabilities.images.sample_posts.length)
        ];
    }

    console.log('\n✅ Autonomous content generated!\n');

    return content;
}

/**
 * Simulate autonomous posting cycle
 */
export async function runAutonomousCycle(influencer, cycleCount = 1) {
    console.log(`\n♾️  Running ${cycleCount} autonomous cycles...\n`);

    const cycles = [];

    for (let i = 0; i < cycleCount; i++) {
        console.log(`\n--- Cycle ${i + 1}/${cycleCount} ---`);

        // Generate content
        const content = await generateAutonomousContent(
            influencer,
            'engaging social media'
        );

        cycles.push({
            cycle: i + 1,
            content,
            timestamp: new Date().toISOString()
        });

        // Wait between cycles (if multiple)
        if (i < cycleCount - 1) {
            console.log('\nWaiting before next cycle...\n');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    return {
        influencer: influencer.persona.name,
        totalCycles: cycleCount,
        cycles,
        summary: {
            contentGenerated: cycles.length,
            voiceGenerated: cycles.filter(c => c.content.voicePath).length,
            agentActive: influencer.capabilities.agent?.status === 'active'
        }
    };
}

/**
 * Get influencer status and capabilities
 */
export function getInfluencerStatus(influencer) {
    const { persona, capabilities } = influencer;

    return {
        name: persona.name,
        handle: persona.handle,
        capabilities: {
            autonomousAgent: capabilities.agent?.status || 'unavailable',
            voiceGeneration: capabilities.voice?.canGeneratePostVoice ? 'active' : 'unavailable',
            musicGeneration: capabilities.music && !capabilities.music.status ? 'active' : 'unavailable',
            imageGeneration: capabilities.images && !capabilities.images.status ? 'active' : 'unavailable',
            raveProcessing: capabilities.voice?.raveEnhanced ? 'active' : 'inactive'
        },
        agentId: capabilities.agent?.assistantId || null,
        threadId: capabilities.agent?.threadId || null
    };
}

export default {
    createAutonomousInfluencer,
    generateAutonomousContent,
    runAutonomousCycle,
    getInfluencerStatus
};
