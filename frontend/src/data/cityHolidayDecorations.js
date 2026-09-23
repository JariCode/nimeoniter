// City-world (world 2) holiday decoration data, the neon counterpart to the
// village decorations in holiday.js. Same five holidays, same sky/ground/
// foreground layering convention, but positioned for the city's SVG layout
// (viewBox 0 0 400 300, buildings defined in components/BaseWorld/buildings/
// city.jsx) instead of the medieval scenery, and styled as glowing neon
// signage/light strings rather than hand-painted props — in keeping with the
// Vegas-strip look of the city buildings (cityGlass/cityConcrete materials,
// neonPinkGlow/neonCyanGlow/neonGoldGlow/neonPurpleGlow gradients, the
// `glow`/`softGlow` filters, and the `neon-pulse` CSS class already defined
// in BaseWorld.jsx / BaseWorld.css).
//
// getHoliday() itself lives in holiday.js and is shared by both worlds —
// only the decoration data is split.
//
// Approximate building footprints this data is laid out against (final
// rendered coordinates, after each building's own scale/translate):
//   Casino     x  23-101   y  95-270  (far left, glass facade reaches street level)
//   Apartment  x  38-162   y 144-222  (mid-left block, stays above the street)
//   Hotel      x 157-233   y 120-222  (mid-right glass tower, stays above the street)
//   Shop       x 136-204   y 216-280  (small storefront, brought forward onto the street)
//   Diner      x 216-324   y 146-220  (center-right, stays above the street)
//   Theater    x 282-387   y 159-268  (right, reaches well past street level)
//   Skyscraper x 322-382   y  15-222  (far right, stays above the street)
//   Street     x   0-400   y 225-249
// The survivor itself (components/Survivor/Survivor.jsx) is drawn around
// x 220-270. GROUND_SLOTS are three positions in the open gap between the
// shop (ends x204) and the survivor, used by the small ground-layer props;
// these were fine as they were. FOREGROUND_STANDEE_X/Y is only the single
// big "sign beside the survivor" — that one was landing on top of the
// character, so it alone is nudged left/forward, clear of the survivor's
// left edge (~220).
const GROUND_SLOTS = [
  { x: 115, y: 246 },
  { x: 210, y: 246 },
  { x: 262, y: 246 },
];
const FOREGROUND_STANDEE_X = 230;
const FOREGROUND_STANDEE_Y = 256;

// ---------------------------------------------------------------------------
// Halloween — neon violet sky tint, magenta-outlined bats, small orange neon
// jack-o'-lantern signs standing on the open street, and a tall neon
// pumpkin standee beside the survivor.
// ---------------------------------------------------------------------------

// A violet neon glow tint over the sky, in place of the village's warm
// orange — reads as "haunted neon" rather than "bonfire orange".
export const CITY_HALLOWEEN_GLOW = {
  color: '#8a2be8',
  opacity: 0.14,
};

// Bats drifting past the rooftops/skyscraper. Reuses the village bat shape
// (`.bat` / `.bat-body` animation classes) with a neon-magenta fill and a
// glow filter instead of the flat silhouette color.
export const CITY_HALLOWEEN_NEON_BATS = [
  { x: 140, y: 55, scale: 1.0, duration: 9, delay: 0 },
  { x: 235, y: 38, scale: 0.8, duration: 11, delay: 1.4 },
  { x: 300, y: 70, scale: 1.1, duration: 8.4, delay: 0.6 },
  { x: 70, y: 82, scale: 0.7, duration: 10, delay: 2.2 },
  { x: 355, y: 95, scale: 0.9, duration: 9.6, delay: 1.8 },
];

// Small neon jack-o'-lantern signs standing on the open street/sidewalk
// (GROUND_SLOTS) — an earlier version mounted these directly on the
// casino/apartment/hotel facades and they landed on top of the window
// grids, so they moved to the ground instead.
export const CITY_HALLOWEEN_MARQUEE_PUMPKINS = GROUND_SLOTS.map((slot, i) => ({
  ...slot,
  scale: [0.8, 0.7, 0.75][i],
}));

