# IDOLFORGE Advanced Features

## 🚀 Autonomous AI Influencer Platform

IdolForge now includes cutting-edge AI capabilities to create truly autonomous influencers with voice, music, and self-learning capabilities.

---

## 🤖 Autonomous AI Agents (OpenAI Assistants API)

### What It Does
Creates a persistent AI assistant that embodies your influencer's personality, learns over time, and can:
- Generate content autonomously
- Respond to followers in character
- Analyze performance and adapt strategy
- Plan content calendars
- Maintain consistent brand voice

### Setup
```bash
# Get API key from https://platform.openai.com/api-keys
export OPENAI_API_KEY=your_key_here
```

### Usage
```javascript
import { createInfluencerAssistant, chatWithAgent } from './src/autonomous-agent.js';

// Create assistant
const assistant = await createInfluencerAssistant(persona, mythos);

// Chat with your influencer
const response = await chatWithAgent(
  assistant.assistantId,
  threadId,
  "Generate a motivational post about fitness"
);
```

### Features
- **Persistent Memory**: Remembers all conversations and content
- **Brand Consistency**: Stays true to persona across all interactions
- **Autonomous Generation**: Creates content without human input
- **Performance Analysis**: Learns from engagement data
- **Strategic Planning**: Plans multi-day content strategies

---

## 🎤 Voice Generation (ElevenLabs)

### What It Does
Generates realistic voice audio for your influencer with customizable characteristics based on their personality.

### Setup
```bash
# Get API key from https://elevenlabs.io/app/settings/api-keys
export ELEVENLABS_API_KEY=your_key_here
```

### Usage
```javascript
import { generateIntroVoice, generatePostVoice } from './src/voice-generator.js';

// Generate intro
const voice = await generateIntroVoice(persona, mythos);
// Outputs: ./output/voice/{handle}_intro.mp3

// Generate post narration
const postVoice = await generatePostVoice(persona, post);
```

### Voice Customization
Voice characteristics auto-adapt based on persona tone:
- **Confident**: Stable, strong presence
- **Warm**: Gentle, approachable
- **Energetic**: Dynamic, high variation
- **Calm**: Steady, soothing
- **Mysterious**: Subtle, intriguing

### Advanced: Voice Cloning
```javascript
import { cloneVoice } from './src/voice-generator.js';

// Clone from audio sample (requires paid ElevenLabs plan)
const cloned = await cloneVoice(
  './samples/voice.mp3',
  'Custom Voice Name',
  'Description of the voice'
);
```

---

## 🎵 Music Generation (Suno)

### What It Does
Generates full songs with lyrics tailored to your influencer's personality and brand.

### Setup
```bash
# Get API key from https://suno.ai
export SUNO_API_KEY=your_key_here
export SUNO_API_URL=https://api.suno.ai/v1
```

### Usage
```javascript
import { generateSongAuto } from './src/suno-generator.js';

// Auto-generate song
const song = await generateSongAuto(
  persona,
  'fitness motivation',
  'upbeat electronic'
);
```

### Features
- Lyrics generation based on persona philosophy
- Genre/mood customization
- Instrumental track generation
- Full production-quality output

---

## 🎛️ RAVE Audio Processing (Advanced)

### What It Does
Uses Realtime Audio Variational autoEncoder to create unique sonic signatures and audio effects through latent space manipulation.

### Setup
```bash
# Install Python dependencies
pip install acids-rave torch torchaudio

# Download RAVE model
# https://github.com/acids-ircam/RAVE
export RAVE_MODEL_PATH=/path/to/model.ts
```

### Usage
```javascript
import {
  processVoiceWithRAVE,
  enhanceMusicWithRAVE,
  synthesizeAudio
} from './src/rave-wrapper.js';

// Process voice with unique sonic character
const enhanced = await processVoiceWithRAVE(
  voiceBuffer,
  persona,
  'output/voice_enhanced.wav'
);

// Enhance music with RAVE
const music = await enhanceMusicWithRAVE(
  'music.mp3',
  persona,
  'music_enhanced.mp3'
);

// Synthesize unique audio signature
const signature = await synthesizeAudio(5.0, 0.8, 'signature.wav');
```

### RAVE Effects
- **Timbre Shift**: Change voice character
- **Texture**: Add unique sonic texture
- **Pitch Shift**: Modify pitch while preserving quality
- **Synthesis**: Generate completely unique sounds

---

## 🌟 Autonomous Orchestrator

### Complete Autonomous Influencer System

The orchestrator combines ALL capabilities into a unified system:

```javascript
import { createAutonomousInfluencer } from './src/orchestrator.js';

// Create fully autonomous influencer
const influencer = await createAutonomousInfluencer(persona, mythos, {
  includeVoice: true,
  includeMusic: true,
  includeRAVE: true,
  includeAgent: true,
  includeImages: true
});

// Influencer now has:
// - AI assistant that thinks/creates
// - Unique voice signature
// - Signature song
// - RAVE-enhanced audio identity
// - AI-generated images
```

