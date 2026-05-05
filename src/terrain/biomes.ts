export interface Biome {
  riverWidth: number;
  bankHeight: number;
  bankColor: number;
  riverColor: number;
  fogColor: number;
  fogDensity: number;
}

// Control points at journey minutes 0, 15, 30, 45, 60
const KEYFRAMES: Array<{ minute: number } & Biome> = [
  { minute:  0, riverWidth:  18, bankHeight: 38, bankColor: 0x3d5233, riverColor: 0x1a3850, fogColor: 0x7a9aaa, fogDensity: 0.009 },
  { minute: 15, riverWidth:  30, bankHeight: 22, bankColor: 0x3a6b38, riverColor: 0x1e5060, fogColor: 0x6aaa98, fogDensity: 0.007 },
  { minute: 30, riverWidth:  48, bankHeight: 12, bankColor: 0x5a8050, riverColor: 0x246878, fogColor: 0x88b0c0, fogDensity: 0.005 },
  { minute: 45, riverWidth:  70, bankHeight:  5, bankColor: 0x7a9e60, riverColor: 0x2878a0, fogColor: 0x90c0d0, fogDensity: 0.003 },
  { minute: 60, riverWidth: 120, bankHeight:  1, bankColor: 0x9ab870, riverColor: 0x1060a0, fogColor: 0xa8d0e0, fogDensity: 0.002 },
];

function lerpColor(a: number, b: number, t: number): number {
  const ar = (a >>> 16) & 0xff, ag = (a >>> 8) & 0xff, ab = a & 0xff;
  const br = (b >>> 16) & 0xff, bg = (b >>> 8) & 0xff, bb = b & 0xff;
  return (
    (Math.round(ar + (br - ar) * t) << 16) |
    (Math.round(ag + (bg - ag) * t) << 8) |
     Math.round(ab + (bb - ab) * t)
  );
}

export function getBiome(minutes: number): Biome {
  const m = Math.max(0, Math.min(60, minutes));
  let lo = KEYFRAMES[0];
  let hi = KEYFRAMES[1];
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    if (m <= KEYFRAMES[i + 1].minute) { lo = KEYFRAMES[i]; hi = KEYFRAMES[i + 1]; break; }
    lo = KEYFRAMES[i + 1]; hi = KEYFRAMES[i + 1];
  }
  const span = hi.minute - lo.minute;
  const t = span === 0 ? 0 : (m - lo.minute) / span;
  return {
    riverWidth:  lo.riverWidth  + (hi.riverWidth  - lo.riverWidth)  * t,
    bankHeight:  lo.bankHeight  + (hi.bankHeight  - lo.bankHeight)  * t,
    bankColor:   lerpColor(lo.bankColor,  hi.bankColor,  t),
    riverColor:  lerpColor(lo.riverColor, hi.riverColor, t),
    fogColor:    lerpColor(lo.fogColor,   hi.fogColor,   t),
    fogDensity:  lo.fogDensity  + (hi.fogDensity  - lo.fogDensity)  * t,
  };
}
