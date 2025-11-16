# IdolForge Web Interface Guide

## 🚀 Quick Start

### 1. Start the Server

```bash
cd /home/sphinxy/idolforge
npm start
```

You'll see:
```
╔════════════════════════════════════════╗
║     🎨 IdolForge Web Server 🎨        ║
╚════════════════════════════════════════╝

✨ Server running on: http://localhost:3000

📖 Open your browser and visit:
   http://localhost:3000

🛑 Press Ctrl+C to stop the server
```

### 2. Open Your Browser

Visit: **http://localhost:3000**

### 3. Use the Interface

Fill in the form:
- **Vibe**: Describe the aesthetic (e.g., "soft dreamy", "edgy bold")
- **Niche**: Content category (e.g., "beauty", "fitness", "fashion")
- **Traits**: Optional personality descriptors
- **Platforms**: Select Instagram, TikTok, X, or OnlyFans
- **Image Description**: Optional reference image description
- **Include Music**: Check to generate a custom song
- **Post Count**: Number of posts per platform (1-20)

Click **"✨ Generate Influencer"** and get instant JSON output!

## 📱 Features

✅ **Beautiful Web Interface** - Clean, modern UI with gradient backgrounds
✅ **Real-time Generation** - See results instantly
✅ **Copy to Clipboard** - One-click JSON copy
✅ **Quick Examples** - Pre-filled templates for common use cases
✅ **Responsive Design** - Works on desktop and mobile
✅ **Live Preview** - JSON syntax highlighting

## 🎯 Example Workflows

### Beauty Influencer
1. Click "💅 Beauty" quick example
2. Click "Generate Influencer"
3. Copy JSON output

### Fitness with Music
1. Click "🎵 With Music" quick example
2. Adjust settings if needed
3. Generate and download results

### Custom Creation
1. Enter your own vibe and niche
2. Select platforms
3. Add personality traits
4. Generate!

## 🔧 API Endpoints

### POST `/api/generate`

Generate an influencer.

**Request Body:**
```json
{
  "vibe": "soft dreamy",
  "niche": "beauty",
  "traits": "gentle, inspiring",
  "platforms": ["instagram", "tiktok"],
  "imageDescription": "optional",
  "includeMusic": false,
  "genreMood": "pop upbeat",
  "postCount": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "persona": { ... },
    "posts": [ ... ],
    "music": { ... }
  }
}
```

### GET `/api/health`

Check server status.

**Response:**
```json
{
  "status": "ok",
  "message": "IdolForge API is running"
}
```

## 🛠️ Using the API Programmatically

### JavaScript/Node.js
```javascript
const response = await fetch('http://localhost:3000/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    vibe: 'edgy bold',
    niche: 'fitness',
    platforms: ['instagram', 'tiktok']
  })
});

const result = await response.json();
console.log(result.data);
```

### cURL
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "vibe": "luxury elegant",
    "niche": "fashion",
    "platforms": ["instagram"],
    "postCount": 3
  }'
```

### Python
```python
import requests

response = requests.post('http://localhost:3000/api/generate', json={
    'vibe': 'vibrant energetic',
    'niche': 'lifestyle',
    'platforms': ['tiktok'],
    'includeMusic': True,
    'genreMood': 'pop upbeat'
})

data = response.json()
print(data['data'])
```

## ⚙️ Configuration

### Change Port

```bash
PORT=8080 npm start
```

Then visit: http://localhost:8080

### Environment Variables

Create `.env` file:
```env
PORT=3000
NODE_ENV=development
```

## 🎨 Customization

### Modify the UI

Edit `/home/sphinxy/idolforge/public/index.html` to customize:
- Colors and styling (in `<style>` tag)
- Form fields
- Layout
- Examples

### Add New Features

Edit `/home/sphinxy/idolforge/server.js` to:
- Add new API endpoints
- Modify generation logic
- Add middleware

## 🚦 Stopping the Server

Press `Ctrl+C` in the terminal where the server is running.

Or find and kill the process:
```bash
# Find the process
lsof -i :3000

# Kill it
kill -9 <PID>
```

## 📊 Server Logs

The server logs all requests:
- API calls
- Errors
- Generation requests

Watch the terminal for real-time logs.

## 💡 Tips

1. **Save Outputs**: Copy the JSON and save to files for later use
2. **Batch Generate**: Open multiple browser tabs to generate multiple influencers
3. **API Integration**: Use the API to integrate with other tools
4. **Custom Presets**: Modify the example buttons for your common use cases

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill existing process on port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or use different port
PORT=3001 npm start
```

### Server Not Starting
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try again
npm start
```

### CORS Errors
The server already includes CORS middleware. If issues persist, check browser console.

## 🌐 Production Deployment

To deploy for production access:

### Using PM2
```bash
npm install -g pm2
pm2 start server.js --name idolforge
pm2 save
```

### Using Docker
Create `Dockerfile`:
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t idolforge .
docker run -p 3000:3000 idolforge
```

---

**IdolForge Web Interface** - Generate influencers with a click! ✨
