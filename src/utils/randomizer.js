class PerlinNoise {
  constructor() {
    this.permutation = [];
    for (let i = 0; i < 256; i++) this.permutation[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.permutation[i], this.permutation[j]] = [this.permutation[j], this.permutation[i]];
    }
    this.permutation = [...this.permutation, ...this.permutation];
  }

  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  lerp(t, a, b) {
    return a + t * (b - a);
  }

  grad(hash, x, y) {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise(x, y) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = this.fade(xf);
    const v = this.fade(yf);

    const p = this.permutation;
    const aa = p[p[X] + Y];
    const ab = p[p[X] + Y + 1];
    const ba = p[p[X + 1] + Y];
    const bb = p[p[X + 1] + Y + 1];

    return this.lerp(v,
      this.lerp(u, this.grad(aa, xf, yf), this.grad(ba, xf - 1, yf)),
      this.lerp(u, this.grad(ab, xf, yf - 1), this.grad(bb, xf - 1, yf - 1))
    );
  }
}

export class CharacterRandomizer {
  constructor(seed = Date.now()) {
    this.perlin = new PerlinNoise();
    this.seed = seed;
  }

  reseed(seed = Date.now()) {
    this.seed = seed;
    this.perlin = new PerlinNoise();
  }

  getTransform(charIndex, lineIndex, realismLevel) {
    const intensity = realismLevel / 100;
    const noiseX = this.perlin.noise(charIndex * 0.1 + this.seed, lineIndex * 0.05);
    const noiseY = this.perlin.noise(charIndex * 0.15 + this.seed + 100, lineIndex * 0.08);
    const noiseRot = this.perlin.noise(charIndex * 0.08 + this.seed + 200, lineIndex * 0.03);
    const noiseScale = this.perlin.noise(charIndex * 0.12 + this.seed + 300, lineIndex * 0.06);

    return {
      x: noiseX * 1.5 * intensity,
      y: noiseY * 2.0 * intensity,
      rotation: noiseRot * 3 * intensity,
      scaleX: 1 + (noiseScale * 0.08 * intensity),
      scaleY: 1 + (noiseScale * 0.05 * intensity),
      opacity: 0.85 + (Math.abs(noiseX) * 0.15 * intensity)
    };
  }

  getStrokeWidth(baseWidth, charIndex, lineIndex, realismLevel) {
    if (realismLevel < 30) return baseWidth;
    const intensity = realismLevel / 100;
    const pressureNoise = this.perlin.noise(charIndex * 0.2 + this.seed, lineIndex * 0.1 + 500);
    const wordPosition = (charIndex % 8) / 8;
    const accelerationCurve = Math.sin(wordPosition * Math.PI);
    return baseWidth * (1 + (pressureNoise * 0.3 * intensity) - (accelerationCurve * 0.15 * intensity));
  }
}

export function renderCharacter(
  ctx,
  char,
  x,
  y,
  fontSize,
  fontFamily,
  transform,
  strokeWidth,
  inkColor
) {
  ctx.save();
  ctx.translate(x + transform.x, y + transform.y);
  ctx.rotate((transform.rotation * Math.PI) / 180);
  ctx.scale(transform.scaleX, transform.scaleY);
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = inkColor;
  ctx.globalAlpha = transform.opacity;

  if (strokeWidth > 0) {
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = strokeWidth;
    ctx.strokeText(char, 0, 0);
  }

  ctx.fillText(char, 0, 0);
  ctx.restore();
}
