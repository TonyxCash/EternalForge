# EternalForge — Rebuild specification

## Non-negotiable target
A polished, original 2D fantasy action RPG for iPhone in landscape. The reference is the responsiveness and animation clarity of premium Stickman action games, not their character design. The heroes are Semi-Draghi.

## Character art direction
- Semi-Drago: primarily humanoid silhouette; subtle visible scales and draconic eyes; small folded wings at rest; wings open during transformation. No horns or tail in the base design.
- High-definition, consistent fantasy illustration; readable silhouette at phone scale.
- Separate, purpose-built animation sets for idle, anticipation, locomotion, take-off, airborne, landing, dodge, each attack, hit reaction, knockdown, cast, transformation and death.
- Enemies and bosses must receive the same animation and visual-quality treatment.

## Technical direction
- Rebuild on Phaser 3 with a modular scene/entity architecture rather than extending the monolithic Canvas prototype.
- Use authored sprite atlases / frame-by-frame animation for key character actions. Use carefully controlled layered/rigged secondary motion only where it improves quality (wings, cloth, hair, accessories).
- A finite-state machine owns character action state. Inputs, animation events, movement, collision and hitboxes are synchronized; no independent timers that drift away from animation frames.
- Use fixed-step physics / deterministic update where practical, buffered inputs, coyote time and explicit attack cancel windows.
- Mobile-first landscape controls, safe-area-aware HUD, responsive scaling, pause/resume and local save support.

## Quality gates (must pass before a feature is called done)
1. Every animation has correct frame order, timing, origin and facing direction.
2. Hitboxes activate only on authored active frames; damage and visual impact occur together.
3. Inputs remain responsive and predictable; no stuck states or accidental repeated attacks.
4. State transitions are tested at normal speed, low frame rate and rapid input sequences.
5. Character silhouette and effects remain readable on an iPhone screen.
6. Assets are local to the repository where licensing permits; no fragile unverified third-party sprite URLs in core gameplay.
7. Test in an actual mobile browser before calling the build polished.

## Build order
1. Preserve the previous prototype and establish the new Phaser project shell.
2. Build one hero controller and animation-state machine with placeholder art; validate controls and timing.
3. Create / integrate the final Semi-Drago sprite atlas and polish all core movement/combat animations.
4. Add one enemy with complete telegraphs, attacks, reactions and defeat animation.
5. Add a complete first encounter and level slice; test on iPhone.
6. Expand bosses, environments, progression, equipment, save data and content.

## Honesty rule
A successful GitHub Pages deployment confirms publishing only. It does not prove animation quality or mobile gameplay; those require browser/device testing.
