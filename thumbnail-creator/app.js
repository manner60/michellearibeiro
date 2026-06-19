// Michelle's AI Thumbnail Creator - Main Application
const canvas = document.getElementById('thumbnail-canvas');
const ctx = canvas.getContext('2d');

// State
let currentTemplate = 'blank';
let currentSize = 'youtube';
let currentBgColor = 'gradient1';
let currentTextColor = '#ffffff';
let currentFont = 'Oswald';
let layers = [];

// Configuration
const sizes = {
    youtube: { w: 1280, h: 720 },
    'youtube-short': { w: 1080, h: 1920 },
    instagram: { w: 1080, h: 1080 },
    tiktok: { w: 1080, h: 1920 }
};

const templates = {
    blank: { background: 'gradient1', elements: [] },
    gradient: { 
        background: 'gradient1', 
        elements: [
            { type: 'text', text: 'YOUR TITLE', x: 640, y: 300, fontSize: 80, font: 'Oswald', color: '#fff', align: 'center' }
        ] 
    },
    'bold-text': { 
        background: '#0f172a', 
        elements: [
            { type: 'text', text: 'WOW!', x: 640, y: 360, fontSize: 120, font: 'Bebas Neue', color: '#fbbf24', align: 'center' }
        ] 
    },
    split: { 
        background: 'gradient3', 
        elements: [
            { type: 'rect', x: 0, y: 0, w: 640, h: 720, color: 'rgba(0,0,0,0.3)' },
            { type: 'text', text: 'VS', x: 640, y: 360, fontSize: 100, font: 'Oswald', color: '#fff', align: 'center' }
        ] 
    },
    minimal: { 
        background: '#fff', 
        elements: [
            { type: 'text', text: 'Clean', x: 640, y: 360, fontSize: 70, font: 'Inter', color: '#0f172a', align: 'center' }
        ] 
    },
    vibrant: { 
        background: 'gradient4', 
        elements: [
            { type: 'circle', x: 640, y: 360, r: 200, color: 'rgba(255,255,255,0.2)' },
            { type: 'text', text: 'POP!', x: 640, y: 380, fontSize: 100, font: 'Bebas Neue', color: '#fff', align: 'center' }
        ] 
    }
};

// Initialize
function init() {
    console.log('Thumbnail Creator Initializing...');
    loadTemplate('blank');
    setupEvents();
    updateCanvas();
    console.log('Thumbnail Creator Ready!');
}

// Event Listeners
function setupEvents() {
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
    document.querySelectorAll('#bgColors .color-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('#bgColors .color-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            currentBgColor = opt.dataset.color;
            updateCanvas();
        });
    });

    // Text colors
    document.querySelectorAll('#textColors .color-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('#textColors .color-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            currentTextColor = opt.dataset.color;
            updateCanvas();
        });
    });

    // Font selection
    document.querySelectorAll('#fontSelector .font-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('#fontSelector .font-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            currentFont = opt.dataset.font;
            updateCanvas();
        });
    });

    // Text inputs
    document.getElementById('headlineText').addEventListener('input', updateCanvas);
    document.getElementById('subheadlineText').addEventListener('input', updateCanvas);

    // Image upload
    document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
}

// Load template
function loadTemplate(name) {
    currentTemplate = name;
    const t = templates[name];
    if (t.background) {
        currentBgColor = t.background;
        document.querySelectorAll('#bgColors .color-option').forEach(o => {
            o.classList.toggle('active', o.dataset.color === t.background);
        });
    }
    layers = t.elements ? [...t.elements] : [];
    updateCanvas();
}

// Change canvas size
function changeSize(name) {
    currentSize = name;
    const s = sizes[name];
    canvas.width = s.w;
    canvas.height = s.h;
    updateCanvas();
}

