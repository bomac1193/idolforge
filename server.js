/**
 * IdolForge Web Server
 * Localhost web interface for influencer generation
 */

import express from 'express';
import cors from 'cors';
import { createInfluencer } from './src/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API endpoint to generate influencer
app.post('/api/generate', async (req, res) => {
  try {
    const {
      vibe,
      niche,
      traits,
      platforms,
      imageDescription,
      includeMusic,
      includeMythos,
      includeImages,
      genreMood,
      postCount
    } = req.body;

    // Validate required fields
    if (!vibe || !niche) {
      return res.status(400).json({
        error: 'Missing required fields: vibe and niche are required'
      });
    }

    // Parse platforms if string
    let platformsArray = platforms;
    if (typeof platforms === 'string') {
      platformsArray = platforms.split(',').map(p => p.trim());
    }

    // Generate influencer (now async)
    const result = await createInfluencer({
      vibe,
      niche,
      traits: traits || '',
      platforms: platformsArray || ['instagram', 'tiktok'],
      imageDescription: imageDescription || null,
      includeMusic: includeMusic === true || includeMusic === 'true',
      includeMythos: includeMythos !== false, // default true
      includeImages: includeImages !== false, // default true
      genreMood: genreMood || 'pop upbeat',
      postCount: parseInt(postCount) || 5
    });

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'IdolForge API is running' });
});

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     🎨 IdolForge Web Server 🎨        ║
╚════════════════════════════════════════╝

✨ Server running on: http://localhost:${PORT}

📖 Open your browser and visit:
   http://localhost:${PORT}

🛑 Press Ctrl+C to stop the server
  `);
});
