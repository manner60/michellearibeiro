/**
 * Michelle's AI Thumbnail Creator
 * A powerful, AI-enhanced thumbnail creation tool
 */

// Canvas and context
const canvas = document.getElementById('thumbnail-canvas');
const ctx = canvas.getContext('2d');

// State
let currentTemplate = 'blank';
let currentSize = 'youtube';
let currentBgColor = 'gradient1';
let currentTextColor = '#ffffff';
let currentFont = 'Oswald';
let layers = [];
let selectedLayer = null;
let isDragging = false;
let dragStart = { x: 0, y: 0 };

// Canvas sizes
const sizes = {
    youtube: { width: 1280, height: 720 },
    'youtube-short': { width: 1080, height: 1920 },
    instagram: { width: 1080, height: 1080 },
    tiktok: { width: 1080, height: 1920 }
};

// Templates
const templates = {
    blank: {
        background: 'gradient1',
        elements: []
    },
    gradient: {
        background: 'gradient1',
        elements: [
            { type: 'text', text: 'YOUR TITLE', x: 640, y: 300, fontSize: 80, font: 'Oswald', color: '#ffffff', align: 'center' },
            { type: 'text', text: 'Subtitle here', x: 640, y: 400, fontSize: 40, font: 'Inter', color: '#ffffff', align: 'center' }
        ]
    },
    'bold-text': {
        background: '#0f172a',
        elements: [
            { type: 'text', text: 'WOW!', x: 640, y: 280, fontSize: 120, font: 'Bebas Neue', color: '#fbbf24', align: 'center' },
            { type: 'text', text: 'This Changes Everything', x: 640, y: 420, fontSize: 50, font: 'Oswald', color: '#ffffff', align: 'center' }
        ]
    },
    split: {
        background: 'gradient3',
        elements: [
            { type: 'rect', x: 0, y: 0, width: 640, height: 720, color: 'rgba(0,0,0,0.3)' },
            { type: 'text', text: 'BEFORE', x: 320, y: 360, fontSize: 60, font: 'Oswald', color: '#ffffff', align: 'center' },
            { type: 'text', text: 'AFTER', x: 960, y: 360, fontSize: 60, font: 'Oswald', color: '#ffffff', align: 'center' }
        ]
    },
    minimal: {
        background: '#ffffff',
        elements: [
            { type: 'text', text: 'Clean & Simple', x: 640, y: 360, fontSize: 70, font: 'Inter', color: '#0f172a', align: 'center' }
        ]
    },
    vibrant: {
        background: 'gradient4',
        elements: [
            { type: 'circle', x: 640, y: 360, radius: 200, color: 'rgba(255,255,255,0.2)' },
            { type: 'text', text: 'POP!', x: 640, y: 380, fontSize: 100, font: 'Bebas Neue', color: '#ffffff', align: 'center' }
        ]
    }
};

// Initialize
function init() {
    loadTemplate('blank');
    setupEventListeners();
    updateCanvas();
}

// Setup event listeners
function setupEventListeners() {
    // Template selection
    document.querySelectorAll('.template-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.template-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            loadTemplate(item.dataset.template);
        });
    });

    // Size selection
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            changeSize(btn.dataset.size);
        });
    });

    // Background colors
    document.querySelectorAll('#bgColors .color-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('#bgColors .color-option').forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            currentBgColor = option.dataset.color;
            updateCanvas();
        });
    });

    // Text colors
    document.querySelectorAll('#textColors .color-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('#textColors .color-option').forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            currentTextColor = option.dataset.color;
            updateCanvas();
        });
    });

    // Font selection
    document.querySelectorAll('#fontSelector .font-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('#fontSelector .font-option').forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            currentFont = option.dataset.font;
        });
    });

    // Text inputs
    document.getElementById('headlineText').addEventListener('input', updateCanvas);
    document.getElementById('subheadlineText').addEventListener('input', updateCanvas);

    // Image upload
    document.getElementById('imageUpload').addEventListener('change', handleImageUpload);

    // Canvas interactions
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('dblclick', handleDoubleClick);

    // Quality slider
    document.getElementById('qualitySlider').addEventListener('input', (e) => {
        document.getElementById('qualityValue').textContent = Math.round(e.target.value * 100) + '%';
    });

    // Export options
    document.querySelectorAll('.export-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.export-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
        });
    });
}

