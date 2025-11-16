#!/usr/bin/env node

/**
 * Quick Start Examples - Copy and modify for your needs
 */

import { createInfluencer } from '../src/index.js';

// ============================================
// EXAMPLE 1: Basic Influencer Generation
// ============================================
console.log('📱 EXAMPLE 1: Basic Instagram Beauty Influencer\n');

const basicInfluencer = createInfluencer({
  vibe: 'soft dreamy pastel',
  niche: 'beauty',
  platforms: ['instagram']
});

console.log(JSON.stringify(basicInfluencer, null, 2));
console.log('\n' + '='.repeat(60) + '\n');


// ============================================
// EXAMPLE 2: Multi-Platform Fitness Influencer
// ============================================
console.log('💪 EXAMPLE 2: Multi-Platform Fitness Influencer\n');

const fitnessInfluencer = createInfluencer({
  vibe: 'edgy confident bold',
  niche: 'fitness',
  traits: 'motivational, no-nonsense, results-driven',
  platforms: ['tiktok', 'instagram', 'x']
});

console.log(JSON.stringify(fitnessInfluencer, null, 2));
console.log('\n' + '='.repeat(60) + '\n');


// ============================================
// EXAMPLE 3: With Music Generation
// ============================================
console.log('🎵 EXAMPLE 3: TikTok Creator with Custom Song\n');

const musicInfluencer = createInfluencer({
  vibe: 'vibrant energetic fun',
  niche: 'lifestyle',
  platforms: ['tiktok'],
  includeMusic: true,
  genreMood: 'upbeat pop electronic',
  postCount: 3
});

console.log(JSON.stringify(musicInfluencer, null, 2));
console.log('\n' + '='.repeat(60) + '\n');


// ============================================
// EXAMPLE 4: Premium Fashion Influencer
// ============================================
console.log('👗 EXAMPLE 4: Luxury Fashion Influencer for Instagram\n');

const fashionInfluencer = createInfluencer({
  vibe: 'luxury elegant sophisticated',
  niche: 'fashion',
  traits: 'refined, aspirational, chic',
  platforms: ['instagram'],
  imageDescription: 'High-end boutique setting, designer clothing, minimalist aesthetic',
  postCount: 4
});

console.log(JSON.stringify(fashionInfluencer, null, 2));
console.log('\n' + '='.repeat(60) + '\n');

// ============================================
// Usage Tips
// ============================================
console.log(`
✨ USAGE TIPS:

1. Customize by changing:
   - vibe: The overall aesthetic ('soft', 'edgy', 'luxury', 'vibrant', 'natural')
   - niche: Content focus ('beauty', 'fitness', 'fashion', 'lifestyle', 'food', 'travel')
   - traits: Additional personality descriptors
   - platforms: ['instagram', 'tiktok', 'x', 'onlyfans']

2. Platform-specific features:
   - Instagram: Polished captions, strategic hashtags
   - TikTok: Hook-first, trending music suggestions
   - X: Short and punchy, minimal hashtags
   - OnlyFans: Exclusive, premium positioning

3. Music generation:
   - Set includeMusic: true
   - Specify genreMood: 'hip-hop energetic', 'pop upbeat', 'lofi chill', etc.

4. To use programmatically:
   const result = createInfluencer({ vibe, niche, platforms });
   // Use result.persona and result.posts

5. For API integration:
   - See src/api-integrations.js
   - Add credentials in config/credentials.json
   - Use batchPost() function

Happy forging! 🔥
`);
