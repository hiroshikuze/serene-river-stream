import * as THREE from 'three';

// 64×64 procedural wave texture — white-to-gray so material.color provides the biome tint
const makeWaterTexture = (): THREE.CanvasTexture => {
  const S   = 64;
  const cvs = document.createElement('canvas');
  cvs.width = cvs.height = S;
  const ctx = cvs.getContext('2d')!;

  // Dark base (~30% gray)
  ctx.fillStyle = '#4a4a4a';
  ctx.fillRect(0, 0, S, S);

  // 4 wavy highlight bands
  for (let band = 0; band < 4; band++) {
    const cy = band * 16 + 8;

    // Main crest (bright)
    ctx.beginPath();
    ctx.strokeStyle = '#d0d0d0';
    ctx.lineWidth = 2;
    for (let x = 0; x <= S; x++) {
      const y = cy + Math.sin((x / S) * Math.PI * 4) * 4;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Secondary ripple (mid)
    ctx.beginPath();
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 1;
    for (let x = 0; x <= S; x++) {
      const y = cy + 6 + Math.sin((x / S) * Math.PI * 4 + 1.8) * 3;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  const tex       = new THREE.CanvasTexture(cvs);
  tex.wrapS       = tex.wrapT   = THREE.RepeatWrapping;
  tex.magFilter   = THREE.NearestFilter;  // PS1-style pixelated
  tex.minFilter   = THREE.NearestFilter;
  tex.generateMipmaps = false;
  return tex;
};

export const waterTexture = makeWaterTexture();

// Scroll upstream → downstream. Call once per frame with journey elapsed seconds.
export const tickWater = (elapsed: number): void => {
  waterTexture.offset.y = -(elapsed * 0.10) % 1;
};
