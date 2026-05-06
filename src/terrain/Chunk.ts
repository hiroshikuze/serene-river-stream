import * as THREE from 'three';
import type { Biome } from './biomes';
import { meanderX, meanderRight } from '../utils/meander';

export const CHUNK_LENGTH = 200;
const BANK_WIDTH  = 90;
const N_SECTIONS  = 16;  // cross-sections per chunk (~12.5u spacing)
const RIVER_SEGS  = 3;   // lateral segments across river width
const BANK_SEGS   = 5;   // lateral segments across bank width

export class Chunk {
  private readonly group  = new THREE.Group();
  private readonly meshes: THREE.Mesh[] = [];

  constructor(
    readonly index: number,
    biome: Biome,
    rng: () => number,
    scene: THREE.Scene,
  ) {
    this.addRiver(biome, rng);
    this.addBank('left',  biome, rng);
    this.addBank('right', biome, rng);
    scene.add(this.group);
  }

  private addRiver = (biome: Biome, rng: () => number): void => {
    const halfW      = biome.riverWidth / 2;
    const pos: number[] = [];
    const idx: number[] = [];

    for (let s = 0; s <= N_SECTIONS; s++) {
      const z        = -(this.index * CHUNK_LENGTH + (s / N_SECTIONS) * CHUNK_LENGTH);
      const cx       = meanderX(z);
      const [rx, rz] = meanderRight(z);
      for (let v = 0; v <= RIVER_SEGS; v++) {
        const u      = v / RIVER_SEGS - 0.5;   // −0.5 .. +0.5
        const offset = u * 2 * halfW;
        pos.push(cx + offset * rx, -0.15 - rng() * 0.1, z + offset * rz);
      }
    }

    const row = RIVER_SEGS + 1;
    for (let s = 0; s < N_SECTIONS; s++) {
      for (let v = 0; v < RIVER_SEGS; v++) {
        const a = s * row + v, b = a + 1, c = a + row, d = c + 1;
        idx.push(a, b, c, b, d, c);
      }
    }
    this.push(pos, idx, biome.riverColor);
  };

  private addBank = (side: 'left' | 'right', biome: Biome, rng: () => number): void => {
    const halfRiver  = biome.riverWidth / 2;
    const sign       = side === 'left' ? -1 : 1;
    const pos: number[] = [];
    const idx: number[] = [];

    for (let s = 0; s <= N_SECTIONS; s++) {
      const z        = -(this.index * CHUNK_LENGTH + (s / N_SECTIONS) * CHUNK_LENGTH);
      const cx       = meanderX(z);
      const [rx, rz] = meanderRight(z);
      for (let v = 0; v <= BANK_SEGS; v++) {
        const t      = v / BANK_SEGS;                    // 0 = river edge, 1 = outer
        const offset = halfRiver + t * BANK_WIDTH;
        const height = t * biome.bankHeight + (rng() * 2 - 1) * biome.bankHeight * 0.28 * t;
        pos.push(
          cx + sign * offset * rx,
          Math.max(0, height),
          z  + sign * offset * rz,
        );
      }
    }

    const row = BANK_SEGS + 1;
    for (let s = 0; s < N_SECTIONS; s++) {
      for (let v = 0; v < BANK_SEGS; v++) {
        const a = s * row + v, b = a + 1, c = a + row, d = c + 1;
        if (side === 'left') {
          idx.push(a, c, b, b, c, d);
        } else {
          idx.push(a, b, c, b, d, c);
        }
      }
    }
    this.push(pos, idx, biome.bankColor);
  };

  private push = (positions: number[], indices: number[], color: number): void => {
    const geo  = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({ color, flatShading: true }));
    this.group.add(mesh);
    this.meshes.push(mesh);
  };

  dispose = (scene: THREE.Scene): void => {
    scene.remove(this.group);
    for (const m of this.meshes) {
      m.geometry.dispose();
      (m.material as THREE.Material).dispose();
    }
    this.meshes.length = 0;
  };
}