// A tall neon pumpkin standee sign on the street, beside the survivor —
// the city's replacement for the campfire-side jack-o'-lantern glow.
export const CITY_HALLOWEEN_NEON_SIGN = { x: FOREGROUND_STANDEE_X, y: FOREGROUND_STANDEE_Y, scale: 1.0 };

// A single, large neon-glow spiderweb filling the otherwise-empty top-left
// sky corner — unlike the village's two hand-drawn cobwebs (one per top
// corner), the city only gets one, since its top-right corner is occupied
// by the skyscraper (x 322-382) and a web there would be clipped.
export const CITY_HALLOWEEN_NEON_WEB = { x: 0, y: 0, scale: 1.0 };

// Floating neon ghosts, up in the open sky above every building's roofline
// rather than at facade height (an earlier version sat at street height and
// read as pasted onto the walls instead of floating). The tallest
// non-skyscraper roof point is the casino's bulb crown at y~129, so y 95-100
// clears all of them with margin; the skyscraper (x 322-382) is the one
// building tall enough to reach this height, so ghost x positions stay
// clear of that whole column instead of just nudging around it. Also kept
// apart from the rooftop bats (CITY_HALLOWEEN_NEON_BATS, centered y 38-95,
// swinging up to +-40 in x during their drift) and from each other.
export const CITY_HALLOWEEN_NEON_GHOSTS = [
  { x: 100, y: 100, scale: 1.0, color: '#3de0ff', duration: 6.5, delay: 0 },
  { x: 210, y: 95, scale: 0.85, color: '#ff3dd4', duration: 7.8, delay: 1.6 },
  { x: 275, y: 100, scale: 0.95, color: '#b24bf3', duration: 7.2, delay: 0.8 },
];

// Extra neon jack-o'-lanterns standing on the pavement in front of the
// casino and theater, which was otherwise bare — same visual as
// CITY_HALLOWEEN_MARQUEE_PUMPKINS, different sizes for natural variation.
// Placed below each building's own ground-contact shadow (casino's is at
// final y~270/x~62, theater's at y~270/x~345) so they read as standing
// closer to the viewer, in front of the facade, rather than merging into
// the building's base.
export const CITY_HALLOWEEN_STREET_PUMPKINS = [
  { x: 45, y: 280, scale: 0.75 },
  { x: 80, y: 288, scale: 0.95 },
  { x: 308, y: 284, scale: 0.85 },
  { x: 348, y: 277, scale: 0.6 },
];

// ---------------------------------------------------------------------------
// Christmas — chasing light strings along building rooflines (the city has
// no snow-covered roofs to decorate, so the lights go where a Vegas strip
// would put them: the roofline itself), a light strand along the shop
// awning, and a neon-outline tree standee.
// ---------------------------------------------------------------------------

