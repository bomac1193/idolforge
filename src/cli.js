#!/usr/bin/env node

/**
 * IdolForge CLI
 * Command-line interface for generating influencers
 */

import { createInfluencer } from './index.js';

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
IdolForge - AI Influencer Generator

Usage:
  node src/cli.js <vibe> <niche> [platforms] [--music] [--genre=<genre>]

Examples:
  node src/cli.js "soft dreamy" "beauty" "instagram,tiktok"
  node src/cli.js "edgy confident" "fitness" "x,instagram" --music --genre="hip-hop energetic"
  node src/cli.js "luxury elegant" "fashion" "instagram,onlyfans"

Options:
  --music         Include song generation
  --genre=<mood>  Specify music genre/mood
  --posts=<n>     Number of posts to generate (default: 5)
  `);
  process.exit(0);
}

const vibe = args[0];
const niche = args[1] || 'lifestyle';
const platforms = args[2] ? args[2].split(',') : ['instagram', 'tiktok', 'x'];

const includeMusic = args.includes('--music');
const genreMood = args.find(a => a.startsWith('--genre='))?.split('=')[1] || 'pop upbeat';
const postCount = parseInt(args.find(a => a.startsWith('--posts='))?.split('=')[1] || '5');

const input = {
  vibe,
  niche,
  platforms,
  includeMusic,
  genreMood,
  postCount
};

const result = createInfluencer(input);

console.log(JSON.stringify(result, null, 2));
