// Space-world (world 3) holiday decoration data, the holographic
// counterpart to the village decorations in holiday.js and the neon
// decorations in cityHolidayDecorations.js. Same viewBox (0 0 400 300) as
// the other worlds, but positioned for the space colony's layout (buildings
// defined in components/BaseWorld/buildings/space.jsx, landing-pad deck
// underfoot) and styled as translucent, scanlined holographic projections
// (low-opacity fills, `softGlow`-filtered outlines, `.hologram-flicker`
// from BaseWorld.css) instead of hand-painted props or neon signage — in
// keeping with the colony's already-established hologram look (see the
// NIMEONITER sign's holographic panel in BaseWorld.jsx). Halloween uses a
// cyan/violet/green palette; Christmas uses cyan plus warm gold/red accents
// (ornaments, elf hats) so the two read as distinct holidays despite
// sharing the same hologram technique.
//
// getHoliday() itself lives in holiday.js and is shared by every world —
// only the decoration data is split. Halloween and Christmas are built out
// here; the other three holidays still render with no space-specific
// decoration in the scenery (the companion's own costume in
// SurvivorFace.jsx already covers every holiday in every world
// independently of this file).
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
//   Comms tower dish      x 106-133  y  70-90   (back-row, left cluster)
//   Habitat pods          x  90-211  y 168-227  (mid-row, left cluster)
//   Reactor housing       x 295-385  y 188-266  (front-row, right cluster)
// Empty areas used instead, at MIXED depths rather than one flat row —
// x 135-180 (left of the survivor, clear of every building above) is at
// natural mid-scene depth, while anything over the greenhouse/reactor
// footprints (x 15-135 / x 295-385) has to sit far enough forward (large
// y) to clear that building's solid geometry:
//   Sky, top-left corner  x   0-70  y   0-70   (holo cobweb)
//   Sky, center           x  90-235 y  20-175  (floating holo ghosts)
//   Sky, wide             x  10-250 y  20-160  (floating lights/snowflakes,
//                                               clear of the habitat pods below)
//   Left, near the survivor  x 135-180 y 250-275 (mid-depth, not forced forward)
//   Left, over the greenhouse x 15-135 y 285-299 (forced forward, its solid roof/ring reaches y 278)
//   Right, over the reactor  x 305-390 y 272-293 (forced forward, its solid housing reaches y 266)

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

// ---------------------------------------------------------------------------
// Christmas — same hologram technique as the Halloween set above, in a
// cyan + warm gold/red palette. Well past the Halloween set's own count and
// the other worlds' own Christmas sets (3 elves + 1 tree + 13 gifts +
// 8 candles + 1 star + 8 lights + 6 snowflakes + 2 glow ellipses = 42),
// spread across mixed depths rather than one front row or a single pile.
// ---------------------------------------------------------------------------

// Ambient cyan/gold sky-glow tint, the Christmas counterpart to
// SPACE_HALLOWEEN_GLOW — same two-ellipse technique and the same safe
// positions (already verified clear of the background planet).
export const SPACE_CHRISTMAS_GLOW = {
  cyan: '#3de0ff',
  gold: '#f0c14a',
};

// A big holographic Christmas star projected in the open sky, clear of the
// comms tower's dish/mast (x 106-133 / y 70-90, the tallest point in that
// corner of the left cluster once built).
export const SPACE_CHRISTMAS_HOLO_STAR = { x: 85, y: 45, scale: 1.1 };

// Three holographic elves, each in its own spot rather than lined up —
// one in the far-left corner (bigger now: an earlier pass at scale 0.65
// read as too small next to everything else), one in the clear gap beside
// the survivor, one on the right. Every ground decoration in this file
// (elves, tree, gifts, candles) is drawn AFTER every space building in
// BaseWorld.jsx, so it always renders in front of — never clipped or hidden
// by — the greenhouse/reactor/etc: there's no need to push these below a
// building's roofline the way an earlier pass over-cautiously did. Depth
// still varies (feet/base y 250-285, not one flat row) so the group reads
// as figures standing at different distances rather than a lineup.
export const SPACE_CHRISTMAS_HOLO_ELVES = [
  { x: 45, y: 283, scale: 1.1 },
  { x: 130, y: 258, scale: 1.0 },
  { x: 348, y: 278, scale: 1.05 },
];

// A holographic Christmas tree standing front and center, right beside the
// survivor — the scene's showpiece — instead of tucked over the reactor's
// footprint on the far right. Kept clear of the survivor's actual figure
// (x 237-253, narrower than its generous x 180-290 reserved box) and of
// the NIMEONITER sign (x 216-304) by a healthy margin either side.
export const SPACE_CHRISTMAS_HOLO_TREE = [
  { x: 195, y: 270, scale: 1.5 },
];

