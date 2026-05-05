import * as THREE from 'three';

const SUN_DAY   = new THREE.Color(0xfff8e8);
const SUN_DAWN  = new THREE.Color(0xff8833);
const AMB_DAY   = new THREE.Color(0x6688aa);
const AMB_NIGHT = new THREE.Color(0x223355);

export class Lighting {
  private readonly sun: THREE.DirectionalLight;
  private readonly ambient: THREE.AmbientLight;

  constructor(scene: THREE.Scene) {
    // Sun starts overhead; update() repositions it every frame
    this.sun = new THREE.DirectionalLight(SUN_DAY, 2.0);
    scene.add(this.sun);

    // AmbientLight stays high so night scenes remain visible
    this.ambient = new THREE.AmbientLight(AMB_DAY, 0.7);
    scene.add(this.ambient);
  }

  update(): void {
    const now = new Date();
    // fractDay: 0.0 = midnight, 0.25 = 6am, 0.5 = noon, 0.75 = 6pm
    const fractDay =
      (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86400;

    // Elevation peaks at noon, zero at 6am/6pm, negative at night
    const angle = (fractDay - 0.25) * Math.PI * 2; // 0 at 6am
    const elevation = Math.sin(angle * 0.5);        // -1..1
    const dayness   = Math.max(0, elevation);        // 0 at night, 1 at noon

    // Sun orbits in the YZ plane; stay at min height 8 to avoid harsh underlighting
    this.sun.position.set(
      Math.sin(fractDay * Math.PI * 2) * 80,
      Math.max(8, elevation * 300),
      -Math.cos(angle * 0.5) * 200,
    );
    this.sun.intensity = 0.4 + dayness * 2.2;

    // Orange tint near horizon (elevation ≈ 0), white at noon
    const dawnness = Math.max(0, 1 - Math.abs(elevation) * 5);
    this.sun.color.copy(SUN_DAY).lerp(SUN_DAWN, dawnness);

    this.ambient.color.copy(AMB_NIGHT).lerp(AMB_DAY, dayness);
    this.ambient.intensity = 0.55 + dayness * 0.35;
  }
}
