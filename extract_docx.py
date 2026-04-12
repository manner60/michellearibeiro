#!/usr/bin/env python3
"""
Extract text from .docx files and format for PDF conversion
"""

import zipfile
import xml.etree.ElementTree as ET
import os
import re

def extract_text_from_docx(docx_path):
    """Extract text from a .docx file"""
    try:
        with zipfile.ZipFile(docx_path, 'r') as zip_ref:
            # Read the document.xml file
            xml_content = zip_ref.read('word/document.xml')
            
        # Parse XML
        root = ET.fromstring(xml_content)
        
        # Extract all text
        text_parts = []
        for elem in root.iter():
            if elem.text and elem.text.strip():
                text_parts.append(elem.text)
            if elem.tail and elem.tail.strip():
                text_parts.append(elem.tail)
        
        # Join and clean up text
        full_text = ' '.join(text_parts)
        # Clean up extra whitespace
        full_text = re.sub(r'\s+', ' ', full_text)
        full_text = re.sub(r' +', ' ', full_text)
        
        return full_text.strip()
    except Exception as e:
        return f"Error extracting text: {str(e)}"

# Process all 4 bonus files
files = [
    "/root/.openclaw/media/inbound/Bonus_1---aaeb9c2c-7edf-4ed7-9de6-70a6917e8062.docx",
    "/root/.openclaw/media/inbound/Bonus_3_-_The_AI_Traffic_Tsunami---b3f24e44-d08b-4e9d-a285-e2af8830e33c.docx",
    "/root/.openclaw/media/inbound/Bonus_4_-_Arbitrage---7e6c5a68-55e9-4cbd-8c19-627213cc08fb.docx",
    "/root/.openclaw/media/inbound/Bonus_5-The_Freelance_Arbitrage_Accelerator---d58329af-5577-4381-b879-52d1912596b2.docx"
]

for i, file_path in enumerate(files, 1):
    print(f"\n{'='*60}")
    print(f"BONUS {i}")
    print(f"{'='*60}")
    text = extract_text_from_docx(file_path)
    print(text[:2000] if len(text) > 2000 else text)  # Print first 2000 chars
    if len(text) > 2000:
        print(f"\n... [truncated, total length: {len(text)} chars]")
