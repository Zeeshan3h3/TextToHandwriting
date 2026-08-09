export const PAPER_PRESETS = [
  {
    id: 'ruled',
    name: 'College Ruled',
    description: 'Blue lines with red margin',
    backgroundColor: '#FFFFFF',
    render: (ctx, w, h) => {
      const lineHeight = 32;
      const marginLeft = 80;

      ctx.strokeStyle = '#A4C2F4';
      ctx.lineWidth = 1;

      for (let y = 100; y < h - 40; y += lineHeight) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      ctx.strokeStyle = '#FF6B6B';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(marginLeft, 0);
      ctx.lineTo(marginLeft, h);
      ctx.stroke();
    }
  },
  {
    id: 'graph',
    name: 'Graph Paper',
    description: '5mm grid for diagrams',
    backgroundColor: '#FFFFFF',
    render: (ctx, w, h) => {
      const gridSize = 20;
      ctx.strokeStyle = '#E8E8E8';
      ctx.lineWidth = 0.5;

      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
    }
  },
  {
    id: 'four-line',
    name: 'Four-Line',
    description: 'For cursive & math (Indian schools)',
    backgroundColor: '#FFFFFF',
    render: (ctx, w, h) => {
      const lineHeight = 40;
      const groups = Math.floor((h - 100) / (lineHeight * 4));

      for (let g = 0; g < groups; g++) {
        const baseY = 100 + g * lineHeight * 4;
        ctx.strokeStyle = '#888888'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, baseY + lineHeight * 2); ctx.lineTo(w, baseY + lineHeight * 2); ctx.stroke();

        ctx.strokeStyle = '#CCCCCC';
        ctx.beginPath(); ctx.moveTo(0, baseY); ctx.lineTo(w, baseY); ctx.stroke();
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(0, baseY + lineHeight); ctx.lineTo(w, baseY + lineHeight); ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.moveTo(0, baseY + lineHeight * 3); ctx.lineTo(w, baseY + lineHeight * 3); ctx.stroke();
      }
    }
  },
  {
    id: 'vintage',
    name: 'Aged Parchment',
    description: 'Yellowed antique paper',
    backgroundColor: '#F4E8D0',
    render: (ctx, w, h) => {
      ctx.fillStyle = '#F4E8D0';
      ctx.fillRect(0, 0, w, h);

      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 15;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
      }
      ctx.putImageData(imageData, 0, 0);

      const gradient = ctx.createRadialGradient(w/2, h/2, w*0.3, w/2, h/2, w*0.7);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(139, 119, 80, 0.15)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    }
  },
  {
    id: 'blank',
    name: 'Blank White',
    description: 'Clean canvas',
    backgroundColor: '#FFFFFF',
    render: () => {}
  }
];
