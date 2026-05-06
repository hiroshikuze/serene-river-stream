import { fbm } from './noise';

const SPEED = 10; // units/sec — must match main.ts

/**
 * Returns the river-centre X offset at world-Z position z.
 * Amplitude and bend-frequency taper from mountain (z≈0) to sea (z≈−36000).
 * Pure function of z: identical result for camera and chunk lookups.
 */
export const meanderX = (z: number): number => {
  const minutes = Math.max(0, Math.min(60, -z / (SPEED * 60)));
  const t       = minutes / 60;                  // 0 = mountain, 1 = sea
  const amp     = 39 * (1 - t) + 1;             // 39u → 1u
  const freq    = 0.008 * (1 - t) + 0.0025;     // short bends → long bends
  // Secondary layer at 2.7× frequency prevents long straight sections
  const primary = (fbm(-z * freq        + 50.0) - 0.5) * 2.0 * amp;
  const detail  = (fbm(-z * freq * 2.7  + 30.0) - 0.5) * 2.0 * amp * 0.30;
  return primary + detail;
};

/**
 * Returns the right-perpendicular direction [rx, rz] in the XZ plane at world-Z z.
 * "Right" is defined looking downstream (toward −Z).
 * Derived by numerically differentiating meanderX and rotating 90° CW.
 */
export const meanderRight = (z: number): [number, number] => {
  const δ   = 2.0;
  const dx  = meanderX(z + δ) - meanderX(z - δ);
  const dz  = 2.0 * δ;
  const len = Math.sqrt(dx * dx + dz * dz);
  return [dz / len, -dx / len];
};
