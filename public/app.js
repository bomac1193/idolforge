// IdolForge Frontend Logic

let currentData = null;
let currentMode = 'basic';

// Initialize keyword pills on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeKeywordPills();
    switchMode('basic'); // Start in basic mode
});

// Mode switching: Basic vs Advanced
function switchMode(mode) {
    currentMode = mode;

    // Update button states
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event?.target?.classList.add('active');

    if (mode === 'basic') {
        // Show keyword pills and randomizer
        document.getElementById('randomizer').classList.remove('hidden');
        document.getElementById('vibeKeywords').classList.remove('hidden');
        document.getElementById('nicheKeywords').classList.remove('hidden');
        document.getElementById('traitKeywords').classList.remove('hidden');

        // Hide advanced options
        document.getElementById('imageDescription').closest('.form-group').style.display = 'none';
        document.getElementById('musicMoodGroup').style.display = 'none';
        document.getElementById('postCount').closest('.form-group').style.display = 'none';
    } else {
        // Hide keyword pills and randomizer
        document.getElementById('randomizer').classList.add('hidden');
        document.getElementById('vibeKeywords').classList.add('hidden');
        document.getElementById('nicheKeywords').classList.add('hidden');
        document.getElementById('traitKeywords').classList.add('hidden');

        // Show advanced options
        document.getElementById('imageDescription').closest('.form-group').style.display = 'block';
        document.getElementById('postCount').closest('.form-group').style.display = 'block';
    }
}

// Initialize keyword pills
function initializeKeywordPills() {
    // Vibes
    const vibeContainer = document.getElementById('vibeKeywords');
    window.VIBES.forEach(vibe => {
        const pill = createKeywordPill(vibe, 'vibe');
        vibeContainer.appendChild(pill);
    });

    // Niches
    const nicheContainer = document.getElementById('nicheKeywords');
    window.NICHES.forEach(niche => {
        const pill = createKeywordPill(niche.label + ' ' + niche.icon, 'niche');
        nicheContainer.appendChild(pill);
    });

    // Traits
    const traitContainer = document.getElementById('traitKeywords');
    window.TRAITS.forEach(trait => {
        const pill = createKeywordPill(trait, 'traits');
        traitContainer.appendChild(pill);
    });
}

// Create keyword pill element
function createKeywordPill(text, fieldId) {
    const pill = document.createElement('div');
    pill.className = 'keyword-pill';
    pill.textContent = text;
    pill.onclick = () => selectKeyword(text, fieldId, pill);
    return pill;
}

// Select keyword
function selectKeyword(text, fieldId, element) {
    const input = document.getElementById(fieldId);

    // Remove icon from text if present
    const cleanText = text.replace(/[^\w\s-]/g, '').trim();

    // Toggle selection
    if (element.classList.contains('selected')) {
        element.classList.remove('selected');
        // Remove from input
        const values = input.value.split(',').map(v => v.trim()).filter(v => v !== cleanText);
        input.value = values.join(', ');
    } else {
        element.classList.add('selected');
        // Add to input
        const current = input.value ? input.value + ', ' : '';
        input.value = current + cleanText;
    }
}

// Randomizer function
function randomize() {
    const result = window.randomizeInfluencer();

    // Fill form
    document.getElementById('vibe').value = result.vibe;
    document.getElementById('niche').value = result.niche;
    document.getElementById('traits').value = result.traits;

    // Show result
    const resultDiv = document.getElementById('randomResult');
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = `
        <h4>${result.type} from ${result.location}</h4>
        <p><strong>Vibe:</strong> ${result.vibe}</p>
        <p><strong>Niche:</strong> ${result.niche}</p>
        <p><strong>Traits:</strong> ${result.traits}</p>
        <p style="margin-top: 8px; font-style: italic;">"${result.description}"</p>
    `;

    // Update selected pills
    updateSelectedPills();
}

// Update selected pills based on input values
function updateSelectedPills() {
    // Clear all selections
    document.querySelectorAll('.keyword-pill').forEach(pill => {
        pill.classList.remove('selected');
    });

    // Vibe
    const vibeValue = document.getElementById('vibe').value;
    if (vibeValue) {
        const vibes = vibeValue.split(',').map(v => v.trim().toLowerCase());
        document.querySelectorAll('#vibeKeywords .keyword-pill').forEach(pill => {
            if (vibes.includes(pill.textContent.toLowerCase())) {
                pill.classList.add('selected');
            }
        });
    }

    // Similar for niche and traits
    const nicheValue = document.getElementById('niche').value;
    if (nicheValue) {
        const niches = nicheValue.split(',').map(v => v.trim().toLowerCase());
        document.querySelectorAll('#nicheKeywords .keyword-pill').forEach(pill => {
            const text = pill.textContent.replace(/[^\w\s-]/g, '').trim().toLowerCase();
            if (niches.includes(text)) {
                pill.classList.add('selected');
            }
        });
    }

    const traitsValue = document.getElementById('traits').value;
    if (traitsValue) {
        const traits = traitsValue.split(',').map(v => v.trim().toLowerCase());
        document.querySelectorAll('#traitKeywords .keyword-pill').forEach(pill => {
            if (traits.includes(pill.textContent.toLowerCase())) {
                pill.classList.add('selected');
            }
        });
    }
}

