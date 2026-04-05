/**
 * Generate procedural paper backgrounds as base64 data URLs.
 * Supports showLines and showMargin toggles.
 */

const W = 794;
const H = 1123;

function makeCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  return canvas;
}
function drawBase(ctx, bgColor = '#fafaf8') {
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, W, H);
}
function drawRuledLines(ctx, gap = 32, color = '#bdd0e8', startY = 80) {
  ctx.strokeStyle = color; ctx.lineWidth = 0.8;
  for (let y = startY; y < H; y += gap) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
}
function drawMarginLine(ctx, x = 80, color = '#e8a0a0') {
  ctx.strokeStyle = color; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
}
function drawGrid(ctx, gap = 20, color = '#d8d8f0') {
  ctx.strokeStyle = color; ctx.lineWidth = 0.6;
  for (let y = 0; y < H; y += gap) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  for (let x = 0; x < W; x += gap) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
}

// ── Paper type generators (accept showLines / showMargin) ─────────────────────

function genFramedRuled(showLines, showMargin) {
  const canvas = makeCanvas(); const ctx = canvas.getContext('2d');
  drawBase(ctx, '#fafaf8');

  if (showLines) {
    const BORDER_X = 8;
    const BORDER_RIGHT = W - 8;
    const BORDER_TOP = 100;
    const BORDER_BOTTOM = H - 8;

    // Draw black frame
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 2;
    ctx.strokeRect(BORDER_X, BORDER_TOP, BORDER_RIGHT - BORDER_X, BORDER_BOTTOM - BORDER_TOP);

    // Draw ruled lines inside the frame
    ctx.strokeStyle = '#bdd0e8';
    ctx.lineWidth = 1;
    for (let y = BORDER_TOP + 36; y < BORDER_BOTTOM - 20; y += 36) {
      ctx.beginPath();
      ctx.moveTo(BORDER_X, y);
      ctx.lineTo(BORDER_RIGHT, y);
      ctx.stroke();
    }
  }

  if (showMargin) {
    ctx.strokeStyle = '#ff9999';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(96, 0);
    ctx.lineTo(96, H);
    ctx.stroke();
  }

  return canvas.toDataURL('image/png');
}

function genCollegeRuled(showLines, showMargin) {
  const canvas = makeCanvas(); const ctx = canvas.getContext('2d');
  drawBase(ctx, '#fafaf8');
  if (showLines) {
    drawRuledLines(ctx, 32, '#bdd0e8', 80);
    ctx.strokeStyle = '#bdd0e8'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, 60); ctx.lineTo(W, 60); ctx.stroke();
  }
  if (showMargin) drawMarginLine(ctx, 80, '#e8a0a0');
  return canvas.toDataURL('image/png');
}

function genWideRuled(showLines, showMargin) {
  const canvas = makeCanvas(); const ctx = canvas.getContext('2d');
  drawBase(ctx, '#fffef5');
  if (showLines) drawRuledLines(ctx, 44, '#bdd0e8', 88);
  if (showMargin) drawMarginLine(ctx, 80, '#e8a0a0');
  return canvas.toDataURL('image/png');
}

function genGraph(showLines) {
  const canvas = makeCanvas(); const ctx = canvas.getContext('2d');
  drawBase(ctx, '#fafaff');
  if (showLines) {
    drawGrid(ctx, 20, '#d8d8f0');
    ctx.strokeStyle = '#b0b0d8'; ctx.lineWidth = 1.0;
    for (let y = 0; y < H; y += 100) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    for (let x = 0; x < W; x += 100) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  }
  return canvas.toDataURL('image/png');
}

function genDotGrid(showLines) {
  const canvas = makeCanvas(); const ctx = canvas.getContext('2d');
  drawBase(ctx, '#fafafa');
  if (showLines) {
    ctx.fillStyle = '#b0b0c8';
    for (let y = 40; y < H; y += 28)
      for (let x = 40; x < W; x += 28) {
        ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill();
      }
  }
  return canvas.toDataURL('image/png');
}

