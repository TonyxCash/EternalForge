// Authored clip metadata. Durations and event frames are centralized so
// sprite animation, movement and hitboxes can share the same timeline.
export const HERO_CLIPS = Object.freeze({
  idle:       { frames:[0,1,2,3], fps:7,  loop:true },
  run:        { frames:[0,1,2,3,4,5], fps:12, loop:true },
  jump_start: { frames:[0,1,2], fps:15, loop:false },
  air:        { frames:[0,1,2,3], fps:8, loop:true },
  land:       { frames:[0,1,2], fps:15, loop:false },
  dodge:      { frames:[0,1,2,3], fps:18, loop:false },
  attack_1:   { frames:[0,1,2,3,4,5], fps:18, loop:false,
                events:[{frame:2,type:"hit_on"},{frame:4,type:"hit_off"}] },
  attack_2:   { frames:[0,1,2,3,4,5,6], fps:18, loop:false,
                events:[{frame:3,type:"hit_on"},{frame:6,type:"hit_off"}] },
  hit:        { frames:[0,1,2], fps:14, loop:false }
});

export function clipDuration(clip) {
  return clip.frames.length / clip.fps;
}