/**
 * AI Image Generation using Replicate
 * Generates profile pictures and content images
 */

import Replicate from 'replicate';

// Initialize Replicate (will use REPLICATE_API_TOKEN from env)
let replicate = null;

function initReplicate() {
  if (!replicate && process.env.REPLICATE_API_TOKEN) {
    replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
  }
  return replicate;
}

export async function generatePersonaImages(persona) {
  const client = initReplicate();

  if (!client) {
    console.log('⚠️  Replicate API token not set - skipping image generation');
    return {
      profile_image: null,
      cover_image: null,
      sample_posts: [],
      note: 'Set REPLICATE_API_TOKEN environment variable to enable image generation'
    };
  }

  try {
    console.log('🎨 Generating images for', persona.name);

    // Generate profile picture
    const profilePrompt = createProfilePrompt(persona);
    const profileImage = await generateImage(client, profilePrompt, '1:1');

    // Generate cover/banner image
    const coverPrompt = createCoverPrompt(persona);
    const coverImage = await generateImage(client, coverPrompt, '16:9');

    // Generate sample post images (just 2 for demo)
    const postImages = await Promise.all([
      generateImage(client, createPostPrompt(persona, 0), '4:5'),
      generateImage(client, createPostPrompt(persona, 1), '9:16')
    ]);

    return {
      profile_image: profileImage,
      cover_image: coverImage,
      sample_posts: postImages,
      model: 'black-forest-labs/flux-schnell'
    };

  } catch (error) {
    console.error('Image generation error:', error.message);
    return {
      error: error.message,
      profile_image: null,
      cover_image: null,
      sample_posts: []
    };
  }
}

async function generateImage(client, prompt, aspectRatio = '1:1') {
  try {
    const output = await client.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: prompt,
          aspect_ratio: aspectRatio,
          output_format: "webp",
          output_quality: 90
        }
      }
    );

    // Flux-schnell returns an array with one URL
    return Array.isArray(output) ? output[0] : output;

  } catch (error) {
    console.error('Failed to generate image:', error.message);
    return null;
  }
}

function createProfilePrompt(persona) {
  const { aesthetic_words, styling_notes, niche } = persona;

  return `Professional portrait photograph of a ${niche} influencer, ` +
         `${aesthetic_words.slice(0, 3).join(', ')} aesthetic, ` +
         `${styling_notes}, ` +
         `high quality, professional photography, centered composition, ` +
         `clean background, perfect lighting, magazine quality`;
}

function createCoverPrompt(persona) {
  const { aesthetic_words, colour_palette, niche } = persona;

  return `Cinematic banner image for ${niche} influencer, ` +
         `${aesthetic_words.join(', ')} aesthetic, ` +
         `color palette: ${colour_palette.slice(0, 3).join(', ')}, ` +
         `wide composition, dramatic lighting, professional photography, ` +
         `lifestyle photography, aspirational, high-end`;
}

function createPostPrompt(persona, index) {
  const { niche, aesthetic_words, styling_notes } = persona;

  const postConcepts = {
    beauty: ['makeup tutorial setup', 'skincare products arranged aesthetically'],
    fitness: ['workout in modern gym', 'healthy meal prep layout'],
    fashion: ['outfit of the day in urban setting', 'fashion accessories flat lay'],
    lifestyle: ['morning routine scene', 'aesthetic workspace setup'],
    food: ['beautifully plated dish', 'cooking process overhead shot'],
    travel: ['scenic destination view', 'travel essentials flat lay']
  };

  const nicheKey = Object.keys(postConcepts).find(k => niche.toLowerCase().includes(k)) || 'lifestyle';
  const concepts = postConcepts[nicheKey];
  const concept = concepts[index % concepts.length];

  return `${concept}, ${aesthetic_words.slice(0, 2).join(', ')} aesthetic, ` +
         `${styling_notes}, professional photography, instagram-worthy, ` +
         `high quality, natural lighting`;
}

// For CLI/non-API usage - mock data
export function generateMockImages(persona) {
  return {
    profile_image: `https://via.placeholder.com/400x400/9d4edd/ffffff?text=${persona.name.replace(' ', '+')}`,
    cover_image: `https://via.placeholder.com/1200x400/1a1a1a/9d4edd?text=${persona.niche}+Cover`,
    sample_posts: [
      `https://via.placeholder.com/400x500/1a1a1a/9d4edd?text=Post+1`,
      `https://via.placeholder.com/400x711/1a1a1a/9d4edd?text=Post+2`
    ],
    note: 'Mock images - set REPLICATE_API_TOKEN for real generation'
  };
}
