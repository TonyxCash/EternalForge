# Semi-Drago — visual reference and asset rules

## Source of truth
Use the existing EternalForge concept sheets already created for this project. Do not generate replacement character images or drift into a different character design.

The lead character is a **male adult Semi-Drago**. The existing blue/black armored warrior is the visual target:
- athletic masculine proportions and a clearly male face;
- dark navy/black layered armor with steel-blue plates and restrained blue luminous accents;
- dark swept hair, draconic eye and small scale details;
- compact folded wings at rest; wings open only for airborne/transformation actions;
- sword with blue energy edge;
- strong readable silhouette at actual mobile gameplay scale.

## Animation target
The concept sheet's small poses are references for action and timing, not production-ready sprite frames. Do not stretch a tiny pose or crop a promotional collage and call it a finished animation atlas.

The production character asset must be an isolated transparent sprite atlas with consistent scale, pivot, lighting, facing direction and frame spacing. Create distinct authored sequences for:
- idle, run, jump anticipation, airborne, landing;
- dodge, light attack, heavy attack, combo follow-through;
- hit reaction, knockdown/recovery, spell cast;
- wing opening, draconic transformation and transformation return.

The animation event timeline remains authoritative for attack windows, hitbox activation, invulnerability and cancel windows. Visual frame timing must be calibrated against those events.

## Current implementation status
prototype/src/entities/HeroController.js now has a temporary male Semi-Drago vector blockout based on the existing reference palette and silhouette. It is only a gameplay placeholder used to validate scale, facing, movement and state transitions. It is not the final art and must be replaced by the isolated authored sprite atlas before the first quality release.

## Acceptance checks
1. The character reads as male and recognizable at iPhone landscape scale.
2. Folded wings are visible without obscuring the silhouette; open wings have their own authored sequence.
3. No frame pops, pivots, scale drift or inconsistent sword placement.
4. Every hit frame matches the active hitbox window; visual effects do not create false hit feedback.
5. Test on a real iPhone browser before claiming animation quality or release readiness.
