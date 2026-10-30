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
    const g = this.scene.add.graphics();
    // Temporary controller silhouette; final authored Semi-Drago atlas replaces it.
    this.body.add(g); this.gfx = g; this.paintPlaceholder();
  }

  paintPlaceholder() {
    // Male Semi-Drago blockout based on the existing blue/black concept art.
    // This is a temporary vector stand-in, not the final frame-by-frame atlas.
    const g=this.gfx; g.clear();
    const hit=this.state==="hit";
    const armor=hit?0x8e3947:0x17283e, steel=0x385675, edge=0x83bfff;
    const attack=this.state==="attack_1"||this.state==="attack_2";
    const airborne=this.state==="air"||this.state==="jump_start";
    const dodge=this.state==="dodge";

    g.fillStyle(0x07101d,.48);g.fillEllipse(0,43,52,12);

    // Folded draconic wings: compact at rest, visible behind the shoulders.
    g.fillStyle(0x10243d,1);
    g.fillPoints([{x:-9,y:-28},{x:-27,y:-35},{x:-35,y:-15},{x:-23,y:-5},{x:-17,y:5},{x:-10,y:-13}],true);
    g.fillPoints([{x:9,y:-28},{x:27,y:-35},{x:35,y:-15},{x:23,y:-5},{x:17,y:5},{x:10,y:-13}],true);
    g.lineStyle(2,0x3f78aa,.9);
    g.beginPath();g.moveTo(-11,-25);g.lineTo(-29,-31);g.lineTo(-23,-8);g.strokePath();
    g.beginPath();g.moveTo(11,-25);g.lineTo(29,-31);g.lineTo(23,-8);g.strokePath();

    // Legs, boots and articulated greaves.
    g.fillStyle(0x111d30,1);
    g.fillRoundedRect(-13,8,11,25,4);g.fillRoundedRect(3,8,11,25,4);
    g.fillStyle(0x263f5d,1);
    g.fillRoundedRect(-15,25,14,9,3);g.fillRoundedRect(1,25,14,9,3);
    g.lineStyle(2,0x7896b5,.9);
    g.lineBetween(-10,12,-10,27);g.lineBetween(8,12,8,27);

    // Athletic male torso with layered dark steel chest armor.
    g.fillStyle(armor,1);g.fillRoundedRect(-15,-29,30,42,8);
    g.fillStyle(steel,1);
    g.fillPoints([{x:-13,y:-25},{x:-5,y:-31},{x:0,y:-25},{x:5,y:-31},{x:13,y:-25},{x:10,y:-5},{x:0,y:2},{x:-10,y:-5}],true);
    g.fillStyle(0x17263a,1);
    g.fillPoints([{x:-3,y:-24},{x:0,y:-20},{x:3,y:-24},{x:7,y:-4},{x:0,y:1},{x:-7,y:-4}],true);
    g.lineStyle(2,edge,.8);g.lineBetween(-9,-21,-3,-8);g.lineBetween(9,-21,3,-8);
    g.fillStyle(0xc49a62,1);g.fillRoundedRect(-13,5,26,5,2);
    g.fillStyle(0x101a2a,1);g.fillCircle(0,7,3);

    // Shoulder plates and bracers.
    g.fillStyle(0x243c58,1);
    g.fillPoints([{x:-14,y:-27},{x:-23,y:-23},{x:-21,y:-12},{x:-12,y:-10},{x:-8,y:-21}],true);
    g.fillPoints([{x:14,y:-27},{x:23,y:-23},{x:21,y:-12},{x:12,y:-10},{x:8,y:-21}],true);
    g.fillStyle(0x91b4d4,1);g.fillCircle(-17,-20,2);g.fillCircle(17,-20,2);
    g.fillStyle(0x1c3049,1);g.fillRoundedRect(-22,-8,7,17,3);g.fillRoundedRect(15,-8,7,17,3);

    // Neck, masculine face, swept dark hair and draconic eye.
    g.fillStyle(0xb98567,1);g.fillRoundedRect(-5,-38,10,10,3);
    g.fillStyle(0xc99576,1);g.fillEllipse(0,-47,22,25);
    g.fillStyle(0x101a2b,1);
    g.fillPoints([{x:-11,y:-49},{x:-9,y:-61},{x:0,y:-66},{x:10,y:-60},{x:12,y:-48},{x:5,y:-55},{x:-2,y:-53}],true);
    g.fillStyle(0x172b46,1);g.fillTriangle(-9,-53,-18,-48,-10,-43);
    g.fillStyle(0x48baff,1);g.fillRect(3,-49,5,2);
    g.fillStyle(0x14263c,1);g.fillPoints([{x:7,y:-42},{x:12,y:-39},{x:7,y:-35}],true);

    // Small visible scale markings on neck/cheek and armor.
    g.fillStyle(0x5b9bc4,.95);
    g.fillTriangle(-8,-43,-5,-45,-5,-41);g.fillTriangle(-5,-40,-2,-42,-2,-38);
    g.fillCircle(9,-16,1.5);g.fillCircle(6,-12,1.2);

    // Sword arm and luminous blue blade.
    g.lineStyle(5,0x192b43,1);g.beginPath();
    g.moveTo(13,-13);g.lineTo(attack?30:-24,attack?1:8);g.strokePath();
    g.lineStyle(3,0xb7dfff,1);g.beginPath();
    g.moveTo(attack?28:-22,attack?-1:6);g.lineTo(attack?48:-38,attack?-24:-15);g.strokePath();
    g.lineStyle(1,0x3caaff,1);g.beginPath();
    g.moveTo(attack?28:-22,attack?-1:6);g.lineTo(attack?48:-38,attack?-24:-15);g.strokePath();
    g.fillStyle(0x5bc4ff,.75);g.fillCircle(attack?47:-37,attack?-24:-15,3);

    if(airborne){g.lineStyle(2,0x48aaff,.75);g.beginPath();g.moveTo(-20,-5);g.lineTo(-29,5);g.moveTo(20,-5);g.lineTo(29,5);g.strokePath();}
    if(dodge){g.lineStyle(2,0x55baff,.7);g.strokeEllipse(0,-12,58,35);}
    if(this.state==="attack_2"){g.lineStyle(3,0x3daeff,.85);g.strokeEllipse(15,-8,64,34);}
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
    this.hitbox.update();
  }

  setGroundY(value){this.groundY=value;this.body.setY(value+this.y);}
  destroy(){this.hitbox.destroy();this.body.destroy(true);}
}