### Autonomous Content Generation

```javascript
import { generateAutonomousContent } from './src/orchestrator.js';

// Generate content completely autonomously
const content = await generateAutonomousContent(
  influencer,
  'motivational fitness post'
);

// Returns:
// - Text content (from AI agent)
// - Voice narration (from ElevenLabs)
// - Suggested image
// - Ready to post!
```

### Autonomous Cycles

Run continuous content generation cycles:

```javascript
import { runAutonomousCycle } from './src/orchestrator.js';

// Run 7 cycles (one week of content)
const week = await runAutonomousCycle(influencer, 7);

// Each cycle generates:
// - Content concept
// - Voice narration
// - Posting metadata
// - Performance tracking
```

---

## 🎯 Complete Workflow

### 1. Create Autonomous Influencer
```javascript
import { generatePersona } from './src/persona-generator.js';
import { generateMythos } from './src/mythos-generator.js';
import { createAutonomousInfluencer } from './src/orchestrator.js';

// Generate persona
const persona = generatePersona({
  vibe: 'confident energetic',
  niche: 'fitness',
  traits: 'motivational, inspiring'
});

// Generate mythos
const mythos = generateMythos(persona);

// Create autonomous influencer
const influencer = await createAutonomousInfluencer(persona, mythos, {
  includeVoice: true,
  includeMusic: true,
  includeRAVE: true,
  includeAgent: true
});
```

### 2. Generate Content Autonomously
```javascript
// The influencer can now create content on its own
const content = await generateAutonomousContent(
  influencer,
  'daily workout motivation'
);

console.log(content.text); // AI-generated post
console.log(content.voicePath); // Voice narration file
```

### 3. Respond to Engagement
```javascript
import { respondToEngagement } from './src/autonomous-agent.js';

// AI responds in character
const response = await respondToEngagement(
  influencer.capabilities.agent.assistantId,
  influencer.capabilities.agent.threadId,
  {
    type: 'comment',
    content: 'Love your energy! How do you stay motivated?',
    followerName: 'JohnDoe'
  }
);
```

### 4. Analyze & Adapt
```javascript
import { analyzePerformance } from './src/autonomous-agent.js';

// AI analyzes what works
const analysis = await analyzePerformance(
  influencer.capabilities.agent.assistantId,
  influencer.capabilities.agent.threadId,
  {
    post_id: '123',
    likes: 1500,
    comments: 87,
    shares: 45,
    engagement_rate: 0.12
  }
);
```

---

## 📊 System Requirements

### Required for Basic Features
- Node.js 18+
- OpenAI API key (Assistants)
- ElevenLabs API key (Voice)

### Optional for Advanced Features
- Suno API key (Music generation)
- Python 3.8+ (for RAVE)
- RAVE model files
- CUDA GPU (recommended for RAVE)

---

## 💰 API Costs (Approximate)

| Service | Cost | What You Get |
|---------|------|--------------|
| OpenAI Assistants | ~$0.01-0.03 per interaction | Persistent AI agent |
| ElevenLabs | ~$0.30 per 1000 characters | High-quality voice |
| Replicate (Images) | ~$0.002 per image | AI-generated images |
| Suno | TBD | Full music tracks |
| RAVE | Free (open source) | Unique audio processing |

---

## 🔮 Future Roadmap

### Phase 1 (Current)
- ✅ Autonomous AI agents
- ✅ Voice generation
- ✅ Music generation
- ✅ RAVE audio processing
- ✅ Orchestration system

### Phase 2 (Next)
- Video generation (Runway/Sora)
- Multi-platform posting automation
- Real-time engagement responses
- Performance analytics dashboard

### Phase 3 (Future)
- Continuous learning from engagement
- A/B testing automation
- Brand deal negotiation AI
- Revenue optimization

---

## 🆘 Troubleshooting

### "ELEVENLABS_API_KEY not set"
```bash
# Add to .env file or export:
export ELEVENLABS_API_KEY=your_key_here
```

### "RAVE not installed"
```bash
# Install Python dependencies:
pip install acids-rave torch torchaudio

# Download model from:
# https://github.com/acids-ircam/RAVE
```

### "Assistant creation failed"
Check that your OpenAI API key has access to the Assistants API (requires GPT-4 access).

---

## 📚 Learn More

- [OpenAI Assistants API Docs](https://platform.openai.com/docs/assistants/overview)
- [ElevenLabs API Docs](https://elevenlabs.io/docs/api-reference)
- [RAVE GitHub](https://github.com/acids-ircam/RAVE)
- [Suno AI](https://suno.ai)

---

## 🎉 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your API keys

# 3. Install Python deps (optional, for RAVE)
pip install acids-rave torch torchaudio

# 4. Run the server
npm start

# 5. Create your first autonomous influencer!
```

---

**Ready to create the future of influencer marketing? 🚀**
