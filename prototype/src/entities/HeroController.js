import { InputBuffer } from "../systems/InputBuffer.js";

export const HeroState = Object.freeze({
  IDLE: "idle", RUN: "run", JUMP_START: "jump_start", AIR: "air",
  LAND: "land", DODGE: "dodge", ATTACK_1: "attack_1",
  ATTACK_2: "attack_2", HIT: "hit"
});

export class HeroController {
  constructor(scene, x, groundY) {
    this.scene = scene;
    this.x = x; this.groundY = groundY; this.y = 0;
    this.vx = 0; this.vy = 0;
    this.facing = 1; this.grounded = true;
    this.state = HeroState.IDLE; this.stateTime = 0;
    this.buffer = new InputBuffer(160);
    this.comboQueued = false; this.attackStep = 0;
    this.invulnerable = 0;
    this.moveSpeed = 260; this.jumpVelocity = -590; this.gravity = 1550;
    this.body = scene.add.container(x, groundY);
    this.drawPlaceholder();
  }

  drawPlaceholder() {
    const g = this.scene.add.graphics();
    // Temporary controller silhouette; final authored Semi-Drago atlas replaces it.
    this.body.add(g); this.gfx = g; this.paintPlaceholder();
  }

  paintPlaceholder() {
    const colors = {
      idle:0x263c56,run:0x365b79,jump_start:0x6c8ca4,air:0x6c8ca4,
      land:0x9b7950,dodge:0x9b623c,attack_1:0xa76a3d,attack_2:0xc28a4e,hit:0x9b3d46
    };
    const g=this.gfx; g.clear();
    g.fillStyle(0x101827,1);g.fillEllipse(0,39,46,12);
    g.fillStyle(colors[this.state]||0x263c56,1);g.fillRoundedRect(-15,-30,30,55,9);
    g.fillStyle(0xd7b17b,1);g.fillCircle(0,-43,13);
    g.fillStyle(0x18263a,1);g.fillRoundedRect(-17,-13,34,8,3);
    g.lineStyle(4,0xd8bd8b,1);g.beginPath();g.moveTo(12,-8);g.lineTo(28,18);g.strokePath();
    g.lineStyle(3,0x91a7c6,.9);g.beginPath();g.moveTo(-10,-24);g.lineTo(-24,-2);g.strokePath();
  }

  request(action, now) { this.buffer.push(action, now); }
  enter(state) {
    if(this.state===state)return;
    this.state=state;this.stateTime=0;
    if(state===HeroState.ATTACK_1||state===HeroState.ATTACK_2){
      this.comboQueued=false;this.attackStep=state===HeroState.ATTACK_1?1:2;
    }
    this.paintPlaceholder();
  }

  update(dt,input,now) {
    this.stateTime+=dt;this.invulnerable=Math.max(0,this.invulnerable-dt);
    const axis=(input.right?1:0)-(input.left?1:0);
    if(axis)this.facing=axis>0?1:-1;
    if(input.attackPressed)this.request("attack",now);
    if(input.jumpPressed)this.request("jump",now);
    if(input.dodgePressed)this.request("dodge",now);

    if(this.state===HeroState.DODGE){
      this.vx=this.facing*590;
      if(this.stateTime>=.24){this.vx=0;this.enter(this.grounded?(axis?HeroState.RUN:HeroState.IDLE):HeroState.AIR);}
    }else if(this.state===HeroState.ATTACK_1||this.state===HeroState.ATTACK_2){
      this.vx*=Math.pow(.001,dt);
      if(this.buffer.consume("attack",now))this.comboQueued=true;
      const duration=this.state===HeroState.ATTACK_1?.34:.42;
      if(this.stateTime>=duration){
        if(this.comboQueued&&this.attackStep===1)this.enter(HeroState.ATTACK_2);
        else this.enter(this.grounded?(axis?HeroState.RUN:HeroState.IDLE):HeroState.AIR);
      }
    }else if(this.state===HeroState.LAND){
      this.vx=axis*this.moveSpeed;
      if(this.stateTime>=.12)this.enter(axis?HeroState.RUN:HeroState.IDLE);
    }else{
      if(this.buffer.consume("dodge",now)&&this.grounded)this.enter(HeroState.DODGE);
      else if(this.buffer.consume("jump",now)&&this.grounded){
        this.grounded=false;this.vy=this.jumpVelocity;this.enter(HeroState.JUMP_START);
      }else if(this.buffer.consume("attack",now))this.enter(HeroState.ATTACK_1);
      else{
        this.vx=axis*this.moveSpeed;
        if(!this.grounded)this.enter(HeroState.AIR);
        else this.enter(axis?HeroState.RUN:HeroState.IDLE);
      }
    }

    if(!this.grounded){
      this.vy+=this.gravity*dt;this.y+=this.vy*dt;
      if(this.y>=0){this.y=0;this.vy=0;this.grounded=true;this.enter(HeroState.LAND);}
    }
    this.x+=this.vx*dt;
    this.x=Phaser.Math.Clamp(this.x,80,this.scene.scale.width-80);
    const bob=this.state===HeroState.RUN?Math.sin(this.scene.time.now*.018)*3:0;
    this.body.setPosition(this.x,this.groundY+this.y+bob);
    this.body.setScale(this.facing*(this.state===HeroState.DODGE?1.18:1),this.state===HeroState.LAND?Math.max(.84,1-this.stateTime*.8):1);
  }

  setGroundY(value){this.groundY=value;this.body.setY(value+this.y);}
  destroy(){this.body.destroy(true);}
}