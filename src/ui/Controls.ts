import type { Audio } from '../systems/Audio';

const BIOME_LABELS: Record<string, string> = {
  mountain: '山奥 / MOUNTAIN',
  forest:   '森 / FOREST',
  village:  '村 / VILLAGE',
  delta:    '河口 / DELTA',
  sea:      '海 / SEA',
};

export class Controls {
  private clockOn = true;
  private fpsOn   = false;
  private readonly clockEl   = document.getElementById('clock')!;
  private readonly fpsEl     = document.getElementById('fps')!;
  private readonly journeyEl = document.getElementById('journey')!;
  private readonly soundBtn  = document.getElementById('sound-btn')!;

  private fpsFrames  = 0;
  private fpsLastMs  = performance.now();

  constructor(audio: Audio) {
    document.getElementById('clock-btn')!.addEventListener('click', () => {
      this.clockOn = !this.clockOn;
      this.clockEl.style.visibility = this.clockOn ? 'visible' : 'hidden';
    });

    document.getElementById('fps-btn')!.addEventListener('click', () => {
      this.fpsOn = !this.fpsOn;
      this.fpsEl.style.display = this.fpsOn ? 'block' : 'none';
      if (this.fpsOn) { this.fpsFrames = 0; this.fpsLastMs = performance.now(); }
    });

    this.soundBtn.addEventListener('click', () => {
      const on = audio.toggle();
      this.soundBtn.textContent = on ? 'SOUND ♪' : 'SOUND ✕';
      this.soundBtn.classList.toggle('off', !on);
    });

    setInterval(() => { this.tickClock(); }, 1000);
    this.tickClock();
  }

  updateJourney = (minutes: number, biomeName: string): void => {
    const label = BIOME_LABELS[biomeName] ?? biomeName.toUpperCase();
    const pct   = Math.min(100, Math.round((minutes / 60) * 100));
    this.journeyEl.textContent = `${label}  ${pct}%`;
  };

  // Called every render frame from main.ts
  tickFps = (): void => {
    if (!this.fpsOn) return;
    this.fpsFrames++;
    const now  = performance.now();
    const diff = now - this.fpsLastMs;
    if (diff >= 500) {
      this.fpsEl.textContent = `${Math.round(this.fpsFrames / diff * 1000)} fps`;
      this.fpsFrames  = 0;
      this.fpsLastMs  = now;
    }
  };

  private tickClock = (): void => {
    if (!this.clockOn) return;
    this.clockEl.textContent = new Date().toLocaleTimeString('ja-JP', { hour12: false });
  };
}
