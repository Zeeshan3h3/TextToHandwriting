export const applyScannerEffect = (canvas, intensity = 0.5) => {
  const ctx = canvas.getContext('2d');
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const x = (i / 4) % canvas.width;
    const y = Math.floor((i / 4) / canvas.width);
    
    // Vignette (darker edges)
    const dx = x - canvas.width / 2;
    const dy = y - canvas.height / 2;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = Math.sqrt((canvas.width / 2) ** 2 + (canvas.height / 2) ** 2);
    const vignetteAmount = (dist / maxDist) * intensity;
    
    data[i] -= 50 * vignetteAmount;     // R
    data[i + 1] -= 50 * vignetteAmount; // G
    data[i + 2] -= 40 * vignetteAmount; // B (slightly less blue for warmth)
    
    // Random grain/noise
    const noise = (Math.random() - 0.5) * 40 * intensity;
    data[i] += noise;
    data[i + 1] += noise;
    data[i + 2] += noise;
    
    // Basic contrast boost
    const factor = (259 * (25 + 255)) / (255 * (259 - 25)); 
    data[i] = factor * (data[i] - 128) + 128;
    data[i + 1] = factor * (data[i + 1] - 128) + 128;
    data[i + 2] = factor * (data[i + 2] - 128) + 128;
  }
  
  ctx.putImageData(imgData, 0, 0);
};
