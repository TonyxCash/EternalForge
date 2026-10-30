import { HeroController, HeroState } from "../entities/HeroController.js";

export class CombatScene extends Phaser.Scene {
  constructor() { super("CombatScene"); }
  create() {
    this.cameras.main.setBackgroundColor("#0a1220");
    this.drawArena();
    this.hero = new HeroController(this, this.scale.width * .34, 0);
    this.keys = this.input.keyboard.addKeys("A,D,LEFT,RIGHT,SPACE,J,K");
    this.touch = { left:false, right:false };
    this.actionEdges = { jump:false, attack:false, dodge:false };
    this.bindTouch();
    this.scale.on("resize", this.onResize, this);
    this.add.text(this.scale.width / 2, 88, "MOVIMENTO · INPUT BUFFER · STATE MACHINE", {
      fontFamily:"Arial",fontSize:"12px",color:"#9fb2ca",letterSpacing:3
    }).setOrigin(.5).setAlpha(.75);
    this.readout = document.getElementById("state-readout");
    this.events.once("shutdown", () => this.hero?.destroy());
  }

  drawArena() {
    const w = this.scale.width, h = this.scale.height;
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0b1424,0x0b1424,0x1a2940,0x1a2940,1);
    bg.fillRect(0,0,w,h);
    for (let i=0;i<9;i++) {
      const x = i*w/8;
      bg.lineStyle(1,0x8ba2c0,.09); bg.beginPath(); bg.moveTo(x,h*.25); bg.lineTo(x,h*.86); bg.strokePath();
    }
    bg.fillStyle(0x26354a,1); bg.fillRect(0,h*.78,w,h*.22);
    bg.fillStyle(0x52627a,.5); bg.fillRect(0,h*.78,w,3);
    bg.fillStyle(0x0a101b,.8); bg.fillEllipse(w*.5,h*.83,w*.62,28);
  }

  bindTouch() {
    document.querySelectorAll("[data-key]").forEach(button => {
      const key = button.dataset.key;
      const down = e => { e.preventDefault(); this.touch[key] = true; };
      const up = e => { e.preventDefault(); this.touch[key] = false; };
      button.addEventListener("pointerdown", down);
      ["pointerup","pointercancel","pointerleave"].forEach(type => button.addEventListener(type, up));
    });
    document.querySelectorAll("[data-action]").forEach(button => {
      const action = button.dataset.action;
      button.addEventListener("pointerdown", e => { e.preventDefault(); this.actionEdges[action] = true; });
    });
  }

  onResize(size) {
    this.children.removeAll(true);
    this.drawArena();
    if (this.hero) this.hero.x = Phaser.Math.Clamp(this.hero.x,80,size.width-80);
  }

  update(_, deltaMs) {
    const dt = Math.min(deltaMs / 1000, .033);
    const left = this.touch.left || this.keys.A.isDown || this.keys.LEFT.isDown;
    const right = this.touch.right || this.keys.D.isDown || this.keys.RIGHT.isDown;
    const jumpPressed = this.actionEdges.jump || Phaser.Input.Keyboard.JustDown(this.keys.SPACE);
    const attackPressed = this.actionEdges.attack || Phaser.Input.Keyboard.JustDown(this.keys.J);
    const dodgePressed = this.actionEdges.dodge || Phaser.Input.Keyboard.JustDown(this.keys.K);
    this.actionEdges.jump = this.actionEdges.attack = this.actionEdges.dodge = false;
    this.hero.update(dt,{left,right,jumpPressed,attackPressed,dodgePressed},this.time.now);
    if (this.readout) this.readout.textContent = "STATO: " + this.hero.state.toUpperCase().replaceAll("_"," ");
  }
}