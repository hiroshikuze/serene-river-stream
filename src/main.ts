import * as THREE from 'three';
import { ChunkManager } from './terrain/ChunkManager';
import { getBiome, getBiomeName } from './terrain/biomes';
import { Lighting } from './systems/Lighting';
import { Audio } from './systems/Audio';
import { Controls } from './ui/Controls';
import { CloudManager } from './sky/CloudManager';
import { getSeason, SEASON_SKY } from './sky/season';
import { fbmCentered } from './utils/noise';
import { meanderX } from './utils/meander';

// ─── Constants ───────────────────────────────────────────────────────────────
const SPEED              = 10;
const CAM_PITCH          = -0.06;
const NIGHT_FOG          = new THREE.Color(0x0a0d1a);
const WHITEOUT_START_SEC = 59 * 60;
const YAW_LAG            = 0.028; // exponential smoothing per frame (~1s delay at 60fps)

let cameraYaw = 0;

// ─── Clock-sync journey ──────────────────────────────────────────────────────
const journeyElapsed = (): number => {
  const now = new Date();
  return now.getMinutes() * 60 + now.getSeconds() + now.getMilliseconds() / 1000;
};

// ─── Renderer ────────────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
document.body.appendChild(renderer.domElement);

// ─── Scene ───────────────────────────────────────────────────────────────────
const scene = new THREE.Scene();
scene.fog   = new THREE.FogExp2(0x6a8898, 0.011);

// ─── Camera ──────────────────────────────────────────────────────────────────
const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.5, 700);
camera.rotation.order = 'YXZ';

// ─── Systems ─────────────────────────────────────────────────────────────────
const chunks     = new ChunkManager();
const cloudMgr   = new CloudManager();
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

  const elapsed = journeyElapsed();
  const minutes = elapsed / 60;
  const biome   = getBiome(minutes);

  // Camera
  camera.position.z = -elapsed * SPEED;
  camera.position.y = biome.cameraHeight + fbmCentered(elapsed * 0.18) * 0.20;

  // Meander: camera X follows river centre; yaw tracks bend direction with lag
  const xNow        = meanderX(camera.position.z);
  const xAhead      = meanderX(camera.position.z - 20);
  const targetYaw   = Math.atan2(xAhead - xNow, 20) * 0.55;
  cameraYaw        += (targetYaw - cameraYaw) * YAW_LAG;
  camera.position.x = xNow;
  camera.rotation.y = cameraYaw;

  camera.rotation.x = CAM_PITCH + fbmCentered(elapsed * 0.12) * 0.015;
  camera.rotation.z =             fbmCentered(elapsed * 0.07) * 0.025;

  // Terrain + clouds (each throttled to 1 spawn/frame)
  chunks.update(camera.position.z, scene);
  cloudMgr.update(camera.position.z, scene);

  // Lighting
  lighting.update();

  // Sky colour: biome fog → season tint (35%) → night fade
  const seasonSky = new THREE.Color(SEASON_SKY[getSeason()]);
  const skyColor  = new THREE.Color(biome.fogColor);
  skyColor.lerp(seasonSky, 0.35);
  skyColor.lerp(NIGHT_FOG, Math.max(0, 1 - lighting.dayness * 2.5));

  (scene.fog as THREE.FogExp2).color.copy(skyColor);
  (scene.fog as THREE.FogExp2).density = biome.fogDensity;
  renderer.setClearColor(skyColor);

  // Whiteout
  const whiteT = Math.max(0, Math.min(1, (elapsed - WHITEOUT_START_SEC) / 60));
  whiteoutEl.style.opacity = String(whiteT);

  controls.updateJourney(minutes, getBiomeName(minutes));

  renderer.render(scene, camera);
};

frame();
