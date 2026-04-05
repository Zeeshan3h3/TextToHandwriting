export const EFFECTS = [
    { id: 'none', label: 'No Effect' },
    { id: 'shadows', label: 'Shadows' },
    { id: 'scanner', label: 'Scanner' },
];

/**
 * Apply a visual effect to a canvas after html2canvas rendering.
 * Returns a new (or the same) canvas with the effect applied.
 */
export function applyEffect(canvas, effectId) {
    if (effectId === 'none') return canvas;

    const output = document.createElement('canvas');
    output.width = canvas.width;
    output.height = canvas.height;
    const ctx = output.getContext('2d');
    ctx.drawImage(canvas, 0, 0);

    const imageData = ctx.getImageData(0, 0, output.width, output.height);
    const data = imageData.data;
    const W = output.width;
    const H = output.height;

    if (effectId === 'shadows') {
        const cx = W / 2;
        const cy = H / 2;
        const maxDist = Math.sqrt(cx * cx + cy * cy);

        for (let i = 0; i < data.length; i += 4) {
            const pixelIndex = i / 4;
            const x = pixelIndex % W;
            const y = Math.floor(pixelIndex / W);

            const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
            const vignette = (dist / maxDist) * 40;
            const noise = (Math.random() - 0.5) * 12;

            data[i] = Math.max(0, Math.min(255, data[i] - vignette + 8 + noise));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] - vignette + 4 + noise));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] - vignette - 2 + noise));
        }
    }

    if (effectId === 'scanner') {
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            const sat = 0.85;
            let nr = gray * (1 - sat) + r * sat;
            let ng = gray * (1 - sat) + g * sat;
            let nb = gray * (1 - sat) + b * sat;
            // contrast boost
            nr = Math.min(255, (nr - 128) * 1.1 + 128);
            ng = Math.min(255, (ng - 128) * 1.1 + 128);
            nb = Math.min(255, (nb - 128) * 1.1 + 128);
            // scan lines
            const y = Math.floor((i / 4) / W);
            const scanMult = y % 4 === 0 ? 0.96 : 1;
            data[i] = Math.max(0, nr * scanMult);
            data[i + 1] = Math.max(0, ng * scanMult);
            data[i + 2] = Math.max(0, nb * scanMult);
        }
    }

    ctx.putImageData(imageData, 0, 0);
    return output;
}
