import * as THREE from 'three';
import { ChunkManager } from './terrain/ChunkManager';
import { getBiome } from './terrain/biomes';
import { Lighting } from './systems/Lighting';
import { Audio } from './systems/Audio';
import { Controls } from './ui/Controls';

// ─── Constants ───────────────────────────────────────────────────────────────
const SPEED           = 10;   // units/sec → 10 × 3600 = 36 000 total units
const CAM_HEIGHT      = 3.5;  // metres above water surface
const CAM_PITCH       = -0.06; // radians; slight downward tilt toward river
const JOURNEY_SEC     = 3600;
const BIOME_NAMES     = ['mountain', 'mountain', 'forest', 'valley', 'plains', 'sea'];

// ─── Renderer ────────────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: false }); // no AA → PS1 edge crispness
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
document.body.appendChild(renderer.domElement);

// ─── Scene ───────────────────────────────────────────────────────────────────
const scene  = new THREE.Scene();
scene.fog    = new THREE.FogExp2(0x7a9aaa, 0.009);

// ─── Camera ──────────────────────────────────────────────────────────────────
const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.5, 700);
camera.position.set(0, CAM_HEIGHT, 0);
camera.rotation.x = CAM_PITCH;

// ─── Systems ─────────────────────────────────────────────────────────────────
const chunks   = new ChunkManager();
const lighting = new Lighting(scene);
const audio    = new Audio();
const controls = new Controls(audio);

// ─── Resize ──────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function biomeName(minutes: number): string {
  const idx = Math.min(BIOME_NAMES.length - 1, Math.floor(minutes / 12));
  return BIOME_NAMES[idx];
}

// ─── Render Loop ─────────────────────────────────────────────────────────────
const startMs = performance.now();

function frame(): void {
  requestAnimationFrame(frame);

  const elapsed = Math.min((performance.now() - startMs) / 1000, JOURNEY_SEC);
  const minutes = elapsed / 60;

  // Camera: moves −Z; slight sinusoidal bob simulates boat motion
  camera.position.z = -elapsed * SPEED;
  camera.position.y = CAM_HEIGHT + Math.sin(elapsed * 0.7) * 0.12;
  camera.rotation.x = CAM_PITCH  + Math.sin(elapsed * 0.45) * 0.015;

  // Terrain lifecycle
  chunks.update(camera.position.z, scene);

  // Lighting (real clock time)
  lighting.update();

  // Fog & clear color track current biome
  const biome = getBiome(minutes);
  (scene.fog as THREE.FogExp2).color.setHex(biome.fogColor);
  (scene.fog as THREE.FogExp2).density = biome.fogDensity;
  renderer.setClearColor(biome.fogColor);

  // HUD
  controls.updateJourney(minutes, biomeName(minutes));

  renderer.render(scene, camera);
}

frame();