// Rooftop chase-light bulbs, grouped per building along its own top edge —
// deliberately NOT one continuous wire across the whole scene (unlike the
// village garland), since the skyscraper is far taller than the other
// buildings and a flat wire at village-garland height would cut straight
// through it. Each bulb carries a `building` key matching the `has(...)`
// build-stage key its roofline belongs to, so BaseWorld.jsx can hold a
// bulb back until that building is actually built — otherwise the lights
// hang in open air over a building that isn't there yet.
//
// Coordinates below are each building's own ROOF RECT (from
// buildings/city.jsx) run through that building's own translate/scale, not
// its wider ground-shadow ellipse — an earlier pass matched the shadow's
// width instead, which put bulbs noticeably past the actual roof edge.
export const CITY_CHRISTMAS_ROOFLINE_LIGHTS = [
  // Apartment roof rect (local x56-126, y162) -> translate(-17,-66.6) scale(1.3)
  // = final x55.8-146.8, y144
  { x: 58, y: 141, color: '#ff3d9a', delay: 0, building: 'apartment' },
  { x: 73, y: 141, color: '#3de0ff', delay: 0.15, building: 'apartment' },
  { x: 88, y: 141, color: '#ffd23d', delay: 0.3, building: 'apartment' },
  { x: 103, y: 141, color: '#ff3d9a', delay: 0.45, building: 'apartment' },
  { x: 118, y: 141, color: '#3de0ff', delay: 0.6, building: 'apartment' },
  { x: 133, y: 141, color: '#ffd23d', delay: 0.75, building: 'apartment' },
  { x: 146, y: 141, color: '#ff3d9a', delay: 0.9, building: 'apartment' },
  // Hotel roof rect (local x172-218, y140) -> translate(-48.75,-55.5) scale(1.25)
  // = final x166.25-223.75, y119.5
  { x: 168, y: 117, color: '#3de0ff', delay: 0.1, building: 'hotel' },
  { x: 187, y: 117, color: '#ffd23d', delay: 0.3, building: 'hotel' },
  { x: 205, y: 117, color: '#ff3d9a', delay: 0.5, building: 'hotel' },
  { x: 222, y: 117, color: '#3de0ff', delay: 0.7, building: 'hotel' },
  // Diner roof rect (local x235-325, y175, inside the diner's own extra
  // translate(0,20)) -> translate(-66,-70.4) scale(1.2) = final x216-324, y163.6
  { x: 220, y: 161, color: '#ffd23d', delay: 0, building: 'diner' },
  { x: 240, y: 161, color: '#ff3d9a', delay: 0.2, building: 'diner' },
  { x: 260, y: 161, color: '#3de0ff', delay: 0.4, building: 'diner' },
  { x: 280, y: 161, color: '#ffd23d', delay: 0.6, building: 'diner' },
  { x: 300, y: 161, color: '#ff3d9a', delay: 0.8, building: 'diner' },
  { x: 320, y: 161, color: '#3de0ff', delay: 1.0, building: 'diner' },
  // Skyscraper main-shaft roof rect (local x326-378, y42) -> translate(-52.8,-33.3)
  // scale(1.15) = final x322.1-381.9, y15 (the tiered setback crown rises
  // further above this, but the shaft's own edge is the building's roofline)
  { x: 325, y: 12, color: '#ff3d9a', delay: 0, building: 'skyscraper' },
  { x: 339, y: 12, color: '#3de0ff', delay: 0.25, building: 'skyscraper' },
  { x: 352, y: 12, color: '#ffd23d', delay: 0.5, building: 'skyscraper' },
  { x: 366, y: 12, color: '#ff3d9a', delay: 0.75, building: 'skyscraper' },
  { x: 379, y: 12, color: '#3de0ff', delay: 1.0, building: 'skyscraper' },
];

// A light strand along the shop's awning edge, ground layer. Every bulb
// belongs to the shop, so they all carry the same `building` key — see
// CITY_CHRISTMAS_ROOFLINE_LIGHTS above for why. Positions follow the
// awning's own flat top edge (local trapezoid top y208, x22-48, inside the
// shop's own translate(-2,-2)) -> translate(104,-196) scale(2) = final
// x144-196, y216 — an earlier pass didn't match this shape either.
export const CITY_CHRISTMAS_AWNING_LIGHTS = [
  { x: 146, y: 213, color: '#ffd23d', delay: 0, building: 'shop' },
  { x: 159, y: 213, color: '#3de0ff', delay: 0.2, building: 'shop' },
  { x: 171, y: 213, color: '#ff3d9a', delay: 0.4, building: 'shop' },
  { x: 184, y: 213, color: '#3de0ff', delay: 0.6, building: 'shop' },
  { x: 196, y: 213, color: '#ffd23d', delay: 0.8, building: 'shop' },
];

// A big, lit neon Christmas tree standing in the empty pavement in front of
// the casino (casino final footprint x 23-101) instead of the small dim
// version that used to stand beside the survivor — moved off
// FOREGROUND_STANDEE_X/Y (which the other three holiday standees still use)
// and given its own position/scale so only Christmas is affected. Kept
// clear of the casino's own "CASINO" marquee (final x ~1-19). y is pushed
// down onto the pavement, past the casino's own ground-contact shadow
// (final ~62,270 — the same depth the Halloween street pumpkins sit at) so
// the tree reads as standing in front of the building rather than pasted
// onto its window grid; the tree render itself was also given a solid dark
// body under the neon outline for the same reason — see the JSX comment.
export const CITY_CHRISTMAS_NEON_TREE = { x: 60, y: 278, scale: 1.9 };