// Holographic gift boxes, scattered at mixed depths across the whole scene
// rather than piled in one spot: three at the foot of the tree, the rest
// spread through the left corner, the mid-left gap, and both sides of the
// reactor's footprint on the right.
export const SPACE_CHRISTMAS_HOLO_GIFTS = [
  // At the tree's foot
  { x: 183, y: 274, scale: 1.3 },
  { x: 206, y: 276, scale: 1.4 },
  { x: 195, y: 281, scale: 1.15 },
  // Right beside the survivor's own feet (final y 221 — the space pose's
  // "translate(243,221) scale(0.7) translate(-243,-221)" pivots exactly on
  // that point, so its boots sit at y 221 despite the scale-down — well
  // above the y 270-300 "front apron" the rest of this scene's ground
  // decorations use), clear of the solar array panels just above (y <= 211)
  { x: 258, y: 222, scale: 0.9 },
  { x: 270, y: 224, scale: 1.0 },
  { x: 282, y: 220, scale: 0.85 },
  // Left corner
  { x: 28, y: 290, scale: 1.15 },
  { x: 55, y: 270, scale: 1.0 },
  // Mid-left gap, beside the second elf
  { x: 133, y: 270, scale: 1.05 },
  { x: 152, y: 250, scale: 0.95 },
  // Right side, spread around the third elf
  { x: 313, y: 267, scale: 1.0 },
  { x: 340, y: 282, scale: 1.2 },
  { x: 378, y: 291, scale: 1.05 },
];

// Holographic candles keeping the gifts/tree company, same wax-body shape
// as the village's HALLOWEEN_CANDLES/CHRISTMAS_CANDLES, recolored as a
// hologram with a warm gold flame — scattered across the same zones as the
// gifts, at varying depths.
export const SPACE_CHRISTMAS_HOLO_CANDLES = [
  { x: 366, y: 294, scale: 1.2, delay: 0 },
  { x: 384, y: 286, scale: 1.0, delay: 0.5 },
  { x: 63, y: 296, scale: 1.15, delay: 0.25 },
  { x: 33, y: 275, scale: 0.95, delay: 0.9 },
  { x: 145, y: 258, scale: 1.05, delay: 1.2 },
  { x: 168, y: 272, scale: 0.85, delay: 0.4 },
  { x: 325, y: 272, scale: 1.1, delay: 0.7 },
  { x: 357, y: 266, scale: 0.95, delay: 1.5 },
];

// Small floating holographic lights drifting through the open sky, cyan
// and gold alternating — the space colony's replacement for the village's
// wire-strung CHRISTMAS_LIGHTS (there's no eave to hang a wire from up
// here). Kept clear of the star and the habitat pods below (y <= 140).
export const SPACE_CHRISTMAS_HOLO_LIGHTS = [
  { x: 20, y: 45, color: '#3de0ff', delay: 0 },
  { x: 200, y: 50, color: '#f0c14a', delay: 0.3 },
  { x: 240, y: 90, color: '#3de0ff', delay: 0.6 },
  { x: 150, y: 120, color: '#f0c14a', delay: 0.9 },
  { x: 30, y: 130, color: '#3de0ff', delay: 1.2 },
  { x: 190, y: 140, color: '#f0c14a', delay: 0.15 },
  { x: 60, y: 100, color: '#3de0ff', delay: 0.45 },
  { x: 220, y: 35, color: '#f0c14a', delay: 0.75 },
];

// Floating holographic snowflakes drifting slowly through the open sky,
// spread apart from the lights above so the two sets read as separate
// layers of ambience rather than overlapping.
export const SPACE_CHRISTMAS_HOLO_SNOWFLAKES = [
  { x: 45, y: 60, scale: 1.0, duration: 6, delay: 0 },
  { x: 170, y: 45, scale: 0.85, duration: 7, delay: 1.2 },
  { x: 230, y: 130, scale: 0.9, duration: 6.5, delay: 0.5 },
  { x: 100, y: 150, scale: 0.8, duration: 7.5, delay: 2 },
  { x: 15, y: 100, scale: 0.95, duration: 6.8, delay: 1.8 },
  { x: 250, y: 70, scale: 0.85, duration: 7.2, delay: 0.9 },
];

