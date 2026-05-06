interface ChangelogEntry {
  date:  string;
  items: string[];
}

// User-facing changes only — no internal implementation details.
// Add a new entry at the TOP of this array for each release.
const CHANGELOG: ChangelogEntry[] = [
  {
    date: '2026-05-06',
    items: [
      '川面に流れる波テクスチャを追加',
      '川が幾何学的に蛇行するジオメトリを実装',
      '季節連動の雲システムを追加（夏：積乱雲、秋：いわし雲、春冬：層雲）',
      'FPS カウンターを追加',
      'What\'s New モーダルを追加',
    ],
  },
];

const STORAGE_KEY = 'srs_seen';

export class WhatsNew {
  private readonly overlayEl = document.getElementById('wn-overlay')!;

  constructor() {
    document.getElementById('wn-close')!.addEventListener('click', () => this.hide());
    document.getElementById('wn-btn')!.addEventListener('click',   () => this.show());
    this.overlayEl.addEventListener('click', (e) => {
      if (e.target === this.overlayEl) this.hide();
    });

    this.populate();

    if (localStorage.getItem(STORAGE_KEY) !== CHANGELOG[0].date) {
      this.show();
    }
  }

  private populate = (): void => {
    const entry = CHANGELOG[0];
    document.getElementById('wn-date')!.textContent = entry.date;
    document.getElementById('wn-list')!.innerHTML =
      entry.items.map(t => `<li>${t}</li>`).join('');
  };

  show = (): void => {
    this.overlayEl.classList.add('open');
  };

  hide = (): void => {
    this.overlayEl.classList.remove('open');
    localStorage.setItem(STORAGE_KEY, CHANGELOG[0].date);
  };
}
