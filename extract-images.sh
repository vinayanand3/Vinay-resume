#!/bin/bash

# Script to extract images from professional_journey.pdf using pdfimages
# Requires poppler-utils: brew install poppler (macOS)

PDF_PATH="public/professional_journey.pdf"
OUTPUT_DIR="extracted/images"

if [ ! -f "$PDF_PATH" ]; then
    echo "Error: PDF not found at $PDF_PATH"
    exit 1
fi

# Check if pdfimages is available
if ! command -v pdfimages &> /dev/null; then
    echo "Error: pdfimages not found"
    echo "Install it with: brew install poppler"
    exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "Extracting images from PDF..."
pdfimages -all "$PDF_PATH" "$OUTPUT_DIR/image"

echo "✅ Images extracted to $OUTPUT_DIR"
echo "Files created:"
ls -lh "$OUTPUT_DIR"