// Toggle music input
document.getElementById('includeMusic').addEventListener('change', (e) => {
    document.getElementById('musicMoodGroup').classList.toggle('hidden', !e.target.checked);
});

// Form submission
document.getElementById('influencerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await generateInfluencer();
});

async function generateInfluencer() {
    const vibe = document.getElementById('vibe').value;
    const niche = document.getElementById('niche').value;
    const traits = document.getElementById('traits').value;
    const imageDescription = document.getElementById('imageDescription').value;
    const includeMusic = document.getElementById('includeMusic').checked;
    const genreMood = document.getElementById('genreMood').value;
    const postCount = document.getElementById('postCount').value;

    const platforms = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .filter(cb => cb.id !== 'includeMusic')
        .map(cb => cb.value);

    if (platforms.length === 0) {
        alert('Please select at least one platform');
        return;
    }

    // Show loading
    document.getElementById('emptyState').classList.add('hidden');
    document.getElementById('resultDisplay').classList.add('hidden');
    document.getElementById('loadingState').classList.remove('hidden');
    document.getElementById('generateBtn').disabled = true;

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                vibe, niche, traits, platforms,
                imageDescription, includeMusic,
                genreMood, postCount
            })
        });

        const result = await response.json();

        if (result.success) {
            currentData = result.data;
            // Save to localStorage for Grid Planner
            localStorage.setItem('idolforge_current_influencer', JSON.stringify(result.data));
            displayResult(result.data);
        } else {
            alert('Error: ' + result.error);
            document.getElementById('emptyState').classList.remove('hidden');
        }
    } catch (error) {
        alert('Error: ' + error.message);
        document.getElementById('emptyState').classList.remove('hidden');
    } finally {
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('generateBtn').disabled = false;
    }
}