// ---------------------------------------------------------------------------
// New Year — same hologram technique as the Halloween/Christmas sets above,
// in cyan + warm gold. Positions reuse the same safe zones those two
// holidays already proved out (not reinvented from scratch): the open sky
// left of the planet for fireworks/sparkles, the gap beside the survivor
// (x 135-180) for a natural-depth toast, and the greenhouse/reactor
// footprints' forced-forward apron for the rest. A rich, busy set —
// 2 glow ellipses + 6 fireworks + 22 sparkles + 5 toasts (each with its own
// embedded champagne bubbles) — comfortably past the Halloween set's count
// and in the same range as the Christmas one.
// ---------------------------------------------------------------------------

// Ambient cyan/gold sky-glow tint, same two-ellipse technique and the same
// safe positions as SPACE_HALLOWEEN_GLOW/SPACE_CHRISTMAS_GLOW.
export const SPACE_NEWYEAR_GLOW = {
  cyan: '#3de0ff',
  gold: '#f0c14a',
};

// Holographic fireworks bursting in the open sky, spread across the same
// x 30-235 band the Halloween ghosts and Christmas star already proved
// clear of the background planet (x 261-349) and the comms tower's dish
// (x 106-133 / y 70-90).
export const SPACE_NEWYEAR_HOLO_FIREWORKS = [
  { x: 35, burstY: 55, rise: 90, color: '#3de0ff', duration: 4.2, delay: 0 },
  { x: 85, burstY: 38, rise: 110, color: '#f0c14a', duration: 4.6, delay: 1.3 },
  { x: 115, burstY: 45, rise: 100, color: '#3de0ff', duration: 4.3, delay: 3.0 },
  { x: 150, burstY: 62, rise: 95, color: '#f0c14a', duration: 4.0, delay: 2.4 },
  { x: 195, burstY: 40, rise: 105, color: '#3de0ff', duration: 4.4, delay: 0.7 },
  { x: 232, burstY: 72, rise: 85, color: '#f0c14a', duration: 3.9, delay: 1.9 },
];

// Scattered holographic sparkle points twinkling through the open sky,
// the same wide zone the Christmas lights/snowflakes already use
// (x 10-250, y 20-160, clear of the habitat pods below).
export const SPACE_NEWYEAR_HOLO_SPARKLES = [
  { x: 15, y: 35, delay: 0 }, { x: 60, y: 25, delay: 0.3 }, { x: 100, y: 140, delay: 0.6 },
  { x: 140, y: 30, delay: 0.9 }, { x: 180, y: 110, delay: 1.2 }, { x: 220, y: 55, delay: 0.15 },
  { x: 240, y: 130, delay: 0.45 }, { x: 30, y: 90, delay: 0.75 }, { x: 70, y: 150, delay: 1.05 },
  { x: 120, y: 60, delay: 1.35 }, { x: 160, y: 150, delay: 0.2 }, { x: 200, y: 20, delay: 0.5 },
  { x: 45, y: 120, delay: 0.8 }, { x: 90, y: 45, delay: 1.1 }, { x: 230, y: 90, delay: 1.4 },
  { x: 10, y: 60, delay: 0.1 }, { x: 50, y: 150, delay: 0.4 }, { x: 130, y: 100, delay: 0.7 },
  { x: 170, y: 70, delay: 1.0 }, { x: 210, y: 135, delay: 1.3 }, { x: 25, y: 50, delay: 0.25 },
  { x: 245, y: 40, delay: 0.55 },
];

// Holographic champagne toasts standing on the landing-pad deck, spread
// across the whole scene rather than bunched on one side. Only the one in
// the clear gap beside the survivor keeps the full bottle + two clinking
// flutes (`glasses: true`, the default) — the rest are bottle-only
// (`glasses: false`, see the JSX) so a cluster of toasts doesn't read as a
// crowd of clinking glasses.
export const SPACE_NEWYEAR_HOLO_TOASTS = [
  { x: 48, y: 288, scale: 1.0, glasses: false },
  { x: 155, y: 262, scale: 0.9 },
  { x: 300, y: 278, scale: 0.9, glasses: false },
  { x: 345, y: 272, scale: 0.85, glasses: false },
  // Right beside the survivor, at the same height as its own feet. The
  // space pose's own boots sit at y 221 inside <Survivor> (its outer
  // "translate(243,221) scale(0.7) translate(-243,-221)" pivots exactly on
  // that point), but BaseWorld.jsx wraps <Survivor> in its own
  // `translate(0, 20)` — easy to miss, and missed in an earlier pass — so
  // the boots' actual final y is 241, not 221.
  { x: 253, y: 255, scale: 0.85, glasses: false },
];