// Load template
function loadTemplate(templateName) {
    currentTemplate = templateName;
    const template = templates[templateName];
    
    if (template.background) {
        currentBgColor = template.background;
        document.querySelectorAll('#bgColors .color-option').forEach(o => {
            o.classList.toggle('active', o.dataset.color === template.background);
        });
    }

    layers = template.elements ? [...template.elements] : [];
    
    // Add headline and subheadline from inputs
    const headline = document.getElementById('headlineText').value;
    const subheadline = document.getElementById('subheadlineText').value;
    
    if (headline && templateName === 'blank') {
        layers.push({
            type: 'text',
            text: headline,
            x: canvas.width / 2,
            y: canvas.height / 2 - 50,
            fontSize: 80,
            font: currentFont,
            color: currentTextColor,
            align: 'center'
        });
    }
    
    if (subheadline && templateName === 'blank') {
        layers.push({
            type: 'text',
            text: subheadline,
            x: canvas.width / 2,
            y: canvas.height / 2 + 50,
            fontSize: 40,
            font: 'Inter',
            color: currentTextColor,
            align: 'center'
        });
    }

    updateLayersList();
    updateCanvas();
}

// Change canvas size
function changeSize(sizeName) {
    currentSize = sizeName;
    const size = sizes[sizeName];
    canvas.width = size.width;
    canvas.height = size.height;
    updateCanvas();
}

// Update canvas
function updateCanvas() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    drawBackground();

    // Draw layers
    layers.forEach(layer => {
        drawLayer(layer);
    });

    // Draw headline and subheadline if blank template
    if (currentTemplate === 'blank') {
        drawTextFromInputs();
    }
}

// Draw background
function drawBackground() {
    const gradients = {
        gradient1: ['#6366f1', '#ec4899'],
        gradient2: ['#f59e0b', '#ef4444'],
        gradient3: ['#10b981', '#3b82f6'],
        gradient4: ['#8b5cf6', '#ec4899']
    };

    if (gradients[currentBgColor]) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, gradients[currentBgColor][0]);
        gradient.addColorStop(1, gradients[currentBgColor][1]);
        ctx.fillStyle = gradient;
    } else {
        ctx.fillStyle = currentBgColor;
    }
    
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw layer
function drawLayer(layer) {
    if (layer.type === 'text') {
        ctx.font = `bold ${layer.fontSize}px "${layer.font}"`;
        ctx.fillStyle = layer.color;
        ctx.textAlign = layer.align || 'left';
        ctx.textBaseline = 'middle';
        
        // Add text shadow for better visibility
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.fillText(layer.text, layer.x, layer.y);
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
    } else if (layer.type === 'rect') {
        ctx.fillStyle = layer.color;
        ctx.fillRect(layer.x, layer.y, layer.width, layer.height);
    } else if (layer.type === 'circle') {
        ctx.beginPath();
        ctx.arc(layer.x, layer.y, layer.radius, 0, Math.PI * 2);
        ctx.fillStyle = layer.color;
        ctx.fill();
    } else if (layer.type === 'image' && layer.img) {
        ctx.drawImage(layer.img, layer.x, layer.y, layer.width || layer.img.width, layer.height || layer.img.height);
    }
}

// Draw text from inputs
function drawTextFromInputs() {
    const headline = document.getElementById('headlineText').value;
    const subheadline = document.getElementById('subheadlineText').value;

    if (headline) {
        ctx.font = `bold 80px "${currentFont}"`;
        ctx.fillStyle = currentTextColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        
        ctx.fillText(headline, canvas.width / 2, canvas.height / 2 - 50);
        ctx.shadowColor = 'transparent';
    }

    if (subheadline) {
        ctx.font = '500 40px "Inter"';
        ctx.fillStyle = currentTextColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.fillText(subheadline, canvas.width / 2, canvas.height / 2 + 50);
        ctx.shadowColor = 'transparent';
    }
}

// Add text layer
function addTextLayer() {
    const text = prompt('Enter text:');
    if (text) {
        layers.push({
            type: 'text',
            text: text,
            x: canvas.width / 2,
            y: canvas.height / 2,
            fontSize: 60,
            font: currentFont,
            color: currentTextColor,
            align: 'center'
        });
        updateLayersList();
        updateCanvas();
    }
}

