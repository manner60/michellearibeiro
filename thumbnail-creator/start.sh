#!/bin/bash

echo "🎨 Michelle's AI Thumbnail Creator"
echo "=================================="
echo ""

# Check if Python backend should start
if [ "$1" == "--with-ai" ] || [ "$1" == "-a" ]; then
    echo "Starting AI backend server..."
    cd backend
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        echo "Creating virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Install requirements
    echo "Installing dependencies..."
    pip install -q -r requirements.txt
    
    # Start server in background
    python ai_server.py &
    SERVER_PID=$!
    
    echo "✅ AI Server started on http://localhost:5000"
    echo ""
    cd ..
fi

# Open the application
echo "🚀 Opening Thumbnail Creator..."
echo ""

# Try to open in browser
if command -v xdg-open &> /dev/null; then
    xdg-open index.html
elif command -v open &> /dev/null; then
    open index.html
else
    echo "Please open index.html in your browser"
fi

echo "✨ Thumbnail Creator is ready!"
echo ""
echo "Features:"
echo "  • Visual drag-and-drop editor"
echo "  • AI-powered template generation"
echo "  • Multiple export formats"
echo "  • Custom fonts and colors"
echo ""

if [ ! -z "$SERVER_PID" ]; then
    echo "Press Ctrl+C to stop the server"
    wait $SERVER_PID
fi