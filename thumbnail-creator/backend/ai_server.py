#!/usr/bin/env python3
"""
AI Thumbnail Generation Server
Local backend for generating AI-powered thumbnails
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
import base64
import requests
from PIL import Image, ImageDraw, ImageFont
import io
import json

app = Flask(__name__)
CORS(app)

# Configuration
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')

class ThumbnailGenerator:
    def __init__(self):
        self.openai_client = None
        if OPENAI_API_KEY:
            self.openai_client = openai.OpenAI(api_key=OPENAI_API_KEY)
    
    def generate_with_dalle(self, prompt, size="1024x1024"):
        """Generate image using DALL-E 3"""
        if not self.openai_client:
            return {"error": "OpenAI API key not configured"}
        
        try:
            response = self.openai_client.images.generate(
                model="dall-e-3",
                prompt=f"Create a YouTube thumbnail: {prompt}. Professional, eye-catching, high contrast, bold text-friendly background.",
                size=size,
                quality="standard",
                n=1,
            )
            
            return {
                "success": True,
                "url": response.data[0].url,
                "revised_prompt": response.data[0].revised_prompt
            }
        except Exception as e:
            return {"error": str(e)}
    
    def generate_template(self, prompt, width=1280, height=720):
        """Generate a thumbnail template based on prompt"""
        
        # Parse prompt for keywords
        lower_prompt = prompt.lower()
        
        # Determine colors
        colors = self._extract_colors(lower_prompt)
        
        # Determine layout
        layout = self._determine_layout(lower_prompt)
        
        # Generate elements
        elements = self._generate_elements(lower_prompt, width, height)
        
        return {
            "success": True,
            "template": {
                "background": colors["background"],
                "text_color": colors["text"],
                "accent_color": colors["accent"],
                "layout": layout,
                "elements": elements,
                "suggested_text": self._suggest_text(lower_prompt)
            }
        }
    
    def _extract_colors(self, prompt):
        """Extract color scheme from prompt"""
        color_map = {
            'blue': {'background': ['#1e3a8a', '#3b82f6'], 'text': '#ffffff', 'accent': '#60a5fa'},
            'red': {'background': ['#7f1d1d', '#ef4444'], 'text': '#ffffff', 'accent': '#f87171'},
            'green': {'background': ['#14532d', '#22c55e'], 'text': '#ffffff', 'accent': '#4ade80'},
            'purple': {'background': ['#581c87', '#a855f7'], 'text': '#ffffff', 'accent': '#c084fc'},
            'orange': {'background': ['#9a3412', '#f97316'], 'text': '#ffffff', 'accent': '#fb923c'},
            'pink': {'background': ['#831843', '#ec4899'], 'text': '#ffffff', 'accent': '#f472b6'},
            'dark': {'background': ['#0f172a', '#1e293b'], 'text': '#ffffff', 'accent': '#64748b'},
            'light': {'background': ['#f8fafc', '#e2e8f0'], 'text': '#0f172a', 'accent': '#94a3b8'},
            'neon': {'background': ['#0f172a', '#1e1b4b'], 'text': '#ffffff', 'accent': '#22d3ee'},
            'gold': {'background': ['#713f12', '#eab308'], 'text': '#ffffff', 'accent': '#facc15'},
        }
        
        for color, scheme in color_map.items():
            if color in prompt:
                return scheme
        
        # Default gradient
        return {
            'background': ['#6366f1', '#ec4899'],
            'text': '#ffffff',
            'accent': '#fbbf24'
        }
    
    def _determine_layout(self, prompt):
        """Determine best layout based on prompt"""
        if 'split' in prompt or 'before' in prompt or 'after' in prompt:
            return 'split'
        elif 'minimal' in prompt or 'simple' in prompt:
            return 'minimal'
        elif 'bold' in prompt or 'big text' in prompt:
            return 'bold_text'
        elif 'center' in prompt:
            return 'centered'
        else:
            return 'standard'
    
    def _generate_elements(self, prompt, width, height):
        """Generate design elements"""
        elements = []
        
        # Add shapes based on prompt
        if 'circle' in prompt or 'round' in prompt:
            elements.append({
                'type': 'circle',
                'x': width * 0.8,
                'y': height * 0.2,
                'radius': min(width, height) * 0.15,
                'color': 'rgba(255,255,255,0.1)'
            })
        
        if 'square' in prompt or 'box' in prompt:
            elements.append({
                'type': 'rect',
                'x': width * 0.1,
                'y': height * 0.1,
                'width': width * 0.2,
                'height': height * 0.2,
                'color': 'rgba(255,255,255,0.1)'
            })
        
        if 'arrow' in prompt:
            elements.append({
                'type': 'arrow',
                'x': width * 0.5,
                'y': height * 0.7,
                'direction': 'down',
                'color': '#fbbf24'
            })
        
        return elements
    
    def _suggest_text(self, prompt):
        """Suggest text based on prompt"""
        # Extract key topics
        topics = []
        words = prompt.split()
        
        # Common video topics
        topic_keywords = {
            'review': 'HONEST REVIEW',
            'tutorial': 'HOW TO',
            'guide': 'COMPLETE GUIDE',
            'tips': 'TOP TIPS',
            'tricks': 'SECRET TRICKS',
            'vs': 'VS',
            'comparison': 'BATTLE',
            'unboxing': 'UNBOXING',
            'reaction': 'REACTION',
            'challenge': 'CHALLENGE',
        }
        
        for keyword, suggestion in topic_keywords.items():
            if keyword in prompt:
                return suggestion
        
        return 'WATCH THIS'
    
    def create_thumbnail_image(self, template_data, width=1280, height=720):
        """Create actual thumbnail image from template"""
        
        # Create image
        img = Image.new('RGB', (width, height), '#0f172a')
        draw = ImageDraw.Draw(img)
        
        # Draw gradient background
        bg_colors = template_data.get('background', ['#6366f1', '#ec4899'])
        self._draw_gradient(draw, width, height, bg_colors)
        
        # Draw elements
        for element in template_data.get('elements', []):
            if element['type'] == 'circle':
                x, y, r = element['x'], element['y'], element['radius']
                draw.ellipse([x-r, y-r, x+r, y+r], fill=element['color'])
            elif element['type'] == 'rect':
                x, y, w, h = element['x'], element['y'], element['width'], element['height']
                draw.rectangle([x, y, x+w, y+h], fill=element['color'])
        
        return img
    
    def _draw_gradient(self, draw, width, height, colors):
        """Draw gradient background"""
        for y in range(height):
            ratio = y / height
            r = int(int(colors[0][1:3], 16) * (1-ratio) + int(colors[1][1:3], 16) * ratio)
            g = int(int(colors[0][3:5], 16) * (1-ratio) + int(colors[1][3:5], 16) * ratio)
            b = int(int(colors[0][5:7], 16) * (1-ratio) + int(colors[1][5:7], 16) * ratio)
            draw.line([(0, y), (width, y)], fill=(r, g, b))

# Initialize generator
generator = ThumbnailGenerator()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "ai_available": generator.openai_client is not None})

@app.route('/api/generate-template', methods=['POST'])
def generate_template():
    data = request.json
    prompt = data.get('prompt', '')
    width = data.get('width', 1280)
    height = data.get('height', 720)
    
    result = generator.generate_template(prompt, width, height)
    return jsonify(result)

@app.route('/api/generate-image', methods=['POST'])
def generate_image():
    data = request.json
    prompt = data.get('prompt', '')
    size = data.get('size', '1024x1024')
    
    result = generator.generate_with_dalle(prompt, size)
    return jsonify(result)

@app.route('/api/create-thumbnail', methods=['POST'])
def create_thumbnail():
    data = request.json
    template_data = data.get('template', {})
    width = data.get('width', 1280)
    height = data.get('height', 720)
    
    try:
        img = generator.create_thumbnail_image(template_data, width, height)
        
        # Convert to base64
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        return jsonify({
            "success": True,
            "image": f"data:image/png;base64,{img_str}"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🎨 AI Thumbnail Generator Server")
    print("=" * 40)
    print(f"OpenAI API: {'✅ Configured' if OPENAI_API_KEY else '❌ Not configured'}")
    print("\nStarting server on http://localhost:5000")
    print("Press Ctrl+C to stop")
    print("=" * 40)
    
    app.run(host='0.0.0.0', port=5000, debug=True)