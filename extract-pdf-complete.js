#!/usr/bin/env node

/**
 * Complete PDF extraction script using pdfjs-dist
 * Extracts both text and images from professional_journey.pdf
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function extractPDFContent() {
  try {
    // Try to use pdfjs-dist if available
    let pdfjsLib;
    try {
      pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
    } catch (e) {
      // Try alternative path
      pdfjsLib = require('pdfjs-dist');
    }
    
    const pdfPath = path.join(__dirname, 'public', 'professional_journey.pdf');
    
    if (!fs.existsSync(pdfPath)) {
      console.error(`PDF not found at: ${pdfPath}`);
      process.exit(1);
    }

    console.log('Reading PDF file with pdfjs-dist...');
    const dataBuffer = fs.readFileSync(pdfPath);
    
    const loadingTask = pdfjsLib.getDocument({ data: dataBuffer });
    const pdf = await loadingTask.promise;
    
    console.log(`\n=== PDF METADATA ===`);
    console.log(`Pages: ${pdf.numPages}`);
    
    const outputDir = path.join(__dirname, 'extracted');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const imagesDir = path.join(outputDir, 'images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    let allText = '';
    const imagePromises = [];
    
    // Extract text and images from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      console.log(`Processing page ${pageNum}/${pdf.numPages}...`);
      const page = await pdf.getPage(pageNum);
      
      // Extract text
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      allText += `\n\n=== PAGE ${pageNum} ===\n${pageText}`;
      
      // Extract images
      const operatorList = await page.getOperatorList();
      for (let i = 0; i < operatorList.fnArray.length; i++) {
        if (operatorList.fnArray[i] === pdfjsLib.OPS.paintImageXObject) {
          const imgName = operatorList.argsArray[i][0];
          const image = await page.objs.get(imgName);
          if (image) {
            const imagePath = path.join(imagesDir, `page-${pageNum}-img-${i}.png`);
            fs.writeFileSync(imagePath, image.data);
            console.log(`  Extracted image: ${imagePath}`);
          }
        }
      }
    }
    
    // Save extracted text
    fs.writeFileSync(
      path.join(outputDir, 'extracted-text.txt'),
      allText,
      'utf-8'
    );
    
    console.log(`\n✅ Text extracted and saved to: ${path.join(outputDir, 'extracted-text.txt')}`);
    console.log(`✅ Images extracted to: ${imagesDir}`);
    console.log(`\n📋 Summary:`);
    console.log(`   - Pages processed: ${pdf.numPages}`);
    console.log(`   - Text length: ${allText.length} characters`);
    console.log(`   - Images found: ${fs.readdirSync(imagesDir).length} files`);
    
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND' && error.message.includes('pdfjs-dist')) {
      console.error('pdfjs-dist not found. Installing...');
      console.error('Please run: npm install pdfjs-dist --save-dev');
      console.error('\nAlternatively, you can:');
      console.error('1. Install poppler: brew install poppler');
      console.error('2. Run: ./extract-images.sh');
      console.error('3. Or manually extract images from the PDF using a PDF viewer');
    } else {
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
}

extractPDFContent();

