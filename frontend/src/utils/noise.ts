// 1D value noise utilities for camera motion (bob + roll)

const hash = (n: number): number => {
  let x = (((n | 0) * 1664525 + 1013904223) >>> 0);
  x = (x ^ (x >>> 16)) >>> 0;
  return x / 0x100000000;
};

const valueNoise = (x: number): number => {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3.0 - 2.0 * f); // smoothstep
  return hash(i) + (hash(i + 1) - hash(i)) * u;
};

// Fractional Brownian motion — 2 octaves, output in [~0, ~1]
export const fbm = (x: number): number =>
  valueNoise(x) * 0.667 + valueNoise(x * 2.1 + 3.7) * 0.333;

// Returns a value centred at 0, range roughly [-1, 1]
export const fbmCentered = (x: number): number => fbm(x) * 2.0 - 1.0;
