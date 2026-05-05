export interface Biome {
  riverWidth: number;
  bankHeight: number;
  cameraHeight: number;
  bankColor: number;
  riverColor: number;
  fogColor: number;
  fogDensity: number;
}

// 6 keyframes spanning 0–60 min (mountain → forest → village → delta → sea)
const KEYFRAMES: Array<{ minute: number } & Biome> = [
  { minute:  0, riverWidth:  14, bankHeight: 50, cameraHeight: 7.5, bankColor: 0x2d3d25, riverColor: 0x0f2535, fogColor: 0x6a8898, fogDensity: 0.011 },
  { minute: 10, riverWidth:  28, bankHeight: 28, cameraHeight: 6.0, bankColor: 0x3a6030, riverColor: 0x1a4858, fogColor: 0x60a080, fogDensity: 0.008 },
  { minute: 25, riverWidth:  48, bankHeight: 12, cameraHeight: 4.5, bankColor: 0x5a7848, riverColor: 0x206070, fogColor: 0x80a8b8, fogDensity: 0.006 },
  { minute: 40, riverWidth:  80, bankHeight:  4, cameraHeight: 3.2, bankColor: 0x789060, riverColor: 0x1870a8, fogColor: 0x90b8c8, fogDensity: 0.004 },
  { minute: 55, riverWidth: 115, bankHeight:  1, cameraHeight: 2.5, bankColor: 0x90a870, riverColor: 0x0860a0, fogColor: 0xa0c8d8, fogDensity: 0.003 },
  { minute: 60, riverWidth: 150, bankHeight:  0, cameraHeight: 2.0, bankColor: 0xa0b878, riverColor: 0x0050a0, fogColor: 0xb0d0e0, fogDensity: 0.002 },
];

const lerpColor = (a: number, b: number, t: number): number => {
  const ar = (a >>> 16) & 0xff, ag = (a >>> 8) & 0xff, ab = a & 0xff;
  const br = (b >>> 16) & 0xff, bg = (b >>> 8) & 0xff, bb = b & 0xff;
  return (
    (Math.round(ar + (br - ar) * t) << 16) |
    (Math.round(ag + (bg - ag) * t) << 8) |
     Math.round(ab + (bb - ab) * t)
  );
};

export const getBiome = (minutes: number): Biome => {
  const m = Math.max(0, Math.min(60, minutes));
  let lo = KEYFRAMES[0];
  let hi = KEYFRAMES[1];
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    lo = KEYFRAMES[i];
    hi = KEYFRAMES[i + 1];
    if (m <= hi.minute) break;
  }
  const span = hi.minute - lo.minute;
  const t    = span === 0 ? 0 : (m - lo.minute) / span;
  return {
    riverWidth:   lo.riverWidth   + (hi.riverWidth   - lo.riverWidth)   * t,
    bankHeight:   lo.bankHeight   + (hi.bankHeight   - lo.bankHeight)   * t,
    cameraHeight: lo.cameraHeight + (hi.cameraHeight - lo.cameraHeight) * t,
    bankColor:    lerpColor(lo.bankColor,  hi.bankColor,  t),
    riverColor:   lerpColor(lo.riverColor, hi.riverColor, t),
    fogColor:     lerpColor(lo.fogColor,   hi.fogColor,   t),
    fogDensity:   lo.fogDensity   + (hi.fogDensity   - lo.fogDensity)   * t,
  };
};

export const getBiomeName = (minutes: number): string => {
  if (minutes <  10) return 'mountain';
  if (minutes <  25) return 'forest';
  if (minutes <  40) return 'village';
  if (minutes <  55) return 'delta';
  return 'sea';
};
