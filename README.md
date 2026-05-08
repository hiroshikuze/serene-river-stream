# Serene River Stream

A 1-hour ambient 3D river journey — ride from mountain headwaters to the open sea, synchronized with your real wall-clock.
Built with Vanilla TypeScript + Three.js + Vite.

[![GitHub Stars](https://img.shields.io/github/stars/hiroshikuze/serene-river-stream?style=for-the-badge&logo=github&logoColor=white&color=gold&label=⭐%20Stars)](https://github.com/hiroshikuze/serene-river-stream/stargazers)

---

## Demo

[![▶ Open Serene River Stream Demo](https://img.shields.io/badge/▶%20Serene%20River%20Stream-Demo%20Open-22c55e?style=for-the-badge&logo=html5&logoColor=white)](https://hiroshikuze.github.io/serene-river-stream/)

---

## Overview / 概要

**EN:** A real-time ambient experience that lasts exactly one hour — the clock on your wall determines where you are on the river. Open it at :00 and you start at the mountain source; by :60 you reach the open sea.

**JA:** 壁掛け時計の現在時刻と連動して、山の源流から海まで1時間かけて川を下るアンビエント3Dアプリです。毎時0分に源流から出発し、毎時60分ちょうどに海に到達します。

---

## Features

- **Clock-synced journey** — position on the river is driven by real wall-clock minutes/seconds
- **5 biomes** — Mountain → Forest → Valley → Plains → Sea with smooth interpolation
- **Geometric river meander** — fBm-based sinuous river path; camera yaw tracks the bend
- **PS1-style wave texture** — pixelated scrolling water surface, no GPU shaders required
- **Seasonal sky** — sky colour and cloud type change with the real-world season
- **Dynamic lighting** — sun position matches time of day; night scenes fade to deep blue
- **Ambient sound** — optional river noise (Web Audio API)
- **What's New modal** — shows release notes on first visit after an update

---

## Local Setup

```bash
git clone https://github.com/hiroshikuze/serene-river-stream.git
cd serene-river-stream
npm install
npm run dev        # http://localhost:5173/serene-river-stream/
```

Other commands:

```bash
npm run build      # production build → dist/
npm run preview    # preview the production build locally
npm run typecheck  # tsc --noEmit
```

---

## Deployment

Push to `main` → GitHub Actions builds with Vite and deploys `dist/` to GitHub Pages automatically.

Enable GitHub Pages in repo **Settings → Pages → Source: GitHub Actions** (first time only).

---

## Tech Stack

| Layer | Library / Tool |
| --- | --- |
| 3D rendering | [Three.js](https://threejs.org/) v0.170 |
| Language | TypeScript 5 (strict) |
| Bundler | Vite 6 |
| Hosting | GitHub Pages (via GitHub Actions) |

---

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## Author

[@hiroshikuze](https://github.com/hiroshikuze)

---

## 💖 Support my work

If you'd like to support my projects, please consider becoming a sponsor!

[![GitHub Stars](https://img.shields.io/github/stars/hiroshikuze/serene-river-stream?style=for-the-badge&logo=github&logoColor=white&color=gold&label=⭐%20Stars)](https://github.com/hiroshikuze/serene-river-stream/stargazers)

[![GitHub Sponsors](https://img.shields.io/badge/Sponsor-GitHub%20Sponsors-ea4aaa?style=for-the-badge&logo=github-sponsors)](https://github.com/sponsors/hiroshikuze)
[![アマゾンの欲しいものリスト (Amazon.co.jp wish list)](https://img.shields.io/badge/Amazon-Wishlist-orange?style=for-the-badge&logo=amazon)](https://www.amazon.jp/hz/wishlist/ls/5BAWD0LZ89V9?ref_=wl_share)
