// Discord Bot for Autonomous Community Engagement
import { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } from 'discord.js';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType } from '@discordjs/voice';
import { chatWithAgent } from './autonomous-agent.js';
import { generateVoice } from './voice-generator.js';
import fs from 'fs';

let bot = null;
let activeInfluencers = new Map(); // Store persona data for each bot instance

/**
 * Create Discord bot for an influencer
 */
export async function createDiscordBot(persona, agentConfig) {
    const token = process.env.DISCORD_BOT_TOKEN;

    if (!token) {
        console.warn('⚠️  DISCORD_BOT_TOKEN not set - Discord integration disabled');
        return {
            success: false,
            error: 'Discord bot token not configured',
            note: 'Set DISCORD_BOT_TOKEN in .env'
        };
    }

    try {
        console.log(`🤖 Creating Discord bot for ${persona.name}...`);

        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.DirectMessages
            ]
        });

        // Store persona and agent info
        const botId = persona.handle;
        activeInfluencers.set(botId, {
            persona,
            agentId: agentConfig.assistantId,
            threadId: agentConfig.threadId,
            client
        });

        // Set up event handlers
        setupEventHandlers(client, persona, agentConfig);

        // Login
        await client.login(token);

        bot = client;

        console.log(`✅ Discord bot active for ${persona.name}`);

        return {
            success: true,
            botId,
            status: 'online'
        };

    } catch (error) {
        console.error('❌ Discord bot creation error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Set up Discord event handlers
 */
function setupEventHandlers(client, persona, agentConfig) {

    // Bot ready
    client.on('ready', () => {
        console.log(`✅ ${client.user.tag} is online!`);

        // Set bot status
        client.user.setPresence({
            activities: [{
                name: persona.mythos?.tagline || `${persona.niche} content`,
                type: 0 // Playing
            }],
            status: 'online'
        });
    });

    // Message handler
    client.on('messageCreate', async (message) => {
        // Ignore bot's own messages
        if (message.author.bot) return;

        // Check if bot is mentioned or DM
        const isMentioned = message.mentions.has(client.user);
        const isDM = message.channel.type === 1; // DM channel type

        if (isMentioned || isDM) {
            await handleMessage(message, persona, agentConfig);
        }

        // Respond to specific keywords
        const content = message.content.toLowerCase();
        if (content.includes('hello') || content.includes('hi')) {
            await handleGreeting(message, persona);
        }
    });

    // Member join
    client.on('guildMemberAdd', async (member) => {
        await handleNewMember(member, persona);
    });

    // Voice state update (for voice channel features)
    client.on('voiceStateUpdate', async (oldState, newState) => {
        await handleVoiceUpdate(oldState, newState, persona, agentConfig);
    });
}

/**
 * Handle incoming messages with AI agent
 */
async function handleMessage(message, persona, agentConfig) {
    try {
        // Show typing indicator
        await message.channel.sendTyping();

        // Get AI response
        const userMessage = message.content
            .replace(`<@${message.client.user.id}>`, '')
            .trim();

        const response = await chatWithAgent(
            agentConfig.assistantId,
            agentConfig.threadId,
            `A fan named ${message.author.username} says: "${userMessage}". Respond in character as ${persona.name}.`
        );

        if (response.success) {
            // Split long messages (Discord limit 2000 chars)
            const chunks = splitMessage(response.content, 2000);

            for (const chunk of chunks) {
                await message.reply(chunk);
            }
        } else {
            await message.reply(`Hey ${message.author.username}! I'm having trouble responding right now, but I appreciate you reaching out! 💜`);
        }

    } catch (error) {
        console.error('❌ Message handling error:', error.message);
    }
}

/**
 * Handle greetings
 */
async function handleGreeting(message, persona) {
    const greetings = [
        `Hey! ${persona.mythos?.tagline || 'Great to see you here!'}`,
        `What's up! I'm ${persona.name}, welcome to the community! 💜`,
        `Hey there! ${persona.bio}`
    ];

    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    await message.reply(greeting);
}

/**
 * Handle new member joins
 */
async function handleNewMember(member, persona) {
    // Find general/welcome channel
    const welcomeChannel = member.guild.channels.cache.find(
        ch => ch.name === 'welcome' || ch.name === 'general'
    );

    if (welcomeChannel) {
        const embed = new EmbedBuilder()
            .setColor(0x9d4edd)
            .setTitle(`Welcome ${member.user.username}! 👋`)
            .setDescription(`${persona.mythos?.tagline || ''}\n\nI'm ${persona.name}, glad you're here!`)
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter({ text: `${persona.handle}` });

        await welcomeChannel.send({ embeds: [embed] });
    }
}

/**
 * Handle voice channel updates
 */
async function handleVoiceUpdate(oldState, newState, persona, agentConfig) {
    // User joined a voice channel
    if (!oldState.channel && newState.channel) {
        // Bot could join and greet with voice (future feature)
        console.log(`${newState.member.user.username} joined voice channel`);
    }
}

/**
 * Join voice channel and speak
 */
export async function joinVoiceAndSpeak(channelId, text, persona) {
    try {
        const channel = bot.channels.cache.get(channelId);
        if (!channel || channel.type !== 2) { // 2 = Voice channel
            return { success: false, error: 'Invalid voice channel' };
        }

        // Generate voice audio
        const voiceResult = await generateVoice(persona, text);

        if (!voiceResult.success) {
            return { success: false, error: 'Voice generation failed' };
        }

        // Join voice channel
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });

        // Create audio player
        const player = createAudioPlayer();
        const resource = createAudioResource(voiceResult.audio, {
            inputType: StreamType.Arbitrary
        });

        // Play audio
        player.play(resource);
        connection.subscribe(player);

        // Leave after audio finishes
        player.on('idle', () => {
            connection.destroy();
        });

        return {
            success: true,
            message: 'Playing voice in channel'
        };

    } catch (error) {
        console.error('❌ Voice channel error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Post announcement in server
 */
export async function postAnnouncement(serverId, channelName, content) {
    try {
        const guild = bot.guilds.cache.get(serverId);
        if (!guild) {
            return { success: false, error: 'Server not found' };
        }

        const channel = guild.channels.cache.find(ch => ch.name === channelName);
        if (!channel) {
            return { success: false, error: 'Channel not found' };
        }

        const embed = new EmbedBuilder()
            .setColor(0x9d4edd)
            .setTitle(content.title || 'Announcement')
            .setDescription(content.message)
            .setTimestamp();

        if (content.image) {
            embed.setImage(content.image);
        }

        await channel.send({ embeds: [embed] });

        return { success: true };

    } catch (error) {
        console.error('❌ Announcement error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Create server roles for paid tiers
 */
export async function createPaidRoles(serverId, tiers) {
    try {
        const guild = bot.guilds.cache.get(serverId);
        if (!guild) {
            return { success: false, error: 'Server not found' };
        }

        const roles = [];

        for (const tier of tiers) {
            const role = await guild.roles.create({
                name: tier.name,
                color: tier.color || 0x9d4edd,
                permissions: tier.permissions || [],
                reason: `Paid tier: ${tier.name}`
            });

            roles.push({
                name: tier.name,
                id: role.id,
                tier: tier.price
            });
        }

        return {
            success: true,
            roles
        };

    } catch (error) {
        console.error('❌ Role creation error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Assign role to user (for paid memberships)
 */
export async function assignRole(serverId, userId, roleId) {
    try {
        const guild = bot.guilds.cache.get(serverId);
        if (!guild) {
            return { success: false, error: 'Server not found' };
        }

        const member = await guild.members.fetch(userId);
        const role = guild.roles.cache.get(roleId);

        if (!member || !role) {
            return { success: false, error: 'Member or role not found' };
        }

        await member.roles.add(role);

        return { success: true };

    } catch (error) {
        console.error('❌ Role assignment error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Get server statistics
 */
export async function getServerStats(serverId) {
    try {
        const guild = bot.guilds.cache.get(serverId);
        if (!guild) {
            return { success: false, error: 'Server not found' };
        }

        return {
            success: true,
            stats: {
                memberCount: guild.memberCount,
                channelCount: guild.channels.cache.size,
                roleCount: guild.roles.cache.size,
                boostLevel: guild.premiumTier,
                createdAt: guild.createdAt
            }
        };

    } catch (error) {
        console.error('❌ Stats error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Utility: Split long messages
 */
function splitMessage(text, maxLength = 2000) {
    const chunks = [];
    let current = '';

    const sentences = text.split('. ');

    for (const sentence of sentences) {
        if ((current + sentence).length > maxLength) {
            chunks.push(current);
            current = sentence + '. ';
        } else {
            current += sentence + '. ';
        }
    }

    if (current) {
        chunks.push(current);
    }

    return chunks;
}

/**
 * Stop Discord bot
 */
export async function stopBot(botId) {
    const influencer = activeInfluencers.get(botId);

    if (influencer) {
        await influencer.client.destroy();
        activeInfluencers.delete(botId);
        return { success: true };
    }

    return { success: false, error: 'Bot not found' };
}

export default {
    createDiscordBot,
    joinVoiceAndSpeak,
    postAnnouncement,
    createPaidRoles,
    assignRole,
    getServerStats,
    stopBot
};
