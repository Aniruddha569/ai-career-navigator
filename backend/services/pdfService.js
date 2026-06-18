// backend/services/pdfService.js
// Wraps pdf-parse so controllers don't deal with file buffers directly.

const fs = require('fs');
const pdfParse = require('pdf-parse');

// Reads a PDF file from disk and returns its plain text content.
async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);

  const text = data.text.trim();

  if (!text || text.length < 50) {
    // Most likely an image-only/scanned PDF with no real text layer.
    throw new Error(
      'Could not extract readable text from this PDF. Please upload a text-based PDF resume (not a scanned image).'
    );
  }

  return text;
}

module.exports = { extractTextFromPDF };