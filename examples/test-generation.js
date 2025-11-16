/**
 * Test file demonstrating IdolForge usage
 */

import { createInfluencer } from '../src/index.js';

console.log('=== IdolForge Test Examples ===\n');

// Example 1: Random Generation
console.log('1. Random Generation:');
const example1 = createInfluencer({
  vibe: 'soft dreamy pastel',
  niche: 'beauty',
  traits: 'gentle, inspiring, minimalist',
  platforms: ['instagram', 'tiktok'],
  postCount: 3
});
console.log(JSON.stringify(example1, null, 2));
console.log('\n---\n');

// Example 2: From Photo Description
console.log('2. From Photo Description:');
const example2 = createInfluencer({
  vibe: 'edgy confident',
  niche: 'fitness',
  imageDescription: 'Athletic person in urban gym setting, dark tones, strong lighting',
  platforms: ['x', 'instagram'],
  postCount: 3
});
console.log(JSON.stringify(example2, null, 2));
console.log('\n---\n');

// Example 3: With Music
console.log('3. With Music Generation:');
const example3 = createInfluencer({
  vibe: 'vibrant energetic fun',
  niche: 'lifestyle',
  traits: 'playful, motivational',
  platforms: ['tiktok'],
  includeMusic: true,
  genreMood: 'upbeat pop electronic',
  postCount: 2
});
console.log(JSON.stringify(example3, null, 2));
