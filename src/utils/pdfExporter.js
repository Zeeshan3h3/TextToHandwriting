import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
/**
 * Export an array of paper DOM elements to a multi-page A4 PDF.
 * @param {HTMLElement[]} paperElements  - Array of raw DOM elements (not refs)
 * @param {string}        filename
 * @param {Function}      onProgress     - Called with string message or null when done
 */
export async function exportToPDF(
  paperElements,
  filename = 'handwritten-notes.pdf',
  onProgress
) {
  // Wait for all web fonts to finish loading
  await document.fonts.ready;

  // Extra delay so the final paint is complete
  await new Promise(resolve => setTimeout(resolve, 400));

  const validElements = (paperElements || []).filter(el => el instanceof HTMLElement);

  if (validElements.length === 0) {
    throw new Error('No paper pages found to export. Try typing some text first.');
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  for (let i = 0; i < validElements.length; i++) {
    if (onProgress) onProgress(`Rendering page ${i + 1} of ${validElements.length}...`);

    const element = validElements[i];

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#fafaf8',
      logging: false,
      width: 794,
      height: 1123,
      windowWidth: 794,
      windowHeight: 1123,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.92);

    if (i > 0) {
      pdf.addPage('a4', 'portrait');
    }

    // Fill the entire A4 page (210mm × 297mm)
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
  }

  pdf.save(filename);
  if (onProgress) onProgress(null);
}