function genCornell(showLines, showMargin) {
  const canvas = makeCanvas(); const ctx = canvas.getContext('2d');
  drawBase(ctx, '#fafaf8');
  if (showLines) drawRuledLines(ctx, 32, '#bdd0e8', 120);
  if (showMargin) {
    ctx.strokeStyle = '#e8a0a0'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(0, 100); ctx.lineTo(W, 100); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(220, 100); ctx.lineTo(220, 1060); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 1060); ctx.lineTo(W, 1060); ctx.stroke();
    ctx.fillStyle = '#c0a0a0'; ctx.font = '11px system-ui';
    ctx.fillText('CUE / KEYWORDS', 228, 94);
    ctx.fillText('NOTES', 420, 94);
    ctx.fillText('SUMMARY', 340, 1083);
  }
  return canvas.toDataURL('image/png');
}

function genBlank() {
  const canvas = makeCanvas(); const ctx = canvas.getContext('2d');
  drawBase(ctx, '#fffef8');
  for (let i = 0; i < 8000; i++) {
    const x = Math.random() * W, y = Math.random() * H, a = Math.random() * 0.04;
    ctx.fillStyle = `rgba(100,80,50,${a})`; ctx.fillRect(x, y, 1, 1);
  }
  return canvas.toDataURL('image/png');
}

// ── Paper type metadata ───────────────────────────────────────────────────────
export const PAPER_TYPES = [
  { id: 'framed-ruled', label: 'Framed Ruled', icon: '📝', lineGap: 36, firstLineY: 104, marginLeft: 100 },
  // firstLineY = firstRuleY - lineGap + 4  (baseline lands on first ruled line)
  { id: 'college-ruled', label: 'College Ruled', icon: '📓', lineGap: 32, firstLineY: 52, marginLeft: 92 },
  { id: 'wide-ruled', label: 'Wide Ruled', icon: '📒', lineGap: 44, firstLineY: 48, marginLeft: 92 },
  { id: 'graph', label: 'Graph Paper', icon: '📐', lineGap: 24, firstLineY: 16, marginLeft: 24 },
  { id: 'dot-grid', label: 'Dot Grid', icon: '⠿', lineGap: 28, firstLineY: 16, marginLeft: 40 },
  { id: 'cornell', label: 'Cornell Notes', icon: '🗒️', lineGap: 32, firstLineY: 92, marginLeft: 228 },
  { id: 'blank', label: 'Blank', icon: '📄', lineGap: 32, firstLineY: 40, marginLeft: 40 },
];

export function getPaperConfig(paperType) {
  return PAPER_TYPES.find(p => p.id === paperType) || PAPER_TYPES[0];
}

// ── Dynamic background generator ─────────────────────────────────────────────
export function generateBackground(paperType, showLines = true, showMargin = true) {
  switch (paperType) {
    case 'framed-ruled': return genFramedRuled(showLines, showMargin);
    case 'college-ruled': return genCollegeRuled(showLines, showMargin);
    case 'wide-ruled': return genWideRuled(showLines, showMargin);
    case 'graph': return genGraph(showLines);
    case 'dot-grid': return genDotGrid(showLines);
    case 'cornell': return genCornell(showLines, showMargin);
    case 'blank':
    default: return genBlank();
  }
}

// ── Static cache (used on first load) ────────────────────────────────────────
export const PAPER_BACKGROUNDS = {
  'framed-ruled': null, 'college-ruled': null, 'wide-ruled': null, 'graph': null,
  'dot-grid': null, 'cornell': null, 'blank': null,
};

export function initPaperBackgrounds(showLines = true, showMargin = true) {
  PAPER_TYPES.forEach(({ id }) => {
    PAPER_BACKGROUNDS[id] = generateBackground(id, showLines, showMargin);
  });
}
