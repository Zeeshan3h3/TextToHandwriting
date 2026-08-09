import jsPDF from 'jspdf';
import { PAPER_PRESETS } from '../constants/paper';
import { CharacterRandomizer, renderCharacter } from './randomizer';
import { PaginationEngine, PAGE_DIMENSIONS } from './pagination';
import { applyScannerEffect } from './scannerEffect';

const renderHeader = (ctx, fields, x, y, inkColor) => {
  ctx.save();
  ctx.font = '16px "Courier New", Courier, monospace';
  ctx.fillStyle = inkColor || '#000000';
  ctx.strokeStyle = inkColor || '#000000';
  ctx.lineWidth = 1;

  ctx.fillText(`Name: ${fields.name || ''}`, x, y);
  ctx.fillText(`Date: ${fields.date || ''}`, x + 300, y);
  ctx.fillText(`Reg No: ${fields.regNo || ''}`, x, y + 25);
  ctx.fillText(`Assignment: ${fields.assignment || ''}`, x + 300, y + 25);
  
  ctx.beginPath();
  ctx.moveTo(x, y + 40);
  ctx.lineTo(x + 600, y + 40);
  ctx.stroke();
  ctx.restore();
};

export const generateAdvancedPDF = async (text, settings, extendedConfig) => {
  const {
    pageSize,
    advancedPaperType,
    leftMargin,
    topMargin,
    bottomMargin,
    headerEnabled,
    headerFields,
    realismLevel,
    scannerEffectEnabled,
    scannerIntensity
  } = extendedConfig;

  const {
    fontSize,
    lineHeight,
    fontFamily,
    inkColor
  } = settings;

  const dims = PAGE_DIMENSIONS[pageSize] || PAGE_DIMENSIONS['A4'];
  const canvas = document.createElement('canvas');
  canvas.width = dims.width;
  canvas.height = dims.height;
  const ctx = canvas.getContext('2d');

  const engine = new PaginationEngine(ctx);
  const pages = engine.paginate(
    text,
    pageSize,
    fontSize,
    lineHeight,
    leftMargin,
    topMargin,
    bottomMargin,
    headerEnabled,
    fontFamily
  );

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [dims.width, dims.height]
  });

  const randomizer = new CharacterRandomizer(Date.now()); // New seed for every export

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    
    // Clear and draw background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const paperPreset = PAPER_PRESETS[advancedPaperType] || PAPER_PRESETS['blank'];
    paperPreset.render(ctx, dims.width, dims.height, leftMargin, topMargin, fontSize * lineHeight);

    // Set font for text drawing
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textBaseline = 'alphabetic';

    let currentY = topMargin + fontSize;
    const isFirstPage = i === 0;

    if (isFirstPage && headerEnabled) {
      renderHeader(ctx, headerFields, leftMargin, topMargin, inkColor);
      currentY += 120; // Skip space for header
    }

    const lines = page.textContent.split('\n');
    let globalCharIndex = 0; // for randomness continuity

    for (const line of lines) {
      let currentX = leftMargin;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        
        // Skip rendering spaces but advance X
        if (char === ' ') {
          currentX += ctx.measureText(char).width;
          globalCharIndex++;
          continue;
        }

        const transform = randomizer.getTransform(globalCharIndex, i, realismLevel);
        const strokeWidth = randomizer.getStrokeWidth(0.5, globalCharIndex, i, realismLevel);
        
        renderCharacter(ctx, char, currentX, currentY, fontSize, fontFamily, transform, strokeWidth, inkColor);
        
        // Advance cursor
        const charWidth = ctx.measureText(char).width;
        currentX += charWidth + transform.x + 1;
        globalCharIndex++;
      }
      currentY += fontSize * lineHeight;
    }

    if (scannerEffectEnabled) {
      applyScannerEffect(canvas, scannerIntensity / 100);
    }

    // Add canvas to PDF
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData, 'JPEG', 0, 0, dims.width, dims.height);

    if (i < pages.length - 1) {
      pdf.addPage([dims.width, dims.height], 'portrait');
    }
  }

  pdf.save('assignment.pdf');
};
