/**
 * IdolForge - AI Influencer Generator
 * Main entry point
 */

import { generatePersona } from './persona-generator.js';
import { generatePosts } from './post-generator.js';
import { generateSong } from './music-generator.js';

export function createInfluencer(input) {
  const {
    vibe,
    niche,
    traits = '',
    platforms = ['instagram', 'tiktok', 'x'],
    imageDescription = null,
    includeMusic = false,
    genreMood = 'pop upbeat',
    postCount = 5
  } = input;

  // Generate persona
  const persona = generatePersona({
    vibe,
    niche,
    traits,
    imageDescription
  });

  // Generate posts
  const posts = generatePosts(persona, platforms, postCount);

  // Build output
  const output = {
    persona,
    posts
  };

  // Add music if requested
  if (includeMusic) {
    output.music = generateSong(persona, genreMood);
  }

  return output;
}

export { generatePersona, generatePosts, generateSong };
