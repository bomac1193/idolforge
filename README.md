# IdolForge

**AI Influencer Generator** - Create complete influencer personas with platform-optimized content.

## Overview

IdolForge takes a short vibe description and generates a complete influencer profile including:
- Detailed persona (name, handle, bio, aesthetic, tone)
- Platform-specific posts (X, TikTok, Instagram, OnlyFans)
- Optional custom songs/music
- Visual concepts and styling notes

## Installation

```bash
cd idolforge
npm install
```

## Quick Start

### 🌐 Web Interface (Recommended)

```bash
cd /home/sphinxy/idolforge
npm install
npm start
```

Then open your browser to: **http://localhost:3000**

Features:
- ✨ Beautiful web UI with form inputs
- 🎨 Real-time JSON output display
- 📋 One-click copy to clipboard
- 🚀 Quick example presets
- 📱 Responsive design

See [WEB-GUIDE.md](WEB-GUIDE.md) for full web interface documentation.

### CLI Usage

```bash
# Basic generation
node src/cli.js "soft dreamy" "beauty" "instagram,tiktok"

# With music
node src/cli.js "edgy confident" "fitness" "x,instagram" --music --genre="hip-hop energetic"

# Custom post count
node src/cli.js "luxury elegant" "fashion" "instagram" --posts=10
```

### Code Usage

```javascript
import { createInfluencer } from './src/index.js';

const influencer = createInfluencer({
  vibe: 'soft dreamy pastel',
  niche: 'beauty',
  traits: 'gentle, inspiring, minimalist',
  platforms: ['instagram', 'tiktok'],
  includeMusic: false,
  postCount: 5
});

console.log(JSON.stringify(influencer, null, 2));
```

## Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `vibe` | string | Yes | Aesthetic vibe (e.g., "soft dreamy", "edgy bold") |
| `niche` | string | Yes | Content niche (e.g., "beauty", "fitness", "fashion") |
| `traits` | string | No | Additional personality traits |
| `platforms` | array | No | Target platforms (default: ["instagram", "tiktok", "x"]) |
| `imageDescription` | string | No | Description of reference image |
| `includeMusic` | boolean | No | Generate custom song (default: false) |
| `genreMood` | string | No | Music genre/mood (default: "pop upbeat") |
| `postCount` | number | No | Number of posts per platform (default: 5) |

## Output Structure

```json
{
  "persona": {
    "name": "Luna Rose",
    "handle": "@lunarose",
    "bio": "Beauty enthusiast ✨ | soft dreamy vibes only | Building my dream life",
    "niche": "beauty",
    "tone_of_voice": "fun, casual, uses emojis, conversational",
    "style": "soft with playful energy",
    "aesthetic_words": ["ethereal", "dreamy", "gentle", "pastel", "whimsical"],
    "colour_palette": ["#FFE4E1", "#E6E6FA", "#F0E68C", "#FFF5EE", "#F5F5DC"],
    "styling_notes": "Soft lighting, muted tones, flowing fabrics, gentle expressions"
  },
  "posts": [
    {
      "platform": "instagram",
      "concept": "Skincare routine reveal",
      "visual_idea": "ethereal setting with #FFE4E1 accent colors...",
      "hook": "Save this for later",
      "caption": "Save this for later ✨\n\nSkincare routine reveal...",
      "hashtags": ["#BeautyTips", "#Skincare", "#GlowUp"],
      "alt_text": "Luna Rose - Skincare routine reveal..."
    }
  ],
  "music": {
    "title": "Glow Up",
    "concept": "fun anthem about beauty journey and self-empowerment",
    "hook_lyrics": "Watch me glow, watch me shine...",
    "verse_lyrics": "They told me I should change..."
  }
}
```

## Minimal User Prompt Templates

### A. Random Generation
```
Vibe: soft dreamy
Niche: beauty
Traits: gentle, inspiring
Platforms: instagram, tiktok

Create an influencer.
```

### B. From Photo Description
```
Image description: Athletic person in urban gym, dark tones
Vibe notes: edgy confident
Platforms: x, instagram

Create an influencer.
```

### C. With Music
```
Vibe: vibrant energetic
Niche: lifestyle
Platforms: tiktok

Include the music block. Genre/mood: upbeat pop.
```

## Platform Support

### ✅ Supported with API
- **TikTok** - Content Posting API
- **Instagram** - Graph API (Content Publishing)
- **X (Twitter)** - API v2

### ⚠️ Manual Upload Required
- **OnlyFans** - No official API available

## API Integration

### Setup Credentials

1. Copy the example credentials file:
```bash
cp config/credentials.example.json config/credentials.json
```

2. Add your API credentials for each platform

3. Use the API integration:
```javascript
import { batchPost } from './src/api-integrations.js';

const credentials = {
  tiktok: { accessToken: 'YOUR_TOKEN' },
  instagram: { accessToken: 'YOUR_TOKEN', igUserId: 'YOUR_ID' },
  x: { bearerToken: 'YOUR_TOKEN' }
};

const results = await batchPost(influencer.posts, credentials);
```

### API Documentation Links

- [TikTok Content Posting API](https://developers.tiktok.com/doc/content-posting-api-get-started)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api/guides/content-publishing)
- [X API v2](https://developer.twitter.com/en/docs/twitter-api/tweets/manage-tweets/api-reference/post-tweets)

## Content Rules

✅ **DO:**
- Keep content PG-13 and platform-safe
- Match persona's aesthetic and tone
- Use platform-specific best practices
- Create engaging, authentic content

❌ **DON'T:**
- Include explicit or unsafe content
- Use copyrighted material without permission
- Ignore platform guidelines
- Create misleading information

## Platform-Specific Guidelines

### X (Twitter)
- Short, punchy captions (280 chars max)
- Minimal hashtags
- Hook-first approach

### TikTok
- Trending music suggestions
- Hook within first 3 seconds
- Viral hashtags (#fyp, #viral)
- Engaging visual concepts

### Instagram
- Polished, aesthetic visuals
- Storytelling captions
- Strategic hashtags (8-12)
- Call-to-action focused

### OnlyFans
- Exclusive, premium positioning
- Direct, personal tone
- VIP-focused messaging

## Examples

Run the test file to see all examples:

```bash
npm test
```

Or check `examples/templates.json` for more templates.

## Project Structure

```
idolforge/
├── src/
│   ├── index.js              # Main entry point
│   ├── persona-generator.js  # Persona creation logic
│   ├── post-generator.js     # Platform-specific posts
│   ├── music-generator.js    # Song/music generation
│   ├── api-integrations.js   # Platform API handlers
│   └── cli.js                # Command-line interface
├── examples/
│   ├── test-generation.js    # Usage examples
│   └── templates.json        # Prompt templates
├── config/
│   └── credentials.example.json
├── package.json
└── README.md
```

## License

MIT

## Contributing

Contributions welcome! Please ensure all content remains platform-safe and follows the guidelines.

## Support

For issues or questions, please open an issue on the repository.

---

**IdolForge** - Turn vibes into influence ✨
