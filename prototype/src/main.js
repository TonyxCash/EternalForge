import { BootScene } from "./scenes/BootScene.js";
import { CombatScene } from "./scenes/CombatScene.js";

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game-root",
  backgroundColor: "#0a1220",
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720
  },
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: false
  },
  physics: {
    default: "arcade",
    arcade: { debug: false, gravity: { y: 0 } }
  },
  input: { activePointers: 4 },
  scene: [BootScene, CombatScene]
});

window.addEventListener("contextmenu", event => event.preventDefault());
window.addEventListener("orientationchange", () => game.scale.refresh());