# YouTube & Discord Integration Guide

Complete guide for setting up YouTube video uploads and Discord autonomous community management.

---

## 📹 YouTube Integration

### What It Does
- Upload videos and Shorts automatically
- Generate optimized metadata (titles, descriptions, tags)
- Create and manage playlists
- Track video analytics
- Manage channel presence

### Setup Instructions

#### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "IdolForge YouTube"
3. Enable **YouTube Data API v3**

#### 2. Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Add authorized redirect URI: `http://localhost:3000/oauth2callback`
5. Save **Client ID** and **Client Secret**

#### 3. Configure Environment
```bash
# Add to .env file
YOUTUBE_CLIENT_ID=your_client_id_here
YOUTUBE_CLIENT_SECRET=your_client_secret_here
YOUTUBE_REDIRECT_URI=http://localhost:3000/oauth2callback
```

#### 4. Authorize Your Channel
```javascript
import { getAuthUrl, authorizeWithCode } from './src/youtube-integration.js';

// Step 1: Get authorization URL
const authUrl = getAuthUrl();
console.log('Visit this URL to authorize:', authUrl);

// Step 2: After user authorizes, exchange code for tokens
const result = await authorizeWithCode(codeFromCallback);
// Tokens are saved automatically
```

### Usage Examples

#### Upload Video
```javascript
import { uploadVideo } from './src/youtube-integration.js';

const result = await uploadVideo(
  './video.mp4',
  persona,
  content,
  {
    title: 'My First AI Generated Video',
    description: 'Created with IdolForge',
    tags: ['AI', 'influencer', 'content'],
    privacyStatus: 'public' // or 'unlisted', 'private'
  }
);

console.log('Video URL:', result.url);
// https://www.youtube.com/watch?v=VIDEO_ID
```

#### Upload YouTube Short
```javascript
import { uploadShort } from './src/youtube-integration.js';

// Automatically adds #Shorts hashtag
const result = await uploadShort(
  './vertical-video.mp4',
  persona,
  content
);
```

#### Create Playlist
```javascript
import { createPlaylist, addToPlaylist } from './src/youtube-integration.js';

const playlist = await createPlaylist(
  persona,
  'Fitness Motivation Series',
  'Weekly motivation videos'
);

await addToPlaylist(videoId, playlist.playlistId);
```

#### Get Analytics
```javascript
import { getVideoAnalytics, getChannelInfo } from './src/youtube-integration.js';

// Video stats
const stats = await getVideoAnalytics('VIDEO_ID');
console.log(`Views: ${stats.views}, Likes: ${stats.likes}`);

// Channel stats
const channel = await getChannelInfo();
console.log(`Subscribers: ${channel.subscriberCount}`);
```

### Auto-Generated Metadata

YouTube integration automatically creates SEO-optimized metadata:

**Title**: `{Content Concept} | {Persona Name}`
**Description**: Includes bio, tagline, and relevant hashtags
**Tags**: Niche, aesthetic words, persona name

Can be overridden with custom options.

---

## 🤖 Discord Bot Integration

### What It Does
- **Autonomous engagement**: Responds to messages 24/7 in character
- **Voice channel integration**: Speaks with ElevenLabs voice
- **Community management**: Welcome messages, announcements
- **Paid tier system**: Role-based access control
- **DM responses**: Personal interactions at scale

### Setup Instructions

#### 1. Create Discord Application
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **New Application**
3. Name it after your influencer
4. Go to **Bot** section → **Add Bot**

#### 2. Configure Bot Permissions
Enable these **Privileged Gateway Intents**:
- ✅ Presence Intent
- ✅ Server Members Intent
- ✅ Message Content Intent

Required **Bot Permissions**:
- Read Messages/View Channels
- Send Messages
- Manage Messages
- Embed Links
- Attach Files
- Read Message History
- Use Voice Activity
- Connect (voice)
- Speak (voice)

