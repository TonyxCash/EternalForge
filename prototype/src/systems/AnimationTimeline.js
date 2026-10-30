import { clipDuration } from "../animation/ClipLibrary.js";

// Emits each authored frame event once, even if a rendered frame spans
// multiple animation frames. This is the synchronization point for combat.
export class AnimationTimeline {
  constructor(clips) {
    this.clips=clips; this.name=null; this.elapsed=0;
    this.lastFrame=-1; this.fired=new Set(); this.complete=false;
  }
  play(name, restart=true) {
    if(!this.clips[name]) throw new Error("Unknown animation clip: "+name);
    if(!restart && this.name===name) return;
    this.name=name; this.elapsed=0; this.lastFrame=-1;
    this.fired.clear(); this.complete=false;
  }
  update(dt,onEvent=()=>{}) {
    if(!this.name || this.complete) return;
    const clip=this.clips[this.name]; this.elapsed+=dt;
    const frame=Math.min(clip.frames.length-1,Math.floor(this.elapsed*clip.fps));
    for(let i=this.lastFrame+1;i<=frame;i++){
      for(const event of clip.events||[]){
        const id=event.frame+":"+event.type;
        if(event.frame===i&&!this.fired.has(id)){this.fired.add(id);onEvent(event);}
      }
    }
    this.lastFrame=frame;
    if(this.elapsed>=clipDuration(clip)){
      if(clip.loop){this.elapsed%=clipDuration(clip);this.lastFrame=-1;this.fired.clear();}
      else this.complete=true;
    }
    return {frame:clip.frames[this.lastFrame],done:this.complete};
  }
  get frame(){
    if(!this.name)return 0;
    const clip=this.clips[this.name];
    return clip.frames[Math.min(clip.frames.length-1,Math.floor(this.elapsed*clip.fps))];
  }
}