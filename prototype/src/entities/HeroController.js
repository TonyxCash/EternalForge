import { InputBuffer } from "../systems/InputBuffer.js";
import { HERO_CLIPS } from "../animation/ClipLibrary.js";
import { clipDuration } from "../animation/ClipLibrary.js";
import { AnimationTimeline } from "../systems/AnimationTimeline.js";
import { CombatHitbox } from "../systems/CombatHitbox.js";

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
    this.timeline = new AnimationTimeline(HERO_CLIPS);
    this.timeline.play("idle");
    this.hitbox = new CombatHitbox(scene, this);
    this.drawPlaceholder();
  }

  drawPlaceholder() {
    const g=this.scene.add.graphics();
    this.body.add(g); this.gfx=g; this.paintPlaceholder();
  }

  paintPlaceholder() {
    // High-detail procedural art pass for the playable preview.
    // Final production still requires authored frame-by-frame sprite atlases.
    const g=this.gfx, t=this.scene.time.now/1000, st=this.state;
    g.clear();
    const hit=st==="hit", attack=st==="attack_1"||st==="attack_2";
    const airborne=st==="air"||st==="jump_start", dodge=st==="dodge";
    const run=st==="run", phase=t*(run?13:2.5);
    const bob=run?Math.sin(phase)*2.2:Math.sin(phase)*.8;
    const leg=Math.sin(phase)* (run?8:1.5), arm=Math.sin(phase+Math.PI)* (run?7:2);
    const wing=Math.sin(t*4.2)*(airborne?8:3);
    const armor=hit?0x8e3947:0x111e32, steel=0x304966, bright=0x7399bd;
    const gold=0xc99d62, skin=0xc58e70;

    // Ground shadow and long draconic tail, drawn behind the body.
    g.fillStyle(0x020711,.48);g.fillEllipse(0,45,66,13);
    g.lineStyle(8,0x101c30,1);g.beginPath();
    g.moveTo(-7,9);g.quadraticCurveTo(-27,17,-34,29);g.quadraticCurveTo(-47,39,-57,27);g.strokePath();
    g.lineStyle(4,0x315779,1);g.beginPath();
    g.moveTo(-7,10);g.quadraticCurveTo(-27,18,-34,29);g.quadraticCurveTo(-47,39,-57,27);g.strokePath();
    g.fillStyle(0x4b8bb4,1);g.fillTriangle(-59,25,-52,22,-55,32);

    // Broad dragon wings with ribs and luminous membrane seams.
    g.fillStyle(0x101c30,1);
    g.fillPoints([{x:-10,y:-27},{x:-22,y:-40-wing},{x:-43,y:-55-wing},{x:-38,y:-30},{x:-50,y:-17},{x:-31,y:-13},{x:-22,y:1},{x:-11,y:-11}],true);
    g.fillPoints([{x:10,y:-27},{x:22,y:-40-wing},{x:43,y:-55-wing},{x:38,y:-30},{x:50,y:-17},{x:31,y:-13},{x:22,y:1},{x:11,y:-11}],true);
    g.lineStyle(2,0x426b91,.95);
    for(const side of [-1,1]){
      g.beginPath();g.moveTo(side*10,-26);g.lineTo(side*43,-54-wing);g.lineTo(side*38,-30);g.lineTo(side*50,-17);g.strokePath();
      g.beginPath();g.moveTo(side*10,-25);g.lineTo(side*31,-13);g.lineTo(side*22,0);g.strokePath();
      g.lineStyle(1,0x328ac0,.9);g.lineBetween(side*19,-26,side*37,-30);g.lineBetween(side*23,-18,side*43,-20);g.lineStyle(2,0x426b91,.95);
    }

    // Back silhouette, legs and segmented greaves with animated stride.
    g.fillStyle(0x0b1423,1);
    g.fillRoundedRect(-12,4+leg*.25,10,31,4);g.fillRoundedRect(2,4-leg*.25,10,31,4);
    g.fillStyle(0x253d5a,1);
    g.fillRoundedRect(-15,25+leg*.25,15,10,3);g.fillRoundedRect(0,25-leg*.25,15,10,3);
    g.fillStyle(0x7895b4,1);
    g.fillRoundedRect(-13,11+leg*.25,3,13,1);g.fillRoundedRect(5,11-leg*.25,3,13,1);
    g.lineStyle(2,0x111b2b,1);g.lineBetween(-10,29+leg*.25,-2,29+leg*.25);g.lineBetween(4,29-leg*.25,12,29-leg*.25);

    // Muscular silhouette and layered chest plate.
    g.fillStyle(armor,1);g.fillRoundedRect(-16,-31+bob,32,43,8);
    g.fillStyle(steel,1);
    g.fillPoints([{x:-15,y:-27+bob},{x:-8,y:-34+bob},{x:0,y:-29+bob},{x:8,y:-34+bob},{x:15,y:-27+bob},{x:11,y:-5+bob},{x:0,y:2+bob},{x:-11,y:-5+bob}],true);
    g.fillStyle(0x172b43,1);g.fillTriangle(-3,-27+bob,0,-21+bob,3,-27+bob);
    g.fillTriangle(-3,-8+bob,0,-2+bob,3,-8+bob);
    g.lineStyle(2,0x83bfff,.9);g.lineBetween(-10,-23+bob,-4,-9+bob);g.lineBetween(10,-23+bob,4,-9+bob);
    g.lineStyle(1,gold,1);g.lineBetween(-12,-3+bob,12,-3+bob);
    g.fillStyle(gold,1);g.fillRoundedRect(-14,5+bob,28,5,2);g.fillCircle(0,7+bob,3);
    g.fillStyle(0x6aa5d0,1);g.fillTriangle(-8,-15+bob,-3,-12+bob,-8,-9+bob);g.fillTriangle(8,-15+bob,3,-12+bob,8,-9+bob);

    // Shoulder pauldrons, engraved plates and moving forearms.
    g.fillStyle(0x263f5e,1);
    g.fillPoints([{x:-14,y:-28+bob},{x:-25,y:-24+bob},{x:-23,y:-12+bob},{x:-12,y:-10+bob},{x:-8,y:-22+bob}],true);
    g.fillPoints([{x:14,y:-28+bob},{x:25,y:-24+bob},{x:23,y:-12+bob},{x:12,y:-10+bob},{x:8,y:-22+bob}],true);
    g.lineStyle(2,gold,.95);g.lineBetween(-21,-21+bob,-15,-14+bob);g.lineBetween(21,-21+bob,15,-14+bob);
    g.fillStyle(0x8fc4e8,1);g.fillCircle(-18,-20+bob,2);g.fillCircle(18,-20+bob,2);
    g.lineStyle(6,0x172a43,1);g.lineBetween(-17,-11+bob,-23,-1+arm);g.lineBetween(17,-11+bob,attack?31:-18,attack?-3:arm);
    g.lineStyle(2,0x7199bc,1);g.lineBetween(-20,-9+bob,-25,-1+arm);

    // Neck, defined adult face, jaw, nose, mouth, brows and blue draconic eyes.
    g.fillStyle(skin,1);g.fillRoundedRect(-5,-42+bob,10,12,3);
    g.fillStyle(0x9d6b58,1);g.fillTriangle(-8,-43+bob,0,-35+bob,8,-43+bob);
    g.fillStyle(skin,1);g.fillEllipse(0,-51+bob,23,27);
    g.fillStyle(0x986b59,1);g.fillTriangle(-9,-48+bob,0,-37+bob,9,-48+bob);
    g.fillStyle(0x111a29,1);
    g.fillPoints([{x:-12,y:-53+bob},{x:-10,y:-65+bob},{x:-3,y:-69+bob},{x:3,y:-66+bob},{x:12,y:-62+bob},{x:13,y:-50+bob},{x:7,y:-57+bob},{x:1,y:-55+bob},{x:-5,y:-57+bob}],true);
    g.fillStyle(0x263f5c,1);g.fillTriangle(-10,-57+bob,-19,-49+bob,-11,-46+bob);
    g.fillStyle(0x0a1422,1);g.fillTriangle(-2,-53+bob,3,-52+bob,1,-50+bob);
    g.fillStyle(0x48c5ff,1);g.fillRoundedRect(4,-53+bob,5,2,1);
    g.fillStyle(0x19283d,1);g.fillTriangle(5,-45+bob,10,-44+bob,6,-42+bob);
    g.lineStyle(1,0x704b42,1);g.lineBetween(-1,-40+bob,4,-40+bob);
    g.fillStyle(0x5aa4d1,1);
    g.fillTriangle(-9,-46+bob,-6,-49+bob,-5,-44+bob);g.fillTriangle(-6,-42+bob,-3,-45+bob,-2,-40+bob);
    // Horned crest integrated into the hairline.
    g.fillStyle(0x263c57,1);g.fillPoints([{x:-8,y:-62+bob},{x:-14,y:-72+bob},{x:-3,y:-66+bob}],true);
    g.fillPoints([{x:7,y:-63+bob},{x:14,y:-72+bob},{x:3,y:-66+bob}],true);
    g.lineStyle(1,0x70a9d0,1);g.lineBetween(-11,-65+bob,-8,-62+bob);g.lineBetween(11,-65+bob,8,-62+bob);

    // Sword hilt and energy blade; sweep follows attack state.
    const sx=attack?31:-20, sy=attack?-4:8, ex=attack?54:-42, ey=attack?-29:-18;
    g.lineStyle(5,0x111d30,1);g.lineBetween(13,-12+bob,sx,sy);
    g.lineStyle(3,gold,1);g.lineBetween(sx-3,sy+3,sx+4,sy-3);
    g.lineStyle(5,0x2d8fc9,.45);g.lineBetween(sx,sy,ex,ey);
    g.lineStyle(2,0xc9efff,1);g.lineBetween(sx,sy,ex,ey);
    g.fillStyle(0x73d5ff,1);g.fillCircle(ex,ey,2.5);
    if(attack){g.lineStyle(3,0x42baff,.8);g.beginPath();g.arc(8,-8+bob,48,-.9,.6,false);g.strokePath();}
    if(airborne){g.lineStyle(2,0x48aaff,.8);g.lineBetween(-23,-8,-34,2);g.lineBetween(23,-8,34,2);}
    if(dodge){g.lineStyle(2,0x55baff,.7);g.strokeEllipse(0,-13,68,39);}
  }

  request(action, now) { this.buffer.push(action, now); }
  enter(state) {
    if(this.state===state)return;
    this.state=state;this.stateTime=0;
    this.timeline.play(state);
    if(state!==HeroState.ATTACK_1&&state!==HeroState.ATTACK_2)this.hitbox.disarm();
    if(state===HeroState.ATTACK_1||state===HeroState.ATTACK_2){
      this.comboQueued=false;this.attackStep=state===HeroState.ATTACK_1?1:2;
    }
    this.paintPlaceholder();
  }

  update(dt,input,now) {
    this.stateTime+=dt;this.invulnerable=Math.max(0,this.invulnerable-dt);
    this.timeline.update(dt,event=>{
      if(event.type==="hit_on")this.hitbox.arm({damage:this.attackStep===1?12:20,width:this.attackStep===1?54:76,height:48});
      if(event.type==="hit_off")this.hitbox.disarm();
    });
    const axis=(input.right?1:0)-(input.left?1:0);
    if(axis)this.facing=axis>0?1:-1;
    if(input.attackPressed)this.request("attack",now);
    if(input.jumpPressed)this.request("jump",now);
    if(input.dodgePressed)this.request("dodge",now);

    if(this.state===HeroState.DODGE){
      this.vx=this.facing*590;
      if(this.timeline.complete){this.vx=0;this.enter(this.grounded?(axis?HeroState.RUN:HeroState.IDLE):HeroState.AIR);}
    }else if(this.state===HeroState.ATTACK_1||this.state===HeroState.ATTACK_2){
      this.vx*=Math.pow(.001,dt);
      if(this.buffer.consume("attack",now))this.comboQueued=true;
      const duration=clipDuration(HERO_CLIPS[this.state]);
      if(this.timeline.complete || this.stateTime>=duration){
        if(this.comboQueued&&this.attackStep===1)this.enter(HeroState.ATTACK_2);
        else this.enter(this.grounded?(axis?HeroState.RUN:HeroState.IDLE):HeroState.AIR);
      }
    }else if(this.state===HeroState.LAND){
      this.vx=axis*this.moveSpeed;
      if(this.timeline.complete)this.enter(axis?HeroState.RUN:HeroState.IDLE);
    }else if(this.state===HeroState.JUMP_START){
      this.vx=axis*this.moveSpeed;
      if(this.timeline.complete)this.enter(HeroState.AIR);
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
    this.paintPlaceholder();
    this.hitbox.update();
  }

  setGroundY(value){this.groundY=value;this.body.setY(value+this.y);}
  destroy(){this.hitbox.destroy();this.body.destroy(true);}
}