export class EnemyController {
  constructor(scene,x,groundY){
    this.scene=scene;this.x=x;this.groundY=groundY;this.hp=100;this.maxHp=100;
    this.speed=58;this.facing=-1;this.flash=0;this.attackCooldown=0;
    this.body=scene.add.container(x,groundY).setDepth(4);
    this.gfx=scene.add.graphics();this.body.add(this.gfx);
    this.bar=scene.add.graphics().setDepth(12);
    this.paint();
  }
  paint(){
    const g=this.gfx;g.clear();const flash=this.flash>0;
    const dark=flash?0xffd4c4:0x171c2c,plate=flash?0xffffff:0x623b42;
    // Horned ash-knight silhouette, layered armor and ember core.
    g.fillStyle(0x050811,.45);g.fillEllipse(0,40,56,11);
    g.fillStyle(dark,1);g.fillRoundedRect(-12,-27,24,57,6);
    g.fillStyle(plate,1);g.fillPoints([{x:-13,y:-25},{x:-22,y:-20},{x:-20,y:-9},{x:-10,y:-7},{x:-7,y:-20}],true);
    g.fillPoints([{x:13,y:-25},{x:22,y:-20},{x:20,y:-9},{x:10,y:-7},{x:7,y:-20}],true);
    g.fillStyle(0x34394a,1);g.fillTriangle(-10,-26,0,-34,10,-26);
    g.fillStyle(0x242a3a,1);g.fillEllipse(0,-42,23,25);
    g.fillStyle(0x080d18,1);g.fillTriangle(-8,-50,-18,-65,-6,-56);g.fillTriangle(8,-50,18,-65,6,-56);
    g.fillStyle(0xff6b3d,1);g.fillRoundedRect(-7,-44,5,2,1);g.fillRoundedRect(2,-44,5,2,1);
    g.fillStyle(0x9d4650,1);g.fillRoundedRect(-10,4,8,27,3);g.fillRoundedRect(2,4,8,27,3);
    g.fillStyle(0x202b3b,1);g.fillRoundedRect(-14,26,13,9,3);g.fillRoundedRect(1,26,13,9,3);
    g.lineStyle(5,0x1b2434,1);g.lineBetween(-15,-12,-26,3);g.lineBetween(15,-12,27,2);
    g.lineStyle(4,0x9b5360,1);g.lineBetween(27,2,34,17);
    g.lineStyle(2,0xd28b66,1);g.lineBetween(34,17,39,24);
    g.fillStyle(0xff743f,.9);g.fillCircle(0,-17,4);
    g.lineStyle(2,0x9a5b64,1);g.lineBetween(-8,-4,8,-4);
  }
  update(dt,targetX){
    this.flash=Math.max(0,this.flash-dt);this.attackCooldown=Math.max(0,this.attackCooldown-dt);
    const dx=targetX-this.x;this.facing=dx>=0?1:-1;
    if(Math.abs(dx)>78)this.x+=Math.sign(dx)*this.speed*dt;
    this.body.setPosition(this.x,this.groundY);
    this.body.setScale(this.facing,1);
    this.paint();
    this.bar.clear();this.bar.fillStyle(0x090d16,.9);this.bar.fillRoundedRect(this.x-29,this.groundY-91,58,7,3);
    this.bar.fillStyle(0xd45b52,1);this.bar.fillRoundedRect(this.x-28,this.groundY-90,56*(this.hp/this.maxHp),5,2);
  }
  takeDamage(amount){
    if(this.hp<=0)return false;
    this.hp=Math.max(0,this.hp-amount);this.flash=.13;
    if(this.hp===0){this.body.setAlpha(.2);this.bar.clear();}
    return true;
  }
  get alive(){return this.hp>0;}
  destroy(){this.body.destroy(true);this.bar.destroy();}
}
