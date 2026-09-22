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
// through it.
export const CITY_CHRISTMAS_ROOFLINE_LIGHTS = [
  // Apartment roofline (x 38-162, y ~142)
  { x: 45, y: 142, color: '#ff3d9a', delay: 0 },
  { x: 63, y: 142, color: '#3de0ff', delay: 0.15 },
  { x: 81, y: 142, color: '#ffd23d', delay: 0.3 },
  { x: 99, y: 142, color: '#ff3d9a', delay: 0.45 },
  { x: 117, y: 142, color: '#3de0ff', delay: 0.6 },
  { x: 135, y: 142, color: '#ffd23d', delay: 0.75 },
  { x: 153, y: 142, color: '#ff3d9a', delay: 0.9 },
  // Hotel roofline (x 157-233, y ~118)
  { x: 165, y: 118, color: '#3de0ff', delay: 0.1 },
  { x: 182, y: 118, color: '#ffd23d', delay: 0.3 },
  { x: 199, y: 118, color: '#ff3d9a', delay: 0.5 },
  { x: 216, y: 118, color: '#3de0ff', delay: 0.7 },
  // Diner roofline (x 216-324, y ~148, above the DINER sign)
  { x: 225, y: 148, color: '#ffd23d', delay: 0 },
  { x: 243, y: 148, color: '#ff3d9a', delay: 0.2 },
  { x: 261, y: 148, color: '#3de0ff', delay: 0.4 },
  { x: 279, y: 148, color: '#ffd23d', delay: 0.6 },
  { x: 297, y: 148, color: '#ff3d9a', delay: 0.8 },
  { x: 315, y: 148, color: '#3de0ff', delay: 1.0 },
  // Skyscraper crown (x 322-382, y ~18)
  { x: 328, y: 18, color: '#ff3d9a', delay: 0 },
  { x: 340.5, y: 18, color: '#3de0ff', delay: 0.25 },
  { x: 353, y: 18, color: '#ffd23d', delay: 0.5 },
  { x: 365.5, y: 18, color: '#ff3d9a', delay: 0.75 },
  { x: 378, y: 18, color: '#3de0ff', delay: 1.0 },
];

// A light strand along the shop's awning edge (awning final footprint is
// x136-204, y216-232 — a trapezoid narrower at the top), ground layer.
export const CITY_CHRISTMAS_AWNING_LIGHTS = [
  { x: 140, y: 222, color: '#ffd23d', delay: 0 },
  { x: 153, y: 219, color: '#3de0ff', delay: 0.2 },
  { x: 170, y: 218, color: '#ff3d9a', delay: 0.4 },
  { x: 187, y: 219, color: '#3de0ff', delay: 0.6 },
  { x: 200, y: 222, color: '#ffd23d', delay: 0.8 },
];

// A neon-outline Christmas tree standee on the street, beside the survivor.
export const CITY_CHRISTMAS_NEON_TREE = { x: FOREGROUND_STANDEE_X, y: FOREGROUND_STANDEE_Y, scale: 1.0 };

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
// slow up/down bob (`.ghost-float`) instead of a strung garland.
export const CITY_EASTER_NEON_EGG_FLOATERS = [
  { x: 90, y: 100, scale: 0.6, color: '#ff9ad1', duration: 6, delay: 0 },
  { x: 190, y: 70, scale: 0.5, color: '#9ae0ff', duration: 7, delay: 1.2 },
  { x: 270, y: 95, scale: 0.55, color: '#ffe89a', duration: 6.5, delay: 0.6 },
  { x: 340, y: 60, scale: 0.45, color: '#c8a0ff', duration: 7.5, delay: 2 },
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