// Neon-glow wrapped gifts piled at the foot of the tree, same box/ribbon
// shape as the village's CHRISTMAS_GIFTS, recolored neon and sized/placed
// to sit visibly in front of (not under) the tree's lowest tier. Kept at
// the same pavement depth as the tree (y 278-290), past the casino's own
// ground-contact shadow, so they don't overlap its window grid either.
export const CITY_CHRISTMAS_GIFTS = [
  { x: 42, y: 282, scale: 0.9, box: '#ff3d9a', ribbon: '#fff6d8' },
  { x: 62, y: 290, scale: 1.15, box: '#3de0ff', ribbon: '#ffd23d' },
  { x: 82, y: 280, scale: 0.75, box: '#b24bf3', ribbon: '#3de0ff' },
  { x: 72, y: 286, scale: 0.65, box: '#ffd23d', ribbon: '#ff3d9a' },
];

// Neon-accented elves standing still in the open foreground — one beside
// the tree/casino, two in front of the theater (theater final footprint
// x 282-387) — each with its own accent color used for its glowing
// pompom/rim-light. Kept clear of the gift pile and the survivor (x 220-270).
export const CITY_CHRISTMAS_ELVES = [
  { x: 28, y: 270, scale: 1.0, glow: '#3de0ff' },
  { x: 312, y: 268, scale: 0.9, glow: '#ff3d9a' },
  { x: 346, y: 274, scale: 1.05, glow: '#ffd23d' },
];

// ---------------------------------------------------------------------------
// New Year — a bigger neon fireworks show over the skyline, more sparkle
// than the village gets, and a neon champagne-toast standee.
// ---------------------------------------------------------------------------

// More bursts than the village's three, in the neon palette used by the
// buildings (pink/cyan/gold/purple) rather than warm reds/greens.
export const CITY_NEWYEAR_FIREWORKS = [
  { x: 70, burstY: 60, rise: 100, color: '#ff3d9a', duration: 4.2, delay: 0 },
  { x: 150, burstY: 40, rise: 130, color: '#3de0ff', duration: 4.6, delay: 1.1 },
  { x: 230, burstY: 55, rise: 110, color: '#ffd23d', duration: 4.0, delay: 2.2 },
  { x: 310, burstY: 35, rise: 135, color: '#b24bf3', duration: 4.8, delay: 0.6 },
  { x: 360, burstY: 65, rise: 95, color: '#ff3d9a', duration: 4.3, delay: 3.1 },
];

// A denser field of sparkle points than the village's six.
export const CITY_NEWYEAR_SPARKLES = [
  { x: 20, y: 110, delay: 0 },
  { x: 90, y: 75, delay: 0.5 },
  { x: 150, y: 130, delay: 1.0 },
  { x: 200, y: 60, delay: 0.2 },
  { x: 260, y: 100, delay: 1.4 },
  { x: 300, y: 130, delay: 0.7 },
  { x: 340, y: 70, delay: 1.8 },
  { x: 375, y: 115, delay: 0.9 },
  { x: 50, y: 145, delay: 1.6 },
  { x: 120, y: 40, delay: 0.3 },
];

// Small sparkle bursts along the open street/sidewalk (GROUND_SLOTS),
// staggered so they don't all twinkle in unison.
export const CITY_NEWYEAR_STREET_SPARKLE = GROUND_SLOTS.map((slot, i) => ({
  x: slot.x,
  y: slot.y - 18, // a little above the ground props, at eye level
  delay: i * 0.6,
}));

// A neon champagne-toast standee on the street, beside the survivor.
export const CITY_NEWYEAR_NEON_TOAST = { x: FOREGROUND_STANDEE_X, y: FOREGROUND_STANDEE_Y, scale: 1.0 };