#### 3. Get Bot Token
1. In **Bot** section, click **Reset Token**
2. Copy the token (you won't see it again!)
3. Add to `.env`:

```bash
DISCORD_BOT_TOKEN=your_bot_token_here
```

#### 4. Invite Bot to Server
1. Go to **OAuth2** → **URL Generator**
2. Select scopes: `bot`, `applications.commands`
3. Select permissions (from step 2)
4. Copy generated URL and visit it
5. Select your server and authorize

### Usage Examples

#### Start Autonomous Bot
```javascript
import { createDiscordBot } from './src/discord-bot.js';

const bot = await createDiscordBot(persona, {
  assistantId: 'asst_xxx', // OpenAI Assistant ID
  threadId: 'thread_xxx'   // Conversation thread
});

// Bot is now online and will:
// - Respond to @mentions
// - Answer DMs
// - Welcome new members
// - Engage with community
```

#### Post Announcement
```javascript
import { postAnnouncement } from './src/discord-bot.js';

await postAnnouncement(
  'SERVER_ID',
  'announcements',
  {
    title: 'New Content Drop! 🎉',
    message: 'Check out my latest video...',
    image: 'https://...'
  }
);
```

#### Voice Channel Integration
```javascript
import { joinVoiceAndSpeak } from './src/discord-bot.js';

// Bot joins voice channel and speaks
await joinVoiceAndSpeak(
  'VOICE_CHANNEL_ID',
  'Hey everyone! Thanks for joining the call!',
  persona
);
// Uses ElevenLabs to generate voice on-the-fly
```

#### Create Paid Tiers
```javascript
import { createPaidRoles } from './src/discord-bot.js';

const roles = await createPaidRoles('SERVER_ID', [
  {
    name: 'Bronze Supporter',
    price: 5,
    color: 0xCD7F32
  },
  {
    name: 'Silver Supporter',
    price: 10,
    color: 0xC0C0C0
  },
  {
    name: 'Gold Supporter',
    price: 25,
    color: 0xFFD700
  }
]);
```

#### Assign Paid Role
```javascript
import { assignRole } from './src/discord-bot.js';

// When user subscribes to Patreon/OnlyFans
await assignRole(
  'SERVER_ID',
  'USER_ID',
  roles[0].id // Bronze role
);
```

#### Get Server Stats
```javascript
import { getServerStats } from './src/discord-bot.js';

const stats = await getServerStats('SERVER_ID');
console.log(`Members: ${stats.memberCount}`);
console.log(`Channels: ${stats.channelCount}`);
```

### Bot Features

#### Automatic Responses
The bot automatically responds to:
- @mentions
- Direct messages
- "hello" / "hi" greetings
- Custom keywords (configurable)

All responses use the OpenAI Assistant to stay in character!

#### Welcome Messages
New members get personalized welcome with:
- Influencer's tagline
- Branded embed (violet theme)
- Community guidelines link

#### Voice Capabilities
- Join voice channels
- Speak with ElevenLabs-generated voice
- Leave after speaking
- Future: Hold live Q&A sessions!

---

## 🎯 Complete Workflow Example

### Autonomous YouTube + Discord Influencer

```javascript
import { createAutonomousInfluencer } from './src/orchestrator.js';
import { uploadVideo } from './src/youtube-integration.js';
import { createDiscordBot, postAnnouncement } from './src/discord-bot.js';

// 1. Create autonomous influencer
const influencer = await createAutonomousInfluencer(persona, mythos, {
  includeVoice: true,
  includeAgent: true,
  includeImages: true
});

// 2. Generate video content
const content = await generateAutonomousContent(
  influencer,
  'fitness motivation video'
);

// 3. Upload to YouTube
const video = await uploadVideo(
  content.videoPath,
  persona,
  content
);

// 4. Announce on Discord
await postAnnouncement(serverId, 'announcements', {
  title: 'New Video! 🎬',
  message: `Just dropped a new video: ${content.title}\n\nWatch here: ${video.url}`,
  image: video.thumbnail
});

// 5. Bot engages with comments automatically
// (runs continuously in background)
```

---

## 💰 Monetization Strategy

### YouTube Revenue
- **AdSense**: $3-5 per 1000 views
- **Memberships**: $5-20/month per member
- **Super Thanks**: One-time tips
- **Sponsorships**: $500-5000+ per video

### Discord Revenue
- **Paid server access**: $5-10/month
- **Tiered roles**: $5 (basic) → $25 (premium)
- **Exclusive content**: Behind-the-scenes, early access
- **Direct support**: 1-on-1 coaching/advice

### Combined Strategy
```
Free Content (YouTube) → Build Audience
    ↓
Community (Discord) → Engagement & Relationships
    ↓
Paid Tiers (Discord Roles) → Recurring Revenue
    ↓
Premium Content (Patreon/OnlyFans) → High-Value Supporters
```

---

## 🔧 Advanced Features

### YouTube Automation
- Schedule uploads at optimal times
- A/B test thumbnails
- Auto-generate Shorts from long videos
- Cross-promote with community posts

### Discord Automation
- Auto-moderate chat
- Scheduled announcements
- Birthday messages for members
- Activity-based role assignments
- Voice event hosting

### Integration Benefits
- YouTube notification → Discord announcement
- Discord poll → YouTube video topic
- Exclusive Discord previews before YouTube release
- YouTube premiere → Discord watch party

---

## 📊 Analytics & Optimization

### YouTube Metrics
- Views, watch time, CTR
- Audience retention graphs
- Traffic sources
- Subscriber growth

### Discord Metrics
- Active members
- Message frequency
- Voice channel usage
- Paid tier conversion rate

### AI Optimization
The autonomous agent analyzes both platforms and:
- Determines best posting times
- Identifies viral content patterns
- Optimizes titles and thumbnails
- Suggests content topics
- Adjusts engagement strategy

---

## 🆘 Troubleshooting

### YouTube Issues

**"Unauthorized" error**
```bash
# Re-authorize your channel
const authUrl = getAuthUrl();
# Visit URL and complete OAuth flow again
```

**"Quota exceeded"**
- YouTube API has daily quotas
- Default: 10,000 units/day
- Video upload: 1,600 units
- Can upload ~6 videos per day
- Request quota increase from Google

**"Invalid video file"**
- Supported formats: .mp4, .mov, .avi, .wmv
- Max size: 256GB or 12 hours
- Recommended: H.264 codec, MP4 container

### Discord Issues

**Bot doesn't respond**
- Check Privileged Intents are enabled
- Verify bot has "Read Messages" permission
- Ensure Message Content Intent is on

**Voice not working**
- Install ffmpeg: `npm install ffmpeg-static`
- Check bot has "Connect" and "Speak" permissions
- Verify ElevenLabs API key is set

**Bot offline**
- Check `DISCORD_BOT_TOKEN` is valid
- Bot token may have been reset
- Verify bot is invited to server

---

## 🚀 Next Steps

1. **Set up YouTube OAuth** → Enable video uploads
2. **Create Discord bot** → Start community engagement
3. **Generate first video** → Test the workflow
4. **Launch Discord server** → Build your community
5. **Go autonomous** → Let AI handle daily operations

**Your influencer can now reach millions on YouTube and build deep relationships on Discord - all autonomously! 🎬🤖**