function displayResult(data) {
    const { persona, mythos, images, posts, music } = data;

    let html = '';

    // Add Content Planner CTA at top if has posts
    if (posts && posts.length > 0) {
        html += `
            <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(157, 78, 221, 0.1)); border: 1px solid #D4AF37; padding: 24px; margin-bottom: 40px; text-align: center;">
                <h3 style="font-size: 1.25rem; margin-bottom: 12px;">Schedule & Plan Your Content</h3>
                <p style="color: var(--text-dim); margin-bottom: 20px;">Use the Content Planner to organize posts for ${currentData.platforms?.join(', ') || 'your platforms'} and preview your feed aesthetic</p>
                <button onclick="openGridPlanner()" style="padding: 12px 32px; background: linear-gradient(135deg, #D4AF37, var(--accent)); color: var(--black); border: none; font-weight: 700; cursor: pointer; font-size: 0.875rem;">
                    Open Content Planner PRO ✨
                </button>
            </div>
        `;
    }

    // Hero Section with Profile & Cover
    html += `
        <div class="persona-hero">
            ${images?.cover_image ? `<img src="${images.cover_image}" alt="Cover" class="cover-image">` : ''}
            <div class="persona-overlay">
                <div class="persona-header">
                    ${images?.profile_image ? `<img src="${images.profile_image}" alt="${persona.name}" class="profile-image">` : ''}
                    <div class="persona-info">
                        <h2>${persona.name}</h2>
                        <div class="persona-handle">${persona.handle}</div>
                        <div class="persona-bio">${persona.bio}</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Mythos Section
    if (mythos) {
        html += `
            <div class="mythos-section">
                <h3 class="section-title">The Story</h3>
                <div class="mythos-tagline">"${mythos.tagline}"</div>
                <div class="mythos-story">${mythos.origin_story}</div>

                <div class="mythos-grid">
                    <div class="mythos-item">
                        <h4>Philosophy</h4>
                        <p>${mythos.core_philosophy}</p>
                    </div>
                    <div class="mythos-item">
                        <h4>Manifesto</h4>
                        <p>${mythos.manifesto}</p>
                    </div>
                </div>

                ${mythos.signature_elements ? `
                <div class="mythos-grid" style="margin-top: 32px;">
                    <div class="mythos-item">
                        <h4>Visual Trademark</h4>
                        <p>${mythos.signature_elements.visual_trademark}</p>
                    </div>
                    <div class="mythos-item">
                        <h4>Community Vibe</h4>
                        <p>${mythos.signature_elements.community_vibe}</p>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    }

    // Sample Images Grid
    if (images?.sample_posts && images.sample_posts.length > 0) {
        html += `
            <div class="images-grid">
                ${images.sample_posts.map((img, i) => `
                    <div class="image-card">
                        <img src="${img}" alt="Sample post ${i + 1}">
                        <div class="image-caption">Sample content image ${i + 1}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Posts Section
    if (posts && posts.length > 0) {
        html += `
            <div class="posts-section">
                <h3 class="section-title">Content Examples</h3>
                <div class="posts-grid">
                    ${posts.slice(0, 6).map(post => `
                        <div class="post-card">
                            <div class="post-platform">${post.platform}</div>
                            <div class="post-concept">${post.concept}</div>
                            <div class="post-caption">${post.caption || post.hook}</div>
                            ${post.hashtags && post.hashtags.length > 0 ? `
                                <div class="post-hashtags">${post.hashtags.slice(0, 5).join(' ')}</div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Music Section
    if (music) {
        html += `
            <div class="mythos-section">
                <h3 class="section-title">Signature Song: "${music.title}"</h3>
                <p style="color: var(--text-dim); margin-bottom: 24px;">${music.concept}</p>

                <div style="margin-bottom: 24px;">
                    <h4 style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-dim); margin-bottom: 12px;">Hook</h4>
                    <pre style="line-height: 1.8; color: var(--text); white-space: pre-wrap;">${music.hook_lyrics}</pre>
                </div>

                <div>
                    <h4 style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-dim); margin-bottom: 12px;">Verse</h4>
                    <pre style="line-height: 1.8; color: var(--text-dim); white-space: pre-wrap;">${music.verse_lyrics}</pre>
                </div>
            </div>
        `;
    }

    // JSON Section
    html += `
        <div class="json-section">
            <div class="json-header">
                <h3 class="card-title">Full JSON Output</h3>
                <button class="btn-copy" onclick="copyJSON()">Copy JSON</button>
            </div>
            <pre class="json-output">${JSON.stringify(data, null, 2)}</pre>
        </div>
    `;

    document.getElementById('resultDisplay').innerHTML = html;
    document.getElementById('resultDisplay').classList.remove('hidden');

    // Scroll to top of results
    document.getElementById('resultDisplay').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function copyJSON() {
    const json = JSON.stringify(currentData, null, 2);
    navigator.clipboard.writeText(json).then(() => {
        const btn = document.querySelector('.btn-copy');
        btn.classList.add('active');
        btn.textContent = 'Copied!';
        setTimeout(() => {
            btn.classList.remove('active');
            btn.textContent = 'Copy JSON';
        }, 2000);
    });
}

// Preset functions
function fillExample1() {
    document.getElementById('vibe').value = 'soft dreamy pastel';
    document.getElementById('niche').value = 'beauty';
    document.getElementById('traits').value = 'gentle, inspiring';
    document.getElementById('instagram').checked = true;
    document.getElementById('tiktok').checked = true;
    document.getElementById('x').checked = false;
    document.getElementById('onlyfans').checked = false;
}

function fillExample2() {
    document.getElementById('vibe').value = 'edgy confident bold';
    document.getElementById('niche').value = 'fitness';
    document.getElementById('traits').value = 'motivational, fierce';
    document.getElementById('instagram').checked = true;
    document.getElementById('tiktok').checked = true;
    document.getElementById('x').checked = true;
    document.getElementById('onlyfans').checked = false;
}

function fillExample3() {
    document.getElementById('vibe').value = 'luxury elegant sophisticated';
    document.getElementById('niche').value = 'fashion';
    document.getElementById('traits').value = 'refined, chic';
    document.getElementById('instagram').checked = true;
    document.getElementById('tiktok').checked = false;
    document.getElementById('x').checked = false;
    document.getElementById('onlyfans').checked = false;
}

function fillExample4() {
    document.getElementById('vibe').value = 'vibrant energetic fun';
    document.getElementById('niche').value = 'lifestyle';
    document.getElementById('traits').value = 'playful, inspiring';
    document.getElementById('tiktok').checked = true;
    document.getElementById('includeMusic').checked = true;
    document.getElementById('musicMoodGroup').classList.remove('hidden');
    document.getElementById('genreMood').value = 'upbeat pop electronic';
}