// Standing neon champagne bottles filling the otherwise-bare pavement in
// front of the casino and theater — the same empty street-level spots the
// Halloween street pumpkins (CITY_HALLOWEEN_STREET_PUMPKINS) and the
// Christmas tree/gifts use. Kept short (like the pumpkins) rather than tall
// (like the tree) so they clear each building's own ground-contact shadow
// (casino final ~62,270 / theater final ~345,270) with only a small, solid
// overlap into the lowest edge of the facade — same margin the pumpkins
// used successfully.
export const CITY_NEWYEAR_STREET_DECOR = [
  // In front of the casino (casino final footprint x 23-101)
  { x: 50, y: 283, scale: 0.9, color: '#3de0ff' },
  { x: 78, y: 277, scale: 0.7, color: '#ff3d9a' },
  // In front of the theater (theater final footprint x 282-387)
  { x: 315, y: 284, scale: 0.85, color: '#ffd23d' },
  { x: 348, y: 274, scale: 0.65, color: '#b24bf3' },
];

// ---------------------------------------------------------------------------
// Valentine's — neon hearts drifting past the skyline, small heart signs
// standing on the open street, and a neon heart-glow standee.
// ---------------------------------------------------------------------------

// A warm magenta neon glow tint, brighter than the village's soft pink.
export const CITY_VALENTINES_GLOW = {
  color: '#ff2d78',
  opacity: 0.12,
};

// More hearts than the village's six, in hot-pink/magenta/cyan neon tones.
export const CITY_VALENTINES_NEON_HEARTS = [
  { x: 35, y: 120, scale: 0.7, color: '#ff3d9a', duration: 8, delay: 0 },
  { x: 100, y: 80, scale: 1.0, color: '#ff6ab0', duration: 10, delay: 1.4 },
  { x: 165, y: 135, scale: 0.55, color: '#3de0ff', duration: 7.2, delay: 2.8 },
  { x: 220, y: 65, scale: 0.85, color: '#ff3d9a', duration: 9, delay: 0.7 },
  { x: 280, y: 115, scale: 0.65, color: '#ff6ab0', duration: 8.6, delay: 2.1 },
  { x: 335, y: 85, scale: 0.75, color: '#3de0ff', duration: 9.4, delay: 1.0 },
  { x: 380, y: 130, scale: 0.6, color: '#ff3d9a', duration: 7.8, delay: 1.9 },
];

// Small neon heart signs standing on the open street/sidewalk
// (GROUND_SLOTS) — an earlier version mounted these on the shop/diner
// facades and they landed on top of the windows, so they moved to the
// ground instead. Only two of the three slots are used here.
export const CITY_VALENTINES_HEART_SIGNS = [
  { ...GROUND_SLOTS[0], scale: 0.6 },
  { ...GROUND_SLOTS[2], scale: 0.55 },
];

// A big pulsing neon heart standee on the street, beside the survivor —
// same visual technique as the village's campfire-side heart glow
// (`.valentine-heart-glow`), recolored to hot neon pink/cyan.
export const CITY_VALENTINES_NEON_HEART_GLOW = { x: FOREGROUND_STANDEE_X, y: FOREGROUND_STANDEE_Y, scale: 1.0 };

// Small neon heart signs filling the same empty pavement spots in front of
// the casino and theater that the Halloween street pumpkins
// (CITY_HALLOWEEN_STREET_PUMPKINS) and New Year champagne bottles
// (CITY_NEWYEAR_STREET_DECOR) already use, plus one at the theater. Kept
// short like those (a backing-rect sign, not a tall standee) so they clear
// each building's own ground-contact shadow (casino final ~62,270 / theater
// final ~345,270) with only the same small, solid overlap those used.
export const CITY_VALENTINES_STREET_HEARTS = [
  // In front of the casino (casino final footprint x 23-101)
  { x: 48, y: 280, scale: 0.7, color: '#ff3d9a' },
  { x: 78, y: 284, scale: 0.55, color: '#ff6ab0' },
  // In front of the theater (theater final footprint x 282-387)
  { x: 312, y: 282, scale: 0.6, color: '#ff2d78' },
  { x: 348, y: 276, scale: 0.5, color: '#ff3d9a' },
];

