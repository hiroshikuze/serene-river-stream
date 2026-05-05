# Infinite River Journey

A 3D first-person boat ride from mountain headwaters to the sea, lasting exactly one hour.
Built with Vanilla TypeScript + Three.js + Vite. Deployable to GitHub Pages.

[![GitHub Stars](https://img.shields.io/github/stars/hiroshikuze/newapp2026-river-rafting?style=for-the-badge&logo=github&logoColor=white&color=gold&label=⭐%20Stars)](https://github.com/hiroshikuze/newapp2026-river-rafting/stargazers)

## Visual Style

PS1 / early low-poly aesthetic: flat shading, no textures, polygon color and shape only, exponential fog.

## Biome Progression

| Time | Biome | Character |
|------|-------|-----------|
| 0 min | Mountain source | Narrow river, steep dark banks |
| 15 min | Forest | Wider river, tall green banks |
| 30 min | Valley | Open, rolling hills |
| 45 min | Plains | Flat terrain, wide river |
| 60 min | Sea | Open water, minimal banks |

Biome properties (river width, bank height, colors, fog density) are linearly interpolated between keyframes.

## Architecture

```
src/
  main.ts              Entry point — renderer, render loop, orchestration
  utils/rng.ts         Mulberry32 seeded PRNG
  terrain/
    biomes.ts          Biome keyframes + interpolation (0–60 min)
    Chunk.ts           One terrain segment: river + 2 banks, with dispose()
    ChunkManager.ts    Spawns chunks 6 ahead, culls 2+ behind — all with .dispose()
  systems/
    Lighting.ts        DirectionalLight sun position driven by real wall-clock time
    Audio.ts           AudioContext white-noise river sound stub
  ui/
    Controls.ts        Clock display toggle + sound ON/OFF
```

**Chunk system:** camera travels −Z at 10 units/sec. Each chunk is 200 units long. ChunkManager keeps indices `[currentChunk−2, currentChunk+6]` alive; everything outside is `.dispose()`d (geometry + material). Biome for a chunk is computed from `(chunkIndex × chunkLength / speed) / 60` minutes.

**Lighting:** `DirectionalLight` elevation is `sin((fractionalDay − 0.25) × π)`. AmbientLight is kept at ≥ 0.6 intensity so night scenes remain visible. Dawn/dusk shifts sun color toward orange.

## Development

```bash
npm install
npm run dev        # localhost:5173
npm run build      # outputs to dist/
npm run typecheck  # tsc --noEmit
```

## Deployment

Push to `main` → GitHub Actions builds with Vite and deploys `dist/` to GitHub Pages automatically.
Enable GitHub Pages in repo Settings → Pages → Source: GitHub Actions.
