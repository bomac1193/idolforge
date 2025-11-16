#!/usr/bin/env node

/**
 * Interactive IdolForge Demo
 * Run: node demo.js
 */

import { createInfluencer } from './src/index.js';

console.log(`
╔════════════════════════════════════════╗
║        🎨 IDOLFORGE DEMO 🎨           ║
║   AI Influencer Generator             ║
╚════════════════════════════════════════╝
`);

const demos = [
  {
    title: '💅 Beauty Influencer (Instagram)',
    config: {
      vibe: 'soft dreamy pastel',
      niche: 'beauty',
      platforms: ['instagram'],
      postCount: 2
    }
  },
  {
    title: '💪 Fitness Influencer (TikTok + Music)',
    config: {
      vibe: 'edgy confident bold',
      niche: 'fitness',
      platforms: ['tiktok'],
      includeMusic: true,
      genreMood: 'hip-hop energetic',
      postCount: 2
    }
  },
  {
    title: '👗 Fashion Influencer (Multi-Platform)',
    config: {
      vibe: 'luxury elegant sophisticated',
      niche: 'fashion',
      platforms: ['instagram', 'x'],
      postCount: 2
    }
  }
];

// Run each demo
demos.forEach((demo, index) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${demo.title}`);
  console.log('='.repeat(60));
  console.log(`\n📋 Config: ${JSON.stringify(demo.config, null, 2)}\n`);

  const result = createInfluencer(demo.config);

  console.log('✨ RESULT:\n');
  console.log(JSON.stringify(result, null, 2));

  if (index < demos.length - 1) {
    console.log('\n\n⏭️  Next demo...\n');
  }
});

console.log(`\n
╔════════════════════════════════════════╗
║         ✅ Demo Complete!             ║
║                                        ║
║  Try your own:                         ║
║  node src/cli.js "vibe" "niche" "platform" ║
╚════════════════════════════════════════╝
`);
