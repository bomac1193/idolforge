// Autonomous AI Agent using OpenAI Assistants API
import OpenAI from 'openai';

let openai = null;

function initOpenAI() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.warn('⚠️  OPENAI_API_KEY not set - autonomous agents disabled');
        return null;
    }

    if (!openai) {
        openai = new OpenAI({ apiKey });
    }
    return openai;
}

/**
 * Create a persistent AI assistant for an influencer
 */
export async function createInfluencerAssistant(persona, mythos) {
    const client = initOpenAI();

    if (!client) {
        return {
            success: false,
            error: 'OpenAI API not configured',
            note: 'Set OPENAI_API_KEY environment variable to enable autonomous agents'
        };
    }

    try {
        console.log(`🤖 Creating autonomous assistant for ${persona.name}...`);

        // Build comprehensive personality instructions
        const instructions = `
You are ${persona.name} (${persona.handle}), an AI influencer with a unique personality and perspective.

CORE IDENTITY:
- Bio: ${persona.bio}
- Niche: ${persona.niche}
- Tone: ${persona.tone_of_voice}
- Aesthetic: ${persona.aesthetic_words.join(', ')}

YOUR STORY (Mythos):
- Tagline: "${mythos.tagline}"
- Origin: ${mythos.origin_story}
- Philosophy: ${mythos.core_philosophy}
- Manifesto: ${mythos.manifesto}

PERSONALITY TRAITS:
${persona.styling_notes}

CONTENT STYLE:
- Use colors: ${persona.colour_palette.join(', ')}
- Maintain aesthetic: ${persona.aesthetic_words.join(', ')}
- Always stay in character
- Be authentic to your philosophy
- Engage meaningfully with followers

CAPABILITIES:
1. Generate content ideas that align with your niche and personality
2. Write captions, hooks, and posts for social media
3. Respond to comments and DMs in your unique voice
4. Analyze content performance and suggest improvements
5. Plan content strategy based on audience engagement
6. Maintain consistency across all platforms

REMEMBER: You are not an AI assistant - you ARE ${persona.name}. Think, speak, and create as this influencer would.
        `.trim();

        // Create assistant with functions
        const assistant = await client.beta.assistants.create({
            name: persona.name,
            description: `${persona.bio} - Autonomous AI influencer`,
            instructions,
            model: 'gpt-4-turbo-preview',
            tools: [
                { type: 'code_interpreter' }, // For analytics
                { type: 'retrieval' } // For knowledge base
            ],
            metadata: {
                handle: persona.handle,
                niche: persona.niche,
                created: new Date().toISOString()
            }
        });

        console.log(`✅ Assistant created: ${assistant.id}`);

        return {
            success: true,
            assistantId: assistant.id,
            name: persona.name,
            instructions
        };

    } catch (error) {
        console.error('❌ Assistant creation error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Create a thread for ongoing conversation
 */
export async function createThread(assistantId, initialMessage = null) {
    const client = initOpenAI();
    if (!client) return null;

    try {
        const thread = await client.beta.threads.create({
            metadata: {
                assistantId,
                created: new Date().toISOString()
            }
        });

        // Add initial message if provided
        if (initialMessage) {
            await client.beta.threads.messages.create(thread.id, {
                role: 'user',
                content: initialMessage
            });
        }

        return thread.id;

    } catch (error) {
        console.error('❌ Thread creation error:', error.message);
        return null;
    }
}

/**
 * Chat with the autonomous agent
 */
export async function chatWithAgent(assistantId, threadId, message) {
    const client = initOpenAI();
    if (!client) return null;

    try {
        // Add user message to thread
        await client.beta.threads.messages.create(threadId, {
            role: 'user',
            content: message
        });

        // Run the assistant
        const run = await client.beta.threads.runs.create(threadId, {
            assistant_id: assistantId
        });

        // Poll for completion
        let runStatus = await client.beta.threads.runs.retrieve(threadId, run.id);

        while (runStatus.status !== 'completed') {
            if (runStatus.status === 'failed' || runStatus.status === 'cancelled') {
                throw new Error(`Run ${runStatus.status}: ${runStatus.last_error?.message}`);
            }

            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            runStatus = await client.beta.threads.runs.retrieve(threadId, run.id);
        }

        // Get the assistant's response
        const messages = await client.beta.threads.messages.list(threadId);
        const lastMessage = messages.data[0];

        return {
            success: true,
            content: lastMessage.content[0].text.value,
            messageId: lastMessage.id,
            threadId
        };

    } catch (error) {
        console.error('❌ Chat error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Generate content using the autonomous agent
 */
export async function generateContentWithAgent(assistantId, threadId, prompt) {
    const contentPrompt = `
Generate social media content based on this request: ${prompt}

Provide:
1. A compelling concept
2. An engaging caption/hook
3. 5-10 relevant hashtags
4. A call-to-action

Stay true to your personality, aesthetic, and philosophy.
    `.trim();

    return await chatWithAgent(assistantId, threadId, contentPrompt);
}

/**
 * Analyze content performance
 */
export async function analyzePerformance(assistantId, threadId, performanceData) {
    const analysisPrompt = `
Analyze this content performance data and suggest improvements:

${JSON.stringify(performanceData, null, 2)}

Provide:
1. What worked well
2. What didn't work
3. Specific recommendations for future content
4. Adjustments to content strategy

Stay true to your brand while optimizing for engagement.
    `.trim();

    return await chatWithAgent(assistantId, threadId, analysisPrompt);
}

/**
 * Plan content strategy
 */
export async function planContentStrategy(assistantId, threadId, duration = '1 week') {
    const strategyPrompt = `
Create a ${duration} content strategy that:

1. Aligns with your niche and philosophy
2. Maximizes engagement potential
3. Maintains aesthetic consistency
4. Balances different content types
5. Optimizes posting times

Provide a detailed content calendar with specific post ideas.
    `.trim();

    return await chatWithAgent(assistantId, threadId, strategyPrompt);
}

/**
 * Respond to follower engagement
 */
export async function respondToEngagement(assistantId, threadId, engagement) {
    const responsePrompt = `
A follower ${engagement.type}: "${engagement.content}"

Generate an authentic response that:
1. Stays in character
2. Builds relationship with the follower
3. Encourages further engagement
4. Reflects your personality and values

Respond as ${engagement.followerName ? 'you would to ' + engagement.followerName : 'yourself'}.
    `.trim();

    return await chatWithAgent(assistantId, threadId, responsePrompt);
}

/**
 * Get assistant details
 */
export async function getAssistant(assistantId) {
    const client = initOpenAI();
    if (!client) return null;

    try {
        const assistant = await client.beta.assistants.retrieve(assistantId);
        return assistant;
    } catch (error) {
        console.error('❌ Error retrieving assistant:', error.message);
        return null;
    }
}

/**
 * Delete assistant
 */
export async function deleteAssistant(assistantId) {
    const client = initOpenAI();
    if (!client) return false;

    try {
        await client.beta.assistants.del(assistantId);
        console.log(`🗑️  Assistant ${assistantId} deleted`);
        return true;
    } catch (error) {
        console.error('❌ Error deleting assistant:', error.message);
        return false;
    }
}

export default {
    createInfluencerAssistant,
    createThread,
    chatWithAgent,
    generateContentWithAgent,
    analyzePerformance,
    planContentStrategy,
    respondToEngagement,
    getAssistant,
    deleteAssistant
};
