export const PAGE_DIMENSIONS = {
  A4: { width: 794, height: 1123, name: 'A4', label: 'A4 (India Standard)' },
  A5: { width: 559, height: 794, name: 'A5', label: 'A5 (Notebook Size)' },
  Letter: { width: 816, height: 1056, name: 'Letter', label: 'US Letter' },
  Legal: { width: 816, height: 1344, name: 'Legal', label: 'Legal' }
};

export class PaginationEngine {
  constructor(ctx) {
    this.ctx = ctx;
  }

  paginate(
    text,
    pageSize,
    fontSize,
    lineHeight,
    leftMargin,
    topMargin,
    bottomMargin,
    headerEnabled,
    fontFamily
  ) {
    const dims = PAGE_DIMENSIONS[pageSize];
    const usableWidth = dims.width - leftMargin - 40; // 40px right margin
    const headerHeight = headerEnabled ? 120 : 0; // Account for header space
    const usableHeight = dims.height - topMargin - bottomMargin;

    this.ctx.font = `${fontSize}px ${fontFamily}`;

    const lines = text.split('\n');
    const pages = [];
    let currentPageText = [];
    let currentHeight = headerHeight; // Start with header offset if enabled for first page
    const linePixelHeight = fontSize * lineHeight;

    for (const line of lines) {
      if (!line.trim()) {
        // Empty line
        if (currentHeight + linePixelHeight > usableHeight) {
          pages.push({
            index: pages.length,
            textContent: currentPageText.join('\n'),
            images: []
          });
          currentPageText = [];
          currentHeight = 0;
        }
        currentPageText.push('');
        currentHeight += linePixelHeight;
        continue;
      }

      const wrappedLines = this.wrapLine(line, usableWidth);

      for (const wrappedLine of wrappedLines) {
        if (currentHeight + linePixelHeight > usableHeight) {
          pages.push({
            index: pages.length,
            textContent: currentPageText.join('\n'),
            images: []
          });
          currentPageText = [];
          currentHeight = 0; // Next page has no header space offset (or we handle header per page? Usually header is page 1 only)
        }

        currentPageText.push(wrappedLine);
        currentHeight += linePixelHeight;
      }
    }

    if (currentPageText.length > 0) {
      pages.push({
        index: pages.length,
        textContent: currentPageText.join('\n'),
        images: []
      });
    }

    return pages;
  }

  wrapLine(line, maxWidth) {
    if (this.ctx.measureText(line).width <= maxWidth) return [line];

    const words = line.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (this.ctx.measureText(testLine).width <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);

    return lines;
  }
}
