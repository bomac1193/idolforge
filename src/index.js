/**
 * IdolForge - AI Influencer Generator
 * Main entry point
 */

import { generatePersona } from './persona-generator.js';
import { generatePosts } from './post-generator.js';
import { generateSong } from './music-generator.js';
import { generateMythos } from './mythos-generator.js';
import { generatePersonaImages, generateMockImages } from './image-generator.js';

export async function createInfluencer(input) {
  const {
    vibe,
    niche,
    traits = '',
    platforms = ['instagram', 'tiktok', 'x'],
    imageDescription = null,
    includeMusic = false,
    includeMythos = true,
    includeImages = true,
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

  // Add mythos/backstory
  if (includeMythos) {
    output.mythos = generateMythos(persona);
  }

  // Add images
  if (includeImages) {
    try {
      // Try real image generation, fall back to mock images
      output.images = await generatePersonaImages(persona);
    } catch (error) {
      console.log('Using mock images:', error.message);
      output.images = generateMockImages(persona);
    }
  }

  // Add music if requested
  if (includeMusic) {
    output.music = generateSong(persona, genreMood);
  }

  return output;
}

export { generatePersona, generatePosts, generateSong, generateMythos, generatePersonaImages };
