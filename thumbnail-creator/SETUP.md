# 🚀 Quick Setup Guide

## Option 1: Basic (Frontend Only)
Just open `index.html` in your browser. That's it!

```bash
# Navigate to the folder
cd /root/.openclaw/workspace/thumbnail-creator

# Open in browser (Linux)
xdg-open index.html

# Or on Mac
open index.html

# Or simply double-click index.html
```

## Option 2: With AI Backend (Recommended)

### Step 1: Install Python dependencies
```bash
cd /root/.openclaw/workspace/thumbnail-creator/backend

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Add your OpenAI API key (optional)
```bash
export OPENAI_API_KEY="your-key-here"
```

### Step 3: Start everything
```bash
# From the thumbnail-creator directory
./start.sh --with-ai

# Or manually:
python backend/ai_server.py &
xdg-open index.html
```

## 🎯 How to Use

### Creating a Thumbnail

1. **Choose a Size**: Click YouTube, Instagram, TikTok, etc.
2. **Pick a Template**: Select from the sidebar or start blank
3. **Add Text**: Type in the headline/subheadline fields
4. **Customize Colors**: Click color swatches to change
5. **Change Font**: Select from the font options
6. **Add Elements**: Upload images or add shapes
7. **Download**: Click the Download button

### Using AI Generation

1. Type a description in the AI box (e.g., "A vibrant tech review thumbnail with blue background")
2. Click "Generate Thumbnail"
3. The AI will create a custom design based on your description

### Keyboard Shortcuts

- `Ctrl+S` - Download thumbnail
- `Delete` - Remove selected layer
- `Double-click text` - Edit text inline

## 📁 File Structure

```
thumbnail-creator/
├── index.html              # Main app (open this)
├── app.js                  # All the magic happens here
├── README.md               # Full documentation
├── SETUP.md                # This file
├── start.sh                # Quick start script
├── templates/
│   └── templates.js        # Extended template library
├── backend/
│   ├── ai_server.py        # Python AI backend
│   └── requirements.txt    # Python dependencies
└── assets/                 # Your images go here
```

## 🎨 Features You Can Use Right Now

✅ **Visual Editor** - Drag and drop interface
✅ **6 Built-in Templates** - Ready to customize
✅ **4 Canvas Sizes** - YouTube, Shorts, Instagram, TikTok
✅ **Custom Fonts** - Bold, readable fonts that pop
✅ **Gradient Backgrounds** - Eye-catching color combinations
✅ **Layer System** - Manage multiple elements
✅ **Export** - PNG, JPG, WebP formats
✅ **AI Templates** - Smart generation based on prompts

## 🔮 Coming Soon (If You Want)

- DALL-E 3 integration for AI-generated backgrounds
- More templates (gaming, business, lifestyle)
- Text effects (outlines, shadows, gradients)
- Shape library (arrows, badges, icons)
- Undo/redo system
- Save/load projects

## 💡 Pro Tips

1. **Contrast is Key**: Use dark text on light backgrounds (or vice versa)
2. **Keep it Simple**: 2-3 elements max for clarity
3. **Big Text**: Make sure it's readable at small sizes
4. **Test at 200px**: That's how big it appears on YouTube
5. **Faces Work**: If using photos, faces get more clicks

## 🆘 Troubleshooting

**Canvas not showing?**
- Check browser console for errors
- Try refreshing the page

**Download not working?**
- Make sure you've allowed popups
- Try a different browser

**AI not generating?**
- Backend needs to be running
- Check that OpenAI API key is set (optional)

---

**Questions?** You built this with me - we can fix anything! 🎨