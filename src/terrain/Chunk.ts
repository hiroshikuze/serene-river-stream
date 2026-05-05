import * as THREE from 'three';
import type { Biome } from './biomes';

export const CHUNK_LENGTH = 200;
const BANK_WIDTH = 90;

export class Chunk {
  private readonly group = new THREE.Group();
  private readonly meshes: THREE.Mesh[] = [];

  constructor(
    readonly index: number,
    biome: Biome,
    rng: () => number,
    scene: THREE.Scene,
    offsetX = 0,
  ) {
    this.group.position.set(offsetX, 0, -(index * CHUNK_LENGTH + CHUNK_LENGTH / 2));
    this.addRiver(biome);
    this.addBank('left', biome, rng);
    this.addBank('right', biome, rng);
    scene.add(this.group);
  }

  // PlaneGeometry in XY, rotated to lie flat in XZ; tiny Y wobble for lit-water facets
  private addRiver = (biome: Biome): void => {
    const geo = new THREE.PlaneGeometry(biome.riverWidth, CHUNK_LENGTH, 3, 8);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes['position'] as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      pos.setY(i, pos.getY(i) - 0.15 - Math.random() * 0.1);
    }
    geo.computeVertexNormals();
    this.push(geo, new THREE.MeshPhongMaterial({ color: biome.riverColor, flatShading: true }));
  };

  // After rotateX(-PI/2): getX is lateral (−BW/2..+BW/2), getY is height (starts 0)
  private addBank = (side: 'left' | 'right', biome: Biome, rng: () => number): void => {
    const geo = new THREE.PlaneGeometry(BANK_WIDTH, CHUNK_LENGTH, 5, 8);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes['position'] as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      // t = 0 at river edge, 1 at outer edge
      const t      = side === 'left'
        ? (-x + BANK_WIDTH / 2) / BANK_WIDTH
        : (x  + BANK_WIDTH / 2) / BANK_WIDTH;
      const height = t * biome.bankHeight + (rng() * 2 - 1) * biome.bankHeight * 0.28 * t;
      pos.setY(i, Math.max(0, height));
    }
    geo.computeVertexNormals();
    const xSign = side === 'left' ? -1 : 1;
    geo.translate(xSign * (biome.riverWidth / 2 + BANK_WIDTH / 2), 0, 0);
    this.push(geo, new THREE.MeshPhongMaterial({ color: biome.bankColor, flatShading: true }));
  };

  private push = (geo: THREE.BufferGeometry, mat: THREE.Material): void => {
    const mesh = new THREE.Mesh(geo, mat);
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
