# Existing Semi-Drago reference — production asset checklist

The source of truth is the already-created EternalForge Semi-Drago reference sheet supplied by the project owner. Do not generate a replacement design. Keep the same male adult warrior identity, dark swept hair, draconic eye, blue-black armor, blue energy sword, scale accents, folded wings at rest and large wings during flight/transformation.

## Important interpretation
The supplied image is a promotional concept sheet, not a production sprite sheet. It contains a hero illustration, portrait, and small combat scene. Those are valuable visual references, but they are not enough independent frames to create fluid run, jump, dodge and combo animations by simply slicing the poster. Never present enlarged crops as finished animation.

## Asset extraction workflow
1. Preserve the untouched original reference in the project's art source folder when the binary asset is added to the repository.
2. Extract the full-body character as a transparent reference cutout; clean silhouette edges and remove all typography/background artifacts.
3. Use the portrait crop only as a face/armor detail reference, not as a gameplay frame.
4. Produce separate consistent transparent frame sequences for idle, run, jump-start, airborne, land, dodge, light attack, heavy attack, hit, knockdown, recovery, spell, wing-open and transformation.
5. Keep fixed canvas size, feet pivot, facing direction, lighting, sword geometry and wing anatomy across every frame.
6. Pack approved frames into an atlas and record exact frame rectangles in JSON. No mixed scales, no automatic trimming that shifts pivots.
7. Calibrate clip FPS and event frames against the controller's hitbox timeline. Hitboxes must be enabled only on authored impact frames.

## Approval gates
- Male face and body proportions remain consistent with the source reference.
- Blue/black armor and blue energy accents remain consistent; no random palette changes.
- Wings are folded at rest and fully articulated when opened.
- Sword hand, blade length, feet position and center of mass do not jump between frames.
- All actions read clearly at iPhone landscape display size.
- Real-device browser test before any claim of release-quality animation.

## Current status
The Phaser prototype currently uses a temporary vector blockout inspired by the reference palette and silhouette. The animation timeline and combat hitbox events are technical scaffolding only. The production atlas has not yet been extracted or authored; this remains an explicit release blocker.
