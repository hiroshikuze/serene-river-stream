import * as THREE from 'three';

const SUN_WHITE  = new THREE.Color(0xfff8e8);
const SUN_ORANGE = new THREE.Color(0xff7722);
const AMB_DAY    = new THREE.Color(0x6688aa);
const AMB_NIGHT  = new THREE.Color(0x151d2e);

export class Lighting {
  private readonly sun: THREE.DirectionalLight;
  private readonly ambient: THREE.AmbientLight;
  private _dayness = 0;

  constructor(scene: THREE.Scene) {
    this.sun = new THREE.DirectionalLight(SUN_WHITE, 2.0);
    scene.add(this.sun);
    // Stays elevated at night so the scene remains visible
    this.ambient = new THREE.AmbientLight(AMB_DAY, 0.7);
    scene.add(this.ambient);
  }

  update = (): void => {
    const now = new Date();
    // fractDay: 0 = midnight, 0.25 = 6 am, 0.5 = noon, 0.75 = 6 pm
    const fractDay =
      (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86400;

    // Elevation: +1 at noon, 0 at 6am/6pm, −1 at midnight
    const angle     = (fractDay - 0.25) * Math.PI * 2;
    const elevation = Math.sin(angle * 0.5);
    this._dayness   = Math.max(0, elevation);

    // Sun orbits in the YZ plane; never dips below y=6 to avoid uplighting
    this.sun.position.set(
      Math.sin(fractDay * Math.PI * 2) * 60,
      Math.max(6, elevation * 300),
      -Math.cos(angle * 0.5) * 200,
    );
    this.sun.intensity = 0.3 + this._dayness * 2.4;

    // Orange near horizon (|elevation| ≈ 0), white at noon
    const dawnness = Math.max(0, 1 - Math.abs(elevation) * 4.5);
    this.sun.color.copy(SUN_WHITE).lerp(SUN_ORANGE, dawnness);

    // Ambient: cold navy at night, warm blue-grey by day; kept ≥ 0.55 for visibility
    this.ambient.color.copy(AMB_NIGHT).lerp(AMB_DAY, this._dayness);
    this.ambient.intensity = 0.55 + this._dayness * 0.35;
  };

  get dayness(): number { return this._dayness; }
}