// Update canvas
function updateCanvas() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    const grads = {
        gradient1: ['#6366f1', '#ec4899'],
        gradient2: ['#f59e0b', '#ef4444'],
        gradient3: ['#10b981', '#3b82f6'],
        gradient4: ['#8b5cf6', '#ec4899']
    };
    
    if (grads[currentBgColor]) {
        const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        g.addColorStop(0, grads[currentBgColor][0]);
        g.addColorStop(1, grads[currentBgColor][1]);
        ctx.fillStyle = g;
    } else {
        ctx.fillStyle = currentBgColor;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw layers
    layers.forEach(layer => drawLayer(layer));

    // Draw text inputs for blank template
    if (currentTemplate === 'blank') {
        drawTextInputs();
    }
}

// Draw individual layer
function drawLayer(layer) {
    if (layer.type === 'text') {
        ctx.font = 'bold ' + layer.fontSize + 'px "' + layer.font + '"';
        ctx.fillStyle = layer.color;
        ctx.textAlign = layer.align || 'left';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 10;
        ctx.fillText(layer.text, layer.x, layer.y);
        ctx.shadowColor = 'transparent';
    } else if (layer.type === 'rect') {
        ctx.fillStyle = layer.color;
        ctx.fillRect(layer.x, layer.y, layer.w, layer.h);
    } else if (layer.type === 'circle') {
        ctx.beginPath();
        ctx.arc(layer.x, layer.y, layer.r, 0, Math.PI * 2);
        ctx.fillStyle = layer.color;
        ctx.fill();
    } else if (layer.type === 'image' && layer.img) {
        ctx.drawImage(layer.img, layer.x, layer.y, layer.w || layer.img.width, layer.h || layer.img.height);
    }
}

// Draw text from inputs
function drawTextInputs() {
    const h = document.getElementById('headlineText').value;
    const s = document.getElementById('subheadlineText').value;

    if (h) {
        ctx.font = 'bold 80px "' + currentFont + '"';
        ctx.fillStyle = currentTextColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 20;
        ctx.fillText(h, canvas.width / 2, canvas.height / 2 - 50);
        ctx.shadowColor = 'transparent';
    }

    if (s) {
        ctx.font = '500 40px "Inter"';
        ctx.fillStyle = currentTextColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 10;
        ctx.fillText(s, canvas.width / 2, canvas.height / 2 + 50);
        ctx.shadowColor = 'transparent';
    }
}

// Handle image upload
function handleImageUpload(e) {
    const f = e.target.files[0];
    if (f) {
        const r = new FileReader();
        r.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
                const scale = Math.min(canvas.width / img.width, canvas.height / img.height, 1);
                layers.push({
                    type: 'image',
                    img: img,
                    x: (canvas.width - img.width * scale) / 2,
                    y: (canvas.height - img.height * scale) / 2,
                    w: img.width * scale,
                    h: img.height * scale
                });
                updateCanvas();
            };
            img.src = ev.target.result;
        };
        r.readAsDataURL(f);
    }
}

// Clear canvas
function clearCanvas() {
    if (confirm('Clear all?')) {
        layers = [];
        updateCanvas();
    }
}

// AI Generation
function generateWithAI() {
    const p = document.getElementById('aiPrompt').value;
    if (!p) {
        alert('Enter a description');
        return;
    }

    const lp = p.toLowerCase();
    layers = [];

    // Set background based on prompt
    if (lp.includes('blue')) currentBgColor = 'gradient3';
    else if (lp.includes('purple') || lp.includes('pink')) currentBgColor = 'gradient4';
    else if (lp.includes('orange')) currentBgColor = 'gradient2';
    else currentBgColor = 'gradient1';

    document.querySelectorAll('#bgColors .color-option').forEach(o => {
        o.classList.toggle('active', o.dataset.color === currentBgColor);
    });

    // Extract title from prompt
    let title = 'NEW VIDEO';
    const m = p.match(/(?:with|about)\s+(.+?)(?:\s+background|$)/i);
    if (m) title = m[1].toUpperCase();

    layers.push({
        type: 'text',
        text: title,
        x: canvas.width / 2,
        y: canvas.height / 2,
        fontSize: 90,
        font: 'Oswald',
        color: '#fff',
        align: 'center'
    });

    updateCanvas();
}

// Download thumbnail
function downloadThumbnail() {
    const link = document.createElement('a');
    link.download = 'thumbnail-' + Date.now() + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}