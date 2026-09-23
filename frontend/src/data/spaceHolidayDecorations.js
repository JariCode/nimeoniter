// Space-world (world 3) Halloween decoration data, the holographic
// counterpart to the village decorations in holiday.js and the neon
// decorations in cityHolidayDecorations.js. Same viewBox (0 0 400 300) as
// the other worlds, but positioned for the space colony's layout (buildings
// defined in components/BaseWorld/buildings/space.jsx, landing-pad deck
// underfoot) and styled as translucent, scanlined holographic projections
// (low-opacity fills, `softGlow`-filtered cyan/violet/green outlines,
// `.hologram-flicker` from BaseWorld.css) instead of hand-painted props or
// neon signage — in keeping with the colony's already-established hologram
// look (see the NIMEONITER sign's holographic panel in BaseWorld.jsx).
//
// getHoliday() itself lives in holiday.js and is shared by every world —
// only the decoration data is split. Currently only Halloween is built out
// here; every other holiday still renders with no space-specific decoration
// in the scenery (the companion's own costume in SurvivorFace.jsx already
// covers every holiday in every world independently of this file).
//
// Reserved areas avoided by every position below (viewBox 0 0 400 300, all
// building footprints are the FINAL rendered coordinates after each
// building's own translate/scale in buildings/space.jsx — the fully-built
// base was used to verify these, since the solid housings sit lower/wider
// than their small ground-shadow ellipses alone suggest):
//   Background planet    x 261-349  y  20-116  (SPACE_PLANET in BaseWorld.jsx)
//   Survivor companion    x 180-290  y 230-290
//   NIMEONITER sign       x 216-304  y 256-294  (holographic panel + base)
//   Greenhouse dome/ring  x  15-135  y 206-278  (front-row, left cluster)
//   Lab module            x  80-156  y 209-250  (back-row, left cluster)
//   Reactor housing       x 295-385  y 188-266  (front-row, right cluster)
// Empty areas used instead, at MIXED depths rather than one flat row —
// x 135-180 (left of the survivor, clear of every building above) is at
// natural mid-scene depth, while anything over the greenhouse/reactor
// footprints (x 15-135 / x 295-385) has to sit far enough forward (large
// y) to clear that building's solid geometry:
//   Sky, top-left corner  x   0-70  y   0-70   (holo cobweb)
//   Sky, center           x  90-235 y  20-175  (floating holo ghosts)
//   Left, near the survivor  x 135-180 y 250-275 (mid-depth, not forced forward)
//   Left, over the greenhouse x 15-135 y 285-295 (forced forward, its solid roof/ring reaches y 278)
//   Right, over the reactor  x 305-390 y 272-292 (forced forward, its solid housing reaches y 266)

// Ambient violet/green sky-glow tint, a cooler, more alien palette than the
// village's warm orange and the city's single violet wash — kept as two
// separate soft-blurred ellipses (see BaseWorld.jsx) rather than one flat
// tint rect so it reads as drifting haze rather than a solid color wash,
// and positioned clear of the background planet.
export const SPACE_HALLOWEEN_GLOW = {
  violet: '#7a4ce8',
  green: '#3de07a',
};

// A holographic spiderweb projected in the top-left sky corner, the space
// colony's equivalent of the village's HALLOWEEN_COBWEBS / city's
// CITY_HALLOWEEN_NEON_WEB. Only the top-left corner is used (the top-right
// is occupied by the background planet), same reasoning the city's single
// web already follows.
export const SPACE_HALLOWEEN_HOLO_WEB = { x: 4, y: 4, scale: 0.9 };

// A holographic skeleton standing on the landing-pad deck to the left of
// the survivor — the space colony's replacement for the village's
// campfire-side HALLOWEEN_SKELETONS prop. Sits in the clear gap between
// the greenhouse and the survivor (x 135-180) rather than over the
// greenhouse's own footprint, so it reads at natural mid-scene depth
// instead of being forced onto the very front edge of the deck to clear
// the greenhouse's solid roof/ring (an earlier position at x 55/65 did
// land inside that footprint once the greenhouse was actually built).
export const SPACE_HALLOWEEN_HOLO_SKELETON = [
  { x: 148, y: 272, scale: 1.1 },
];

// Floating holographic ghosts drifting slowly through the open sky, one per
// accent color (cyan/violet/green) so the trio reads as separate
// projections rather than one shape repeated. Kept toward the center of the
// sky — clear of the top-left corner (SPACE_HALLOWEEN_HOLO_WEB) and of the
// background planet (x 261-349) — rather than hugging either edge.
export const SPACE_HALLOWEEN_HOLO_GHOSTS = [
  { x: 100, y: 65, scale: 1.0, color: '#3de0ff', duration: 7, delay: 0 },
  { x: 175, y: 105, scale: 0.85, color: '#b24bf3', duration: 8.4, delay: 1.6 },
  { x: 225, y: 60, scale: 0.9, color: '#3de07a', duration: 7.8, delay: 0.8 },
];

// Small holographic jack-o'-lanterns standing on the landing-pad deck,
// scattered at mixed depths and positions rather than lined up in one row
// or bunched in one corner — sizes match the village's own
// HALLOWEEN_PUMPKINS scale range (0.45-0.85), never shrunk to make room.
// Two sit over the greenhouse/reactor footprints and so have to be pushed
// forward (large y) to clear that building's solid geometry, while one per
// side instead sits in the clear gap beside the survivor (x 135-180 /
// x 305-315) at a shallower, more natural depth — the "closer to the
// character" spot with room to breathe instead of every pumpkin crowding
// the far corners.
export const SPACE_HALLOWEEN_HOLO_PUMPKINS = [
  // Left side: one at the far corner, one under the greenhouse (both
  // pushed forward to clear its roof/ring), one shallower by the survivor
  { x: 40, y: 288, scale: 0.6 },
  { x: 115, y: 290, scale: 0.7 },
  { x: 168, y: 258, scale: 0.5 },
  // Right side: two pulled in close beside the sign itself — this pair is
  // rendered after the NIMEONITER sign in BaseWorld.jsx (instead of with
  // the rest of this file's Halloween decorations, right after the
  // reactor) specifically so they can sit this close in without being
  // clipped by the sign's panel; one just above, one just below the third
  // one so they don't stack on it, both kept clear of the sign's own
  // "NIMEONITER" text. The other two stay further out over the reactor's
  // footprint.
  { x: 270, y: 230, scale: 0.55 },
  { x: 312, y: 278, scale: 0.55 },
  { x: 273, y: 252, scale: 0.45 },
  { x: 330, y: 291, scale: 0.85 },
  { x: 350, y: 276, scale: 0.65 },
];