// ---------------------------------------------------------------------------
// Easter — pastel-neon glow tint, softly bobbing pastel eggs drifting near
// the rooftops (in place of the village's hanging garland, which would cut
// through the skyscraper at that height), neon egg signage standing on the
// street, and a neon bunny standee.
// ---------------------------------------------------------------------------

export const CITY_EASTER_GLOW = {
  color: '#ffb3de',
  opacity: 0.1,
};

// Pastel-neon eggs drifting gently near the rooftops, reusing the ghost's
// slow up/down bob (`.ghost-float`) instead of a strung garland. Spread
// across the whole width of the sky (the original four left the middle-left
// and far-right mostly bare); the tallest non-skyscraper roof point is the
// casino's bulb crown at final y~129 (see the Halloween ghost comment for
// the full breakdown), so every egg here sits well above that, and none
// share the skyscraper's x 322-382 column.
export const CITY_EASTER_NEON_EGG_FLOATERS = [
  { x: 90, y: 100, scale: 0.6, color: '#ff9ad1', duration: 6, delay: 0 },
  { x: 190, y: 70, scale: 0.5, color: '#9ae0ff', duration: 7, delay: 1.2 },
  { x: 270, y: 95, scale: 0.55, color: '#ffe89a', duration: 6.5, delay: 0.6 },
  { x: 340, y: 60, scale: 0.45, color: '#c8a0ff', duration: 7.5, delay: 2 },
  { x: 30, y: 85, scale: 0.5, color: '#ffb3de', duration: 6.8, delay: 1.8 },
  { x: 140, y: 55, scale: 0.55, color: '#c8a0ff', duration: 7.2, delay: 0.9 },
  { x: 230, y: 80, scale: 0.5, color: '#9ae0ff', duration: 6.4, delay: 2.4 },
  { x: 305, y: 65, scale: 0.45, color: '#ffe89a', duration: 7.8, delay: 1.2 },
  { x: 395, y: 90, scale: 0.4, color: '#ff9ad1', duration: 7.0, delay: 0.4 },
];

// Neon-outline eggs standing on the open street/sidewalk (GROUND_SLOTS),
// pastel glow — an earlier version placed the rightmost egg inside the
// theater's shadow, so all three now use the shared safe slots.
export const CITY_EASTER_NEON_EGGS = GROUND_SLOTS.map((slot, i) => ({
  ...slot,
  scale: [0.8, 0.7, 0.75][i],
  color: ['#ff9ad1', '#9ae0ff', '#ffe89a'][i],
}));

// A neon bunny standee on the street, beside the survivor.
export const CITY_EASTER_NEON_BUNNY = { x: FOREGROUND_STANDEE_X, y: FOREGROUND_STANDEE_Y, scale: 1.0 };

// Small neon eggs filling the same empty pavement spots in front of the
// casino and theater that the Halloween street pumpkins, New Year
// champagne bottles, and Valentine's heart signs already use. Unlike
// CITY_EASTER_NEON_EGGS (the outline-only GROUND_SLOTS version, fine there
// since nothing sits behind it), these are drawn with a solid filled body
// — the lesson from the Christmas tree, which started outline-only and let
// the casino's windows show through it.
export const CITY_EASTER_STREET_EGGS = [
  // In front of the casino (casino final footprint x 23-101) — leaves room
  // for CITY_EASTER_NEON_CHICK between them
  { x: 46, y: 283, scale: 0.55, color: '#ff9ad1' },
  { x: 86, y: 278, scale: 0.45, color: '#c8a0ff' },
  // In front of the theater (theater final footprint x 282-387)
  { x: 310, y: 283, scale: 0.5, color: '#9ae0ff' },
  { x: 345, y: 277, scale: 0.5, color: '#ffe89a' },
];

// A single, clearly-readable neon-yellow chick standing in front of the
// casino, between the two street eggs above (CITY_EASTER_STREET_EGGS at
// x 46/86) — round fluffy body, wings, head tuft, eyes and an orange beak,
// not an abstract neon blob, with a bright yellow glow filter + a
// shimmering rim outline as the city's neon touch.
export const CITY_EASTER_NEON_CHICK = { x: 65, y: 284, scale: 1.0 };
