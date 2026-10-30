// Short-lived attack volume. It is enabled only by animation timeline events.
export class CombatHitbox {
  constructor(scene,owner){
    this.scene=scene;this.owner=owner;this.active=false;
    this.damage=0;this.width=0;this.height=0;this.hitTargets=new Set();
    this.debug=scene.add.graphics().setDepth(20);
  }
  arm({damage,width,height}){
    this.active=true;this.damage=damage;this.width=width;this.height=height;this.hitTargets.clear();
  }
  disarm(){this.active=false;this.debug.clear();}
  update(){
    this.debug.clear();
    if(!this.active)return null;
    const x=this.owner.x+this.owner.facing*(this.width*.5+18);
    const y=this.owner.groundY+this.owner.y-22;
    this.debug.fillStyle(0x40bfff,.12);
    this.debug.lineStyle(1,0x40bfff,.35);
    this.debug.fillRoundedRect(x-this.width/2,y-this.height/2,this.width,this.height,5);
    this.debug.strokeRoundedRect(x-this.width/2,y-this.height/2,this.width,this.height,5);
    return {x:x-this.width/2,y:y-this.height/2,width:this.width,height:this.height,damage:this.damage};
  }
  destroy(){this.debug.destroy();}
}