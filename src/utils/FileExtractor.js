import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export const extractTextFromFile = async (file) => {
  const extension = file.name.split('.').pop().toLowerCase();
  
  try {
    if (extension === 'pdf') {
      return await extractFromPDF(file);
    } else if (extension === 'docx') {
      return await extractFromDOCX(file);
    } else if (extension === 'txt') {
      return await extractFromTXT(file);
    } else {
      throw new Error("Unsupported file type. Please upload a PDF, DOCX, or TXT file.");
    }
  } catch (error) {
    console.error("Error extracting text:", error);
    throw new Error("Failed to extract text from file.");
  }
};

const extractFromTXT = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

const extractFromDOCX = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

const extractFromPDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n\n';
  }
  
  return fullText.trim();
};
