# PDF Extraction Guide

To extract images and text from `professional_journey.pdf`, you have several options:

## Option 1: Manual Extraction (Easiest)

1. **Extract Images:**
   - Open `public/professional_journey.pdf` in Preview (macOS) or Adobe Reader
   - For each project image:
     - Navigate to the page with the image
     - Right-click the image → "Copy Image" or "Save Image As"
     - Save as: `public/project-1.jpg`, `public/project-2.jpg`, etc.
   - Or use an online tool: https://www.ilovepdf.com/pdf_to_jpg

2. **Extract Text/Stories:**
   - Open the PDF and copy the project stories
   - The stories should be organized by project

## Option 2: Using poppler (Command Line)

1. Install poppler:
   ```bash
   brew install poppler
   ```

2. Extract images:
   ```bash
   ./extract-images.sh
   ```
   This will create images in `extracted/images/`

3. Rename the images to match your projects:
   - `project-1.jpg` - Material Comparison Automation Tool
   - `project-2.jpg` - Rivian RPV/R1T Bumper & Fasteners
   - `project-3.jpg` - Jeep Wrangler EA Brackets
   - `project-4.jpg` - Ford F150 Electric Components

## Option 3: Using Node.js Script

Run the text extraction script:
```bash
node extract-pdf.js
```

This extracts text to `extracted/extracted-text.txt` (though it may be empty if the PDF is image-based).

## After Extraction

Once you have:
1. **Images** in the `public/` folder (named `project-1.jpg`, `project-2.jpg`, etc.)
2. **Project stories** from the PDF

I can help you update `constants.ts` to use these images and stories!