// Add shape
function addShape() {
    const shapes = ['circle', 'rect'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    if (shape === 'circle') {
        layers.push({
            type: 'circle',
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: 100,
            color: 'rgba(255,255,255,0.2)'
        });
    } else {
        layers.push({
            type: 'rect',
            x: canvas.width / 2 - 100,
            y: canvas.height / 2 - 100,
            width: 200,
            height: 200,
            color: 'rgba(255,255,255,0.2)'
        });
    }
    
    updateLayersList();
    updateCanvas();
}

// Handle image upload
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // Scale image to fit canvas
                const scale = Math.min(canvas.width / img.width, canvas.height / img.height, 1);
                layers.push({
                    type: 'image',
                    img: img,
                    x: (canvas.width - img.width * scale) / 2,
                    y: (canvas.height - img.height * scale) / 2,
                    width: img.width * scale,
                    height: img.height * scale
                });
                updateLayersList();
                updateCanvas();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Update layers list
function updateLayersList() {
    const list = document.getElementById('layersList');
    list.innerHTML = '';
    
    layers.forEach((layer, index) => {
        const item = document.createElement('div');
        item.className = 'layer-item' + (selectedLayer === index ? ' active' : '');
        item.innerHTML = `
            <div class="layer-icon">${layer.type === 'text' ? '📝' : layer.type === 'image' ? '🖼️' : layer.type === 'circle' ? '⭕' : '⬜'}</div>
            <span class="layer-name">${layer.type === 'text' ? layer.text.substring(0, 20) : layer.type}</span>
            <span class="layer-visibility" onclick="toggleLayerVisibility(${index})">👁️</span>
        `;
        item.onclick = () => selectLayer(index);
        list.appendChild(item);
    });
}

// Select layer
function selectLayer(index) {
    selectedLayer = index;
    updateLayersList();
}

// Toggle layer visibility
function toggleLayerVisibility(index) {
    event.stopPropagation();
    // Implementation for visibility toggle
}

// Mouse handlers for dragging
function handleMouseDown(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    // Check if clicked on a layer
    for (let i = layers.length - 1; i >= 0; i--) {
        const layer = layers[i];
        if (isPointInLayer(x, y, layer)) {
            selectedLayer = i;
            isDragging = true;
            dragStart = { x: x - (layer.x || 0), y: y - (layer.y || 0) };
            updateLayersList();
            break;
        }
    }
}

function handleMouseMove(e) {
    if (!isDragging || selectedLayer === null) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    const layer = layers[selectedLayer];
    layer.x = x - dragStart.x;
    layer.y = y - dragStart.y;
    
    updateCanvas();
}

function handleMouseUp() {
    isDragging = false;
}

function handleDoubleClick(e) {
    if (selectedLayer !== null && layers[selectedLayer].type === 'text') {
        const newText = prompt('Edit text:', layers[selectedLayer].text);
        if (newText !== null) {
            layers[selectedLayer].text = newText;
            updateLayersList();
            updateCanvas();
        }
    }
}

function isPointInLayer(x, y, layer) {
    if (layer.type === 'text') {
        ctx.font = `bold ${layer.fontSize}px "${layer.font}"`;
        const metrics = ctx.measureText(layer.text);
        const width = metrics.width;
        const height = layer.fontSize;
        return x >= layer.x - width/2 && x <= layer.x + width/2 &&
               y >= layer.y - height/2 && y <= layer.y + height/2;
    } else if (layer.type === 'rect') {
        return x >= layer.x && x <= layer.x + layer.width &&
               y >= layer.y && y <= layer.y + layer.height;
    } else if (layer.type === 'circle') {
        const dx = x - layer.x;
        const dy = y - layer.y;
        return dx * dx + dy * dy <= layer.radius * layer.radius;
    } else if (layer.type === 'image') {
        return x >= layer.x && x <= layer.x + layer.width &&
               y >= layer.y && y <= layer.y + layer.height;
    }
    return false;
}

// Clear canvas
function clearCanvas() {
    if (confirm('Clear all layers?')) {
        layers = [];
        selectedLayer = null;
        updateLayersList();
        updateCanvas();
    }
}

// AI Generation
async function generateWithAI() {
    const prompt = document.getElementById('aiPrompt').value;
    if (!prompt) {
        alert('Please enter a description for your thumbnail');
        return;
    }

    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.add('active');

    try {
        // For now, we'll create a smart template based on the prompt
        // In the future, this could integrate with DALL-E or Midjourney API
        
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI processing
        
        // Parse prompt and create appropriate thumbnail
        const lowerPrompt = prompt.toLowerCase();
        
        // Clear existing layers
        layers = [];
        
        // Set background based on prompt
        if (lowerPrompt.includes('blue')) {
            currentBgColor = 'gradient3';
        } else if (lowerPrompt.includes('purple') || lowerPrompt.includes('pink')) {
            currentBgColor = 'gradient4';
        } else if (lowerPrompt.includes('orange') || lowerPrompt.includes('warm')) {
            currentBgColor = 'gradient2';
        } else {
            currentBgColor = 'gradient1';
        }
        
        // Update color picker
        document.querySelectorAll('#bgColors .color-option').forEach(o => {
            o.classList.toggle('active', o.dataset.color === currentBgColor);
        });
        
        // Extract potential title from prompt
        let title = 'NEW VIDEO';
        const titleMatch = prompt.match(/(?:with|featuring|showing|about)\s+(.+?)(?:\s+background|$)/i);
        if (titleMatch) {
            title = titleMatch[1].toUpperCase();
        }
        
        // Add main title
        layers.push({
            type: 'text',
            text: title,
            x: canvas.width / 2,
            y: canvas.height / 2 - 40,
            fontSize: 90,
            font: 'Oswald',
            color: '#ffffff',
            align: 'center'
        });
        
        // Add decorative elements based on prompt
        if (lowerPrompt.includes('tech') || lowerPrompt.includes('digital')) {
            layers.push({
                type: 'circle',
                x: canvas.width - 150,
                y: 150,
                radius: 80,
                color: 'rgba(255,255,255,0.1)'
            });
        }
        
        if (lowerPrompt.includes('arrow') || lowerPrompt.includes('point')) {
            // Could add arrow shape here
        }
        
        updateLayersList();
        updateCanvas();
        
        // Save to recent
        saveToRecent(prompt);
        
    } catch (error) {
        console.error('AI generation error:', error);
        alert('Error generating thumbnail. Please try again.');
    } finally {
        loadingOverlay.classList.remove('active');
    }
}

// Save to recent
function saveToRecent(prompt) {
    const recent = JSON.parse(localStorage.getItem('recentThumbnails') || '[]');
    recent.unshift({
        prompt: prompt,
        date: new Date().toISOString(),
        template: currentTemplate
    });
    if (recent.length > 10) recent.pop();
    localStorage.setItem('recentThumbnails', JSON.stringify(recent));
    updateRecentList();
}

// Update recent list
function updateRecentList() {
    const recent = JSON.parse(localStorage.getItem('recentThumbnails') || '[]');
    const list = document.getElementById('recentList');
    
    if (recent.length === 0) {
        list.innerHTML = 'No recent thumbnails';
        return;
    }
    
    list.innerHTML = recent.map(item => `
        <div style="padding: 8px; background: rgba(255,255,255,0.05); border-radius: 6px; margin-bottom: 6px; cursor: pointer;"
             onclick="loadRecent('${item.prompt}')">
            <div style="font-size: 11px; color: var(--gray);">${new Date(item.date).toLocaleDateString()}</div>
            <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.prompt}</div>
        </div>
    `).join('');
}

// Load recent
function loadRecent(prompt) {
    document.getElementById('aiPrompt').value = prompt;
    generateWithAI();
}

// Export modal
function showExportModal() {
    document.getElementById('exportModal').classList.add('active');
}

function closeExportModal() {
    document.getElementById('exportModal').classList.remove('active');
}

function confirmExport() {
    downloadThumbnail();
    closeExportModal();
}

// Download thumbnail
function downloadThumbnail() {
    const format = document.querySelector('.export-option.selected')?.dataset.format || 'png';
    const quality = parseFloat(document.getElementById('qualitySlider').value);
    
    let mimeType = 'image/png';
    if (format === 'jpg' || format === 'jpeg') mimeType = 'image/jpeg';
    if (format === 'webp') mimeType = 'image/webp';
    
    const link = document.createElement('a');
    link.download = `thumbnail-${Date.now()}.${format}`;
    link.href = canvas.toDataURL(mimeType, quality);
    link.click();
}

// Initialize on load
window.addEventListener('DOMContentLoaded', init);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
            e.preventDefault();
            downloadThumbnail();
        }
        if (e.key === 'z') {
            e.preventDefault();
            // Undo functionality could be added here
        }
    }
    if (e.key === 'Delete' && selectedLayer !== null) {
        layers.splice(selectedLayer, 1);
        selectedLayer = null;
        updateLayersList();
        updateCanvas();
    }
});