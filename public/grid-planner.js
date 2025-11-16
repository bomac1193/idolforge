// Grid Planner Logic

let gridData = [];
let currentPosts = [];
let collections = [];
let draggedPost = null;
let draggedCell = null;
let selectedPlatforms = [];
let activePlatform = 'instagram';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCollections();
    loadGeneratedData();
    loadSamplePosts();
    initializeGrid(9); // 3x3 grid
});

// Initialize grid
function initializeGrid(cellCount) {
    const grid = document.getElementById('instagramGrid');
    grid.innerHTML = '';
    gridData = new Array(cellCount).fill(null);

    for (let i = 0; i < cellCount; i++) {
        const cell = createGridCell(i);
        grid.appendChild(cell);
    }
}

function createGridCell(index) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    cell.dataset.index = index;

    // Drop events
    cell.addEventListener('dragover', handleDragOver);
    cell.addEventListener('drop', handleDrop);
    cell.addEventListener('dragleave', handleDragLeave);

    // Click to remove
    cell.addEventListener('click', () => {
        if (gridData[index]) {
            removeFromGrid(index);
        }
    });

    updateCell(cell, index);
    return cell;
}

function updateCell(cell, index) {
    const post = gridData[index];

    if (post) {
        cell.classList.add('filled');
        cell.innerHTML = `
            <img src="${post.image}" alt="${post.caption}">
            <div class="cell-number">${index + 1}</div>
            <div class="cell-actions">
                <button class="cell-action-btn" onclick="removeFromGrid(${index}); event.stopPropagation();">×</button>
            </div>
        `;
    } else {
        cell.classList.remove('filled');
        cell.innerHTML = '<div class="cell-placeholder">+</div>';
    }
}

// Drag and drop handlers
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    const targetIndex = parseInt(e.currentTarget.dataset.index);

    if (draggedPost) {
        // Dragging from library
        gridData[targetIndex] = draggedPost;
        updateCell(e.currentTarget, targetIndex);
        draggedPost = null;
    } else if (draggedCell !== null) {
        // Dragging within grid (swap)
        const temp = gridData[targetIndex];
        gridData[targetIndex] = gridData[draggedCell];
        gridData[draggedCell] = temp;

        updateAllCells();
        draggedCell = null;
    }
}

function updateAllCells() {
    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach((cell, index) => {
        updateCell(cell, index);
    });
}

// Load sample posts
function loadSamplePosts() {
    // Generate sample posts with placeholder images
    const platforms = ['instagram', 'tiktok'];
    const concepts = [
        'Morning routine reveal',
        'Skincare tutorial',
        'Outfit of the day',
        'Fitness motivation',
        'Healthy meal prep',
        'Travel destination',
        'Product review',
        'Behind the scenes',
        'Q&A session',
        'Transformation story',
        'Tips and tricks',
        'Day in my life',
        'Aesthetic flat lay',
        'Workspace setup',
        'Fashion haul',
        'Beauty routine'
    ];

    currentPosts = concepts.map((concept, i) => ({
        id: i + 1,
        image: `https://picsum.photos/400/400?random=${i}`,
        caption: concept,
        platform: platforms[i % 2],
        concept
    }));

    renderPosts();
}

function renderPosts(filtered = currentPosts) {
    const library = document.getElementById('postsLibrary');
    library.innerHTML = filtered.map(post => `
        <div class="post-item" draggable="true" data-post-id="${post.id}">
            <img src="${post.image}" alt="${post.caption}">
            <div class="post-info">
                <div>${post.caption}</div>
            </div>
        </div>
    `).join('');

    // Add drag event listeners
    document.querySelectorAll('.post-item').forEach(item => {
        item.addEventListener('dragstart', (e) => {
            const postId = parseInt(e.target.closest('.post-item').dataset.postId);
            draggedPost = currentPosts.find(p => p.id === postId);
            e.target.classList.add('dragging');
        });

        item.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
    });
}

// Filter posts
function filterPosts() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const filtered = currentPosts.filter(post =>
        post.caption.toLowerCase().includes(search) ||
        post.platform.toLowerCase().includes(search)
    );
    renderPosts(filtered);
}

// Grid actions
function removeFromGrid(index) {
    gridData[index] = null;
    const cells = document.querySelectorAll('.grid-cell');
    updateCell(cells[index], index);
}

function clearGrid() {
    if (confirm('Clear entire grid?')) {
        gridData = gridData.map(() => null);
        updateAllCells();
    }
}

function shuffleGrid() {
    const filled = gridData.filter(item => item !== null);
    if (filled.length === 0) return;

    // Shuffle algorithm
    for (let i = filled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filled[i], filled[j]] = [filled[j], filled[i]];
    }

    // Redistribute
    let filledIndex = 0;
    gridData = gridData.map(item => {
        if (item !== null && filledIndex < filled.length) {
            return filled[filledIndex++];
        }
        return item;
    });

    updateAllCells();
}

function addRow() {
    const currentCols = 3;
    const newCells = currentCols;
    gridData.push(...new Array(newCells).fill(null));
    initializeGrid(gridData.length);
}

function removeRow() {
    if (gridData.length <= 3) {
        alert('Grid must have at least one row');
        return;
    }

    const currentCols = 3;
    gridData = gridData.slice(0, -currentCols);
    initializeGrid(gridData.length);
}

function exportGrid() {
    const exportData = {
        grid: gridData,
        timestamp: new Date().toISOString(),
        dimensions: { rows: gridData.length / 3, cols: 3 }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `instagram-grid-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Collections
function saveCollection() {
    const name = prompt('Collection name:');
    if (!name) return;

    const collection = {
        id: Date.now(),
        name,
        grid: [...gridData],
        created: new Date().toISOString(),
        postCount: gridData.filter(p => p !== null).length
    };

    collections.push(collection);
    saveCollections();
    renderCollections();
}

function createNewCollection() {
    clearGrid();
}

function loadCollection(id) {
    const collection = collections.find(c => c.id === id);
    if (!collection) return;

    gridData = [...collection.grid];
    initializeGrid(gridData.length);
    updateAllCells();

    // Highlight active collection
    document.querySelectorAll('.collection-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-collection-id="${id}"]`)?.classList.add('active');
}

function deleteCollection(id) {
    if (!confirm('Delete this collection?')) return;

    collections = collections.filter(c => c.id !== id);
    saveCollections();
    renderCollections();
}

function renderCollections() {
    const list = document.getElementById('collectionsList');

    if (collections.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📁</div>
                <p>No collections yet.<br>Save your first grid layout!</p>
            </div>
        `;
        return;
    }

    list.innerHTML = collections.map(c => `
        <div class="collection-item" data-collection-id="${c.id}" onclick="loadCollection(${c.id})">
            <div class="collection-name">${c.name}</div>
            <div class="collection-meta">${c.postCount} posts • ${new Date(c.created).toLocaleDateString()}</div>
            <div class="collection-preview">
                ${c.grid.slice(0, 9).map(post => `
                    <div class="collection-preview-cell">
                        ${post ? `<img src="${post.image}" alt="">` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function saveCollections() {
    localStorage.setItem('idolforge_collections', JSON.stringify(collections));
}

function loadCollections() {
    const saved = localStorage.getItem('idolforge_collections');
    if (saved) {
        collections = JSON.parse(saved);
        renderCollections();
    }
}

// Load generated influencer data and platforms
function loadGeneratedData() {
    const savedData = localStorage.getItem('idolforge_current_influencer');
    if (savedData) {
        const data = JSON.parse(savedData);

        // Extract platforms from generated posts
        if (data.posts) {
            const platforms = [...new Set(data.posts.map(p => p.platform))];
            selectedPlatforms = platforms;

            // Set active platform to first one
            if (platforms.length > 0) {
                activePlatform = platforms[0];
            }

            // Render platform tabs
            renderPlatformTabs();
        }
    } else {
        // Default platforms if no data
        selectedPlatforms = ['instagram'];
        renderPlatformTabs();
    }
}

// Load posts from generated influencer
function loadGeneratedPosts() {
    const savedData = localStorage.getItem('idolforge_current_influencer');
    if (savedData) {
        const data = JSON.parse(savedData);
        if (data.posts && data.images) {
            // Convert generated posts to grid items
            const generatedPosts = data.posts.map((post, i) => ({
                id: 1000 + i,
                image: data.images.sample_posts[i % data.images.sample_posts.length] || `https://picsum.photos/400/400?random=${1000 + i}`,
                caption: post.caption,
                platform: post.platform,
                concept: post.concept
            }));

            currentPosts = [...currentPosts, ...generatedPosts];
            renderPosts();
        }
    }
}

// Render platform tabs
function renderPlatformTabs() {
    const tabsContainer = document.getElementById('platformTabs');
    if (!tabsContainer) return;

    if (selectedPlatforms.length === 0) {
        tabsContainer.innerHTML = '<div style="font-size: 0.75rem; color: var(--text-dim);">Generate an influencer first to see platform-specific planners</div>';
        return;
    }

    const platformNames = {
        'instagram': 'Instagram',
        'tiktok': 'TikTok',
        'youtube': 'YouTube',
        'discord': 'Discord',
        'x': 'X (Twitter)',
        'onlyfans': 'OnlyFans'
    };

    tabsContainer.innerHTML = selectedPlatforms.map(platform => `
        <button class="platform-tab ${platform === activePlatform ? 'active' : ''}"
                onclick="switchPlatform('${platform}')">
            ${platformNames[platform] || platform}
        </button>
    `).join('');
}

// Switch platform
function switchPlatform(platform) {
    activePlatform = platform;
    renderPlatformTabs();

    // Update grid based on platform
    if (platform === 'instagram') {
        // 3x3 grid for Instagram
        if (gridData.length !== 9) {
            initializeGrid(9);
        }
    } else if (platform === 'tiktok') {
        // Vertical feed for TikTok (1 column, multiple rows)
        document.getElementById('instagramGrid').style.gridTemplateColumns = '1fr';
        if (gridData.length < 5) {
            initializeGrid(5);
        }
    } else {
        // Default grid
        if (gridData.length !== 9) {
            initializeGrid(9);
        }
    }

    // Filter posts by platform
    filterPostsByPlatform();
}

// Filter posts by platform
function filterPostsByPlatform() {
    const filtered = currentPosts.filter(post =>
        post.platform === activePlatform || !post.platform
    );
    renderPosts(filtered);
}

// Initialize with generated posts if available
setTimeout(loadGeneratedPosts, 500);
