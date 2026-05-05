import * as THREE from 'three';
import { Chunk, CHUNK_LENGTH } from './Chunk';
import { getBiome } from './biomes';
import { createRng } from '../utils/rng';

const SPEED = 10;         // must match main.ts
const CHUNKS_AHEAD = 6;
const CHUNKS_BEHIND = 2;
const SEED_BASE = 0xdeadbeef;

export class ChunkManager {
  private readonly active = new Map<number, Chunk>();

  update(cameraZ: number, scene: THREE.Scene): void {
    const cur = Math.floor(-cameraZ / CHUNK_LENGTH);
    const lo = Math.max(0, cur - CHUNKS_BEHIND);
    const hi = cur + CHUNKS_AHEAD;

    for (let i = lo; i <= hi; i++) {
      if (!this.active.has(i)) {
        const minutes = (i * CHUNK_LENGTH / SPEED) / 60;
        const rng = createRng(SEED_BASE ^ (i * 0x9e3779b9));
        this.active.set(i, new Chunk(i, getBiome(minutes), rng, scene));
      }
    }

    for (const [i, chunk] of this.active) {
      if (i < lo || i > hi) {
        chunk.dispose(scene);
        this.active.delete(i);
      }
    }
  }

  dispose(scene: THREE.Scene): void {
    for (const chunk of this.active.values()) chunk.dispose(scene);
    this.active.clear();
  }
}
