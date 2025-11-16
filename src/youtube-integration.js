// YouTube Integration for Video Upload and Channel Management
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const youtube = google.youtube('v3');
let oauth2Client = null;

/**
 * Initialize YouTube OAuth2 client
 */
function initYouTube() {
    const clientId = process.env.YOUTUBE_CLIENT_ID;
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
    const redirectUri = process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3000/oauth2callback';

    if (!clientId || !clientSecret) {
        console.warn('⚠️  YouTube credentials not set - upload disabled');
        return null;
    }

    if (!oauth2Client) {
        oauth2Client = new google.auth.OAuth2(
            clientId,
            clientSecret,
            redirectUri
        );

        // Load saved tokens if available
        const tokenPath = './config/youtube-tokens.json';
        if (fs.existsSync(tokenPath)) {
            const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
            oauth2Client.setCredentials(tokens);
        }
    }

    return oauth2Client;
}

/**
 * Generate OAuth URL for user authorization
 */
export function getAuthUrl() {
    const auth = initYouTube();
    if (!auth) return null;

    const scopes = [
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.force-ssl'
    ];

    return auth.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
}

/**
 * Exchange authorization code for tokens
 */
export async function authorizeWithCode(code) {
    const auth = initYouTube();
    if (!auth) return null;

    try {
        const { tokens } = await auth.getToken(code);
        auth.setCredentials(tokens);

        // Save tokens
        const tokenPath = './config/youtube-tokens.json';
        fs.mkdirSync(path.dirname(tokenPath), { recursive: true });
        fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));

        return {
            success: true,
            tokens
        };
    } catch (error) {
        console.error('❌ YouTube authorization error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Generate video metadata from persona
 */
function generateVideoMetadata(persona, content, options = {}) {
    const {
        title,
        description,
        tags,
        category = '22', // People & Blogs
        privacyStatus = 'public'
    } = options;

    // Auto-generate if not provided
    const autoTitle = title || `${content.concept || 'New Video'} | ${persona.name}`;
    const autoDescription = description || `
${content.caption || content.concept || ''}

${persona.bio}

Follow ${persona.name}:
${persona.handle}

${persona.mythos?.tagline || ''}

#${persona.niche} #content #influencer
    `.trim();

    const autoTags = tags || [
        persona.niche,
        persona.name.replace(/\s+/g, ''),
        ...persona.aesthetic_words,
        'influencer',
        'content'
    ];

    return {
        snippet: {
            title: autoTitle.substring(0, 100), // YouTube limit
            description: autoDescription.substring(0, 5000), // YouTube limit
            tags: autoTags.slice(0, 30), // YouTube limit
            categoryId: category,
            defaultLanguage: 'en',
            defaultAudioLanguage: 'en'
        },
        status: {
            privacyStatus,
            selfDeclaredMadeForKids: false
        }
    };
}

/**
 * Upload video to YouTube
 */
export async function uploadVideo(videoPath, persona, content, options = {}) {
    const auth = initYouTube();

    if (!auth) {
        return {
            success: false,
            error: 'YouTube not configured',
            note: 'Set YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET'
        };
    }

    try {
        console.log(`📹 Uploading video to YouTube for ${persona.name}...`);

        const metadata = generateVideoMetadata(persona, content, options);

        const response = await youtube.videos.insert({
            auth,
            part: ['snippet', 'status'],
            requestBody: metadata,
            media: {
                body: fs.createReadStream(videoPath)
            }
        });

        console.log(`✅ Video uploaded: ${response.data.id}`);

        return {
            success: true,
            videoId: response.data.id,
            url: `https://www.youtube.com/watch?v=${response.data.id}`,
            title: response.data.snippet.title,
            publishedAt: response.data.snippet.publishedAt
        };

    } catch (error) {
        console.error('❌ YouTube upload error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Upload YouTube Short (vertical video)
 */
export async function uploadShort(videoPath, persona, content, options = {}) {
    // Shorts are regular videos with #Shorts in title/description
    const shortOptions = {
        ...options,
        title: (options.title || content.concept) + ' #Shorts',
        description: (options.description || content.caption || '') + '\n\n#Shorts'
    };

    return await uploadVideo(videoPath, persona, content, shortOptions);
}

/**
 * Create YouTube playlist
 */
export async function createPlaylist(persona, playlistTitle, description = '') {
    const auth = initYouTube();
    if (!auth) return null;

    try {
        const response = await youtube.playlists.insert({
            auth,
            part: ['snippet', 'status'],
            requestBody: {
                snippet: {
                    title: playlistTitle,
                    description: description || `Content by ${persona.name}`,
                },
                status: {
                    privacyStatus: 'public'
                }
            }
        });

        return {
            success: true,
            playlistId: response.data.id,
            url: `https://www.youtube.com/playlist?list=${response.data.id}`
        };

    } catch (error) {
        console.error('❌ Playlist creation error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Add video to playlist
 */
export async function addToPlaylist(videoId, playlistId) {
    const auth = initYouTube();
    if (!auth) return null;

    try {
        await youtube.playlistItems.insert({
            auth,
            part: ['snippet'],
            requestBody: {
                snippet: {
                    playlistId,
                    resourceId: {
                        kind: 'youtube#video',
                        videoId
                    }
                }
            }
        });

        return { success: true };

    } catch (error) {
        console.error('❌ Add to playlist error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Get channel information
 */
export async function getChannelInfo() {
    const auth = initYouTube();
    if (!auth) return null;

    try {
        const response = await youtube.channels.list({
            auth,
            part: ['snippet', 'statistics', 'contentDetails'],
            mine: true
        });

        const channel = response.data.items[0];

        return {
            success: true,
            channelId: channel.id,
            title: channel.snippet.title,
            description: channel.snippet.description,
            subscriberCount: channel.statistics.subscriberCount,
            viewCount: channel.statistics.viewCount,
            videoCount: channel.statistics.videoCount
        };

    } catch (error) {
        console.error('❌ Channel info error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Get video analytics
 */
export async function getVideoAnalytics(videoId) {
    const auth = initYouTube();
    if (!auth) return null;

    try {
        const response = await youtube.videos.list({
            auth,
            part: ['statistics', 'snippet'],
            id: [videoId]
        });

        const video = response.data.items[0];

        return {
            success: true,
            videoId,
            title: video.snippet.title,
            views: video.statistics.viewCount,
            likes: video.statistics.likeCount,
            comments: video.statistics.commentCount,
            publishedAt: video.snippet.publishedAt
        };

    } catch (error) {
        console.error('❌ Video analytics error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Generate video from content (creates placeholder for now)
 */
export async function generateVideoContent(persona, content, options = {}) {
    // This is a placeholder - in production, integrate with video generation API
    // For now, create metadata for video that will be uploaded

    console.log('📹 Generating video content...');

    const videoMetadata = {
        title: content.concept || 'New Video',
        script: content.caption || content.text,
        voiceover: content.voicePath || null,
        visuals: content.images || [],
        music: content.music || null,
        format: options.format || 'landscape', // landscape, portrait (Shorts), square
        duration: options.duration || 60
    };

    // TODO: Integrate with video generation API (Runway, Pika, etc.)
    // For now, return metadata for manual video creation

    return {
        success: true,
        metadata: videoMetadata,
        note: 'Video generation API integration coming soon. Upload pre-made video manually for now.'
    };
}

export default {
    getAuthUrl,
    authorizeWithCode,
    uploadVideo,
    uploadShort,
    createPlaylist,
    addToPlaylist,
    getChannelInfo,
    getVideoAnalytics,
    generateVideoContent
};
