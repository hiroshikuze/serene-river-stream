import * as THREE from 'three';
import { getSeason, type Season } from './season';
import { createRng } from '../utils/rng';

const WIND_SPEED    = 0.4;   // units/sec, positive X direction
const LOOKAHEAD_Z   = 500;   // generate up to this far ahead of camera
const KEEP_BEHIND   = 80;    // dispose when this far behind camera
const TARGET: Record<Season, number> = {
  summer: 7,
  autumn: 12,
  spring: 9,
  winter: 6,
};

interface CloudEntry {
  readonly group: THREE.Group;
  readonly meshes: THREE.Mesh[];
  readonly initialX: number; // adjusted so group.x = spawnX at spawn time
  readonly spawnZ: number;
}

// ─── Geometry builders ─────────────────────────────────────────────────────────────────────────
const mat = (color: number): THREE.MeshPhongMaterial =>
  new THREE.MeshPhongMaterial({ color, flatShading: true });

// 夏：入道雲 — SphereGeometry をピラミッド状に積む
const buildCumulonimbus = (rng: () => number): { group: THREE.Group; meshes: THREE.Mesh[] } => {
  const group  = new THREE.Group();
  const meshes: THREE.Mesh[] = [];
  const m      = mat(0xf4f4f4);
  const LEVELS = 4;

  for (let lv = 0; lv < LEVELS; lv++) {
    const cols   = LEVELS - lv + 1;
    const radius = (LEVELS - lv) * 4.5 + rng() * 3 + 2;
    for (let j = 0; j < cols; j++) {
      const geo  = new THREE.SphereGeometry(radius, 5, 4);
      const mesh = new THREE.Mesh(geo, m);
      mesh.position.set(
        (j - cols / 2 + 0.5) * radius * 1.35 + (rng() - 0.5) * radius * 0.4,
        lv * radius * 1.05  + (rng() - 0.5) * radius * 0.25,
        (rng() - 0.5) * radius * 0.7,
      );
      group.add(mesh);
      meshes.push(mesh);
    }
  }
  return { group, meshes };
};

// 秋：いわし雲 — 小さな扁平 Box をグリッド状に多数
const buildCirrocumulus = (rng: () => number): { group: THREE.Group; meshes: THREE.Mesh[] } => {
  const group  = new THREE.Group();
  const meshes: THREE.Mesh[] = [];
  const m      = mat(0xeeeef2);
  const COLS = 7, ROWS = 4, GAP = 15;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const geo  = new THREE.BoxGeometry(9 + rng() * 5, 1.5 + rng() * 0.8, 5 + rng() * 3);
      const mesh = new THREE.Mesh(geo, m);
      mesh.position.set(
        (col - COLS / 2) * GAP + (rng() - 0.5) * 4,
        (rng() - 0.5) * 4,
        (row - ROWS / 2) * GAP + (rng() - 0.5) * 4,
      );
      group.add(mesh);
      meshes.push(mesh);
    }
  }
  return { group, meshes };
};

// 春・冬：層雲 — 横長 Box をまばらに
const buildStratus = (rng: () => number, winter: boolean): { group: THREE.Group; meshes: THREE.Mesh[] } => {
  const group  = new THREE.Group();
  const meshes: THREE.Mesh[] = [];
  const m      = mat(winter ? 0xd0d8e4 : 0xf8f8f8);
  const count  = 3 + Math.floor(rng() * 3);

  for (let i = 0; i < count; i++) {
    const geo  = new THREE.BoxGeometry(24 + rng() * 30, 3 + rng() * 3, 12 + rng() * 12);
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set((rng() - 0.5) * 40, (rng() - 0.5) * 5, (rng() - 0.5) * 28);
    group.add(mesh);
    meshes.push(mesh);
  }
  return { group, meshes };
};

// ─── CloudManager ──────────────────────────────────────────────────────────────────────────
export class CloudManager {
  private readonly clouds: CloudEntry[] = [];
  private seed = 1;

  update = (cameraZ: number, scene: THREE.Scene): void => {
    const season     = getSeason();
    const windOffset = (performance.now() / 1000) * WIND_SPEED;

    // Cull clouds that have drifted behind the camera
    for (let i = this.clouds.length - 1; i >= 0; i--) {
      if (this.clouds[i].spawnZ > cameraZ + KEEP_BEHIND) {
        this.disposeEntry(this.clouds[i], scene);
        this.clouds.splice(i, 1);
      }
    }

    // Spawn at most 1 new cloud group per frame
    if (this.clouds.length < TARGET[season]) {
      const rng    = createRng((this.seed++ * 0x45d9f3b) >>> 0);
      const spawnZ = cameraZ - 20 - rng() * LOOKAHEAD_Z;

      // Summer: push to far left/right for dramatic backdrop
      const x = season === 'summer'
        ? (rng() > 0.5 ? 1 : -1) * (160 + rng() * 120)
        : (rng() * 2 - 1) * 260;

      const y = season === 'autumn'
        ? 65 + rng() * 25          // いわし雲は高高度
        : 32 + rng() * 20;

      const { group, meshes } = this.build(season, rng);
      group.position.set(x, y, spawnZ);
      scene.add(group);

      // initialX adjusted so current wind offset is already baked in at spawn
      this.clouds.push({ group, meshes, initialX: x - windOffset, spawnZ });
    }

    // Drift all clouds uniformly (wind)
    for (const c of this.clouds) {
      c.group.position.x = c.initialX + windOffset;
    }
  };

  private build = (season: Season, rng: () => number) => {
    if (season === 'summer') return buildCumulonimbus(rng);
    if (season === 'autumn') return buildCirrocumulus(rng);
    return buildStratus(rng, season === 'winter');
  };

  private disposeEntry = (c: CloudEntry, scene: THREE.Scene): void => {
    scene.remove(c.group);
    for (const m of c.meshes) {
      m.geometry.dispose();
      (m.material as THREE.Material).dispose();
    }
  };
}
