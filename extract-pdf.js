#!/usr/bin/env node

/**
 * Script to extract images and text from professional_journey.pdf
 * Extracts images to public/images/ and outputs project stories to console
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function extractPDFContent() {
  const pdfPath = path.join(__dirname, 'public', 'professional_journey.pdf');
  
  if (!fs.existsSync(pdfPath)) {
    console.error(`PDF not found at: ${pdfPath}`);
    process.exit(1);
  }

  console.log('Reading PDF file...');
  const dataBuffer = fs.readFileSync(pdfPath);
  
  try {
    const pdfData = await pdfParse(dataBuffer);
    
    console.log('\n=== PDF METADATA ===');
    console.log(`Pages: ${pdfData.numpages}`);
    console.log(`Title: ${pdfData.info?.Title || 'N/A'}`);
    console.log(`Author: ${pdfData.info?.Author || 'N/A'}`);
    
    console.log('\n=== EXTRACTED TEXT ===');
    console.log('---');
    console.log(pdfData.text);
    console.log('---\n');
    
    // Save extracted text to a file
    const outputDir = path.join(__dirname, 'extracted');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(outputDir, 'extracted-text.txt'),
      pdfData.text,
      'utf-8'
    );
    
    console.log(`✅ Text extracted and saved to: ${path.join(outputDir, 'extracted-text.txt')}`);
    console.log('\n📝 Note: Image extraction requires additional tools.');
    console.log('   For images, you can:');
    console.log('   1. Use a PDF viewer to export images manually');
    console.log('   2. Use online tools like https://www.ilovepdf.com/pdf_to_jpg');
    console.log('   3. Install poppler: brew install poppler (macOS)');
    console.log('   4. Then run: pdfimages public/professional_journey.pdf extracted/images');
    
  } catch (error) {
    console.error('Error parsing PDF:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

extractPDFContent();
