const TARGET_GAIN = 0.18;

export class Audio {
  private ctx: AudioContext | null = null;
  private gain: GainNode | null = null;
  private _on = false; // starts silent; first click enables

  // Call on any user gesture to initialise AudioContext
  toggle(): boolean {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.gain = this.ctx.createGain();
      this.gain.gain.value = 0;
      this.gain.connect(this.ctx.destination);
      this.buildRiverNoise();
      // First toggle → turn ON
      this._on = true;
      this.gain.gain.setTargetAtTime(TARGET_GAIN, this.ctx.currentTime, 0.2);
      return true;
    }
    this._on = !this._on;
    this.gain!.gain.setTargetAtTime(
      this._on ? TARGET_GAIN : 0,
      this.ctx.currentTime,
      0.15,
    );
    return this._on;
  }

  private buildRiverNoise(): void {
    const ctx = this.ctx!;
    // 3 seconds of white noise looped → lowpass filter = rushing water approximation
    const sr  = ctx.sampleRate;
    const buf = ctx.createBuffer(1, sr * 3, sr);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop   = true;

    const lpf = ctx.createBiquadFilter();
    lpf.type            = 'lowpass';
    lpf.frequency.value = 650;
    lpf.Q.value         = 0.4;

    src.connect(lpf);
    lpf.connect(this.gain!);
    src.start();
  }

  get on(): boolean { return this._on; }
}
