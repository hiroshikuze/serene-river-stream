import * as THREE from 'three';
import { ChunkManager } from './terrain/ChunkManager';
import { getBiome, getBiomeName } from './terrain/biomes';
import { Lighting } from './systems/Lighting';
import { Audio } from './systems/Audio';
import { Controls } from './ui/Controls';
import { fbmCentered } from './utils/noise';

// ─── Constants ───────────────────────────────────────────────────────────────
const SPEED              = 10;            // units/sec — 10 × 3600 = 36 000 units per hour
const CAM_PITCH          = -0.06;         // base downward tilt (radians)
const NIGHT_FOG          = new THREE.Color(0x0a0d1a);
const WHITEOUT_START_SEC = 59 * 60;       // 59 min into the hour

// ─── Clock-sync journey ──────────────────────────────────────────────────────
// Returns seconds elapsed within the current wall-clock hour (0–3599.xxx).
// Camera position is deterministic: opening at 3:58 starts near sea.
const journeyElapsed = (): number => {
  const now = new Date();
  return now.getMinutes() * 60 + now.getSeconds() + now.getMilliseconds() / 1000;
};

// ─── Renderer ────────────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: false }); // no AA → PS1 crispness
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
document.body.appendChild(renderer.domElement);

// ─── Scene ───────────────────────────────────────────────────────────────────
const scene = new THREE.Scene();
scene.fog   = new THREE.FogExp2(0x6a8898, 0.011);

// ─── Camera ──────────────────────────────────────────────────────────────────
const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.5, 700);
camera.rotation.order = 'YXZ'; // prevent gimbal lock when applying roll

// ─── Systems ─────────────────────────────────────────────────────────────────
const chunks     = new ChunkManager();
const lighting   = new Lighting(scene);
const audio      = new Audio();
const controls   = new Controls(audio);
const whiteoutEl = document.getElementById('whiteout') as HTMLDivElement;

// ─── Resize ──────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// ─── Render Loop ─────────────────────────────────────────────────────────────
const frame = (): void => {
  requestAnimationFrame(frame);

  const elapsed = journeyElapsed();   // 0–3599.xxx seconds
  const minutes = elapsed / 60;       // 0–59.xxx minutes
  const biome   = getBiome(minutes);

  // Camera — Z from clock, Y/rotations layered with fBm noise
  camera.position.z = -elapsed * SPEED;
  camera.position.y = biome.cameraHeight + fbmCentered(elapsed * 0.18) * 0.20;
  camera.rotation.x = CAM_PITCH          + fbmCentered(elapsed * 0.12) * 0.015;
  camera.rotation.z =                      fbmCentered(elapsed * 0.07) * 0.025; // meander roll

  // Terrain lifecycle (1 spawn/frame — see ChunkManager)
  chunks.update(camera.position.z, scene);

  // Lighting (real wall clock)
  lighting.update();

  // Fog: blend biome colour toward deep navy at night
  const fogColor = new THREE.Color(biome.fogColor);
  fogColor.lerp(NIGHT_FOG, Math.max(0, 1 - lighting.dayness * 2.5));
  (scene.fog as THREE.FogExp2).color.copy(fogColor);
  (scene.fog as THREE.FogExp2).density = biome.fogDensity;
  renderer.setClearColor(fogColor);

  // Whiteout (59:00 → 60:00 — resets automatically when the hour rolls over)
  const whiteT = Math.max(0, Math.min(1, (elapsed - WHITEOUT_START_SEC) / 60));
  whiteoutEl.style.opacity = String(whiteT);

  controls.updateJourney(minutes, getBiomeName(minutes));

  renderer.render(scene, camera);
};

frame();
