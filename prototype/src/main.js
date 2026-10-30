import { BootScene } from "./scenes/BootScene.js";
import { CombatScene } from "./scenes/CombatScene.js";

 // Compatibility guard: older cached hero renderers used Canvas-style
 // quadraticCurveTo on Phaser Graphics. Phaser Graphics does not expose it.
 // Keep the game booting and preserve the path with a straight segment.
 if (window.Phaser?.GameObjects?.Graphics &&
     typeof Phaser.GameObjects.Graphics.prototype.quadraticCurveTo !== "function") {
   Phaser.GameObjects.Graphics.prototype.quadraticCurveTo = function(_cx, _cy, x, y) {
     this.lineTo(x, y);
     return this;
   };
 }

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