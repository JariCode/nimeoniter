// Determine the active holiday from the real date, as an extra decoration layer
// on top of the normal world. Holidays COMPLEMENT the world — they never change
// game mechanics, and they don't replace the season/time-of-day/weather systems.
// A holiday is active for the days listed in HOLIDAY_RANGES below.

// Force a holiday for testing. Uncomment one line, then remove it afterwards.
// Values: 'halloween' | 'christmas' | 'newyear' | 'valentines' | 'easter'
// export const TEST_HOLIDAY = 'halloween';
export const TEST_HOLIDAY = null;

// Date ranges per holiday, as [month, day] pairs (month is 1-12 here for
// readability). A holiday spans from `start` to `end` inclusive. Ranges that
// don't cross a month boundary are simple; newyear crosses Dec->Jan and is
// handled by the wrapping logic in inRange. Easter moves every year, so it's
// left out here to be filled in per year when that holiday is built.
export const HOLIDAY_RANGES = {
  // Halloween is celebrated over the last week of October, peaking on the 31st.
  halloween: { startMonth: 10, startDay: 25, endMonth: 10, endDay: 31 },
  // Christmas week.
  christmas: { startMonth: 12, startDay: 20, endMonth: 12, endDay: 26 },
  // New Year crosses the year boundary (Dec 31 - Jan 1).
  newyear: { startMonth: 12, startDay: 31, endMonth: 1, endDay: 1 },
  // Valentine's, a few days around the 14th.
  valentines: { startMonth: 2, startDay: 11, endMonth: 2, endDay: 14 },
  // Easter moves every year; dates are filled in per year when built.
};

// True if (month, day) falls within a holiday's range. Handles ranges that
// wrap across the year boundary (e.g. New Year).
function inRange(month, day, range) {
  const { startMonth, startDay, endMonth, endDay } = range;
  const afterStart = month > startMonth || (month === startMonth && day >= startDay);
  const beforeEnd = month < endMonth || (month === endMonth && day <= endDay);
  if (startMonth <= endMonth) {
    // Normal range within the same year
    return afterStart && beforeEnd;
  }
  // Wrapping range (e.g. Dec 31 -> Jan 1): active if after start OR before end
  return afterStart || beforeEnd;
}

// The active holiday key right now, or null. TEST_HOLIDAY overrides the date.
export function getHoliday(date = new Date()) {
  if (TEST_HOLIDAY) return TEST_HOLIDAY;
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();
  for (const [key, range] of Object.entries(HOLIDAY_RANGES)) {
    if (inRange(month, day, range)) return key;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Halloween decoration data (hand-drawn SVG, same technique as the rest of the
// world). Positions are in the world's SVG coordinate space (viewBox 0 0 400
// 300; ground around y=240-270), matching how FLOWERS are placed in season.js.
// ---------------------------------------------------------------------------

// Jack-o'-lanterns sitting on the ground. Kept clear of x > ~290, where the
// storage shed and watchtower stand once built and would hide anything behind
// them.
export const HALLOWEEN_PUMPKINS = [
  { x: 70, y: 250, scale: 1.0 },
  { x: 150, y: 258, scale: 0.8 },
  { x: 213, y: 253, scale: 0.8 },
  { x: 270, y: 250, scale: 0.6 },
];

// Cobwebs anchored to the top corners of the scene.
export const HALLOWEEN_COBWEBS = [
  { corner: 'left' },
  { corner: 'right' },
];

// Bats drifting in the sky. Kept few so the scene stays readable.
export const HALLOWEEN_BATS = [
  { x: 120, y: 70, scale: 0.9, duration: 9, delay: 0 },
  { x: 200, y: 50, scale: 0.7, duration: 11, delay: 1.5 },
  { x: 260, y: 85, scale: 1.0, duration: 8, delay: 0.8 },
];

// An orange glow tint layered over the sky during Halloween.
export const HALLOWEEN_GLOW = {
  color: '#e8781e',
  opacity: 0.14,
};

// A skeleton resting on the ground, off to one side away from the pumpkins
// and the survivor.
export const HALLOWEEN_SKELETONS = [
  { x: 25, y: 258, scale: 1.0 },
];

// A ghost drifting slowly up and down near the ground, right beside the
// campfire on the survivor's opposite side (survivor sits left of the fire).
// Kept clear of the flame's own shape (x up to ~292) and the storage shed's
// roof (x from ~309), so it isn't hidden behind either.
export const HALLOWEEN_GHOSTS = [
  { x: 300, y: 228, scale: 0.85, duration: 5, delay: 0 },
];

// Small candles placed alongside the pumpkins, flames flickering. Kept clear
// of x > ~290, where the storage shed and watchtower stand once built.
export const HALLOWEEN_CANDLES = [
  { x: 110, y: 257, scale: 1.0, delay: 0 },
  { x: 195, y: 263, scale: 0.85, delay: 0.5 },
  { x: 284, y: 256, scale: 0.75, delay: 1.0 },
];

// ---------------------------------------------------------------------------
// Christmas decoration data (hand-drawn SVG, same technique as Halloween
// above). Christmas coincides with winter, so the snowy ground and falling
// snow already come from the season/weather systems — these only add what
// winter doesn't already have: string lights and a snowman.
// ---------------------------------------------------------------------------

// A string-light garland swagged across the top of the scene, sky-layer so it
// sits above the wall/buildings regardless of what's built. Bulb positions
// follow the sag of the two-swag wire drawn in BaseWorld.jsx, colors cycling
// red/green/gold/blue.
export const CHRISTMAS_LIGHTS = [
  { x: 20, y: 19.3, color: '#d94a3c', delay: 0 },
  { x: 60, y: 23.7, color: '#3f9a5c', delay: 0.3 },
  { x: 100, y: 25.5, color: '#f0c14a', delay: 0.6 },
  { x: 140, y: 24.5, color: '#4a86c8', delay: 0.9 },
  { x: 180, y: 20.9, color: '#d94a3c', delay: 1.2 },
  { x: 220, y: 20.9, color: '#3f9a5c', delay: 0 },
  { x: 260, y: 24.5, color: '#f0c14a', delay: 0.3 },
  { x: 300, y: 25.5, color: '#4a86c8', delay: 0.6 },
  { x: 340, y: 23.7, color: '#d94a3c', delay: 0.9 },
  { x: 380, y: 19.3, color: '#3f9a5c', delay: 1.2 },
];

// A snowman standing on the ground, right beside the campfire on the
// survivor's opposite side — the same spot the Halloween ghost stands in
// (survivor sits left of the fire). Drawn in the foreground, after the
// buildings and campfire, so it isn't clipped by the wall/tower/storage.
export const CHRISTMAS_SNOWMEN = [
  { x: 300, y: 228, scale: 0.9 },
];

// A second, lower string of eave lights, phase-shifted from CHRISTMAS_LIGHTS
// so the top of the scene reads as two overlapping garlands rather than one
// thin line. Same sky layer, same wire-sag technique.
export const CHRISTMAS_EAVES_LIGHTS = [
  { x: 30, y: 34.6, color: '#f0c14a', delay: 0.2 },
  { x: 80, y: 39.0, color: '#4a86c8', delay: 0.5 },
  { x: 130, y: 39.0, color: '#d94a3c', delay: 0.8 },
  { x: 170, y: 36.0, color: '#3f9a5c', delay: 1.1 },
  { x: 230, y: 36.0, color: '#f0c14a', delay: 0.2 },
  { x: 270, y: 39.0, color: '#4a86c8', delay: 0.5 },
  { x: 320, y: 39.0, color: '#d94a3c', delay: 0.8 },
  { x: 370, y: 34.6, color: '#3f9a5c', delay: 1.1 },
];

// A small decorated Christmas tree on the ground, left side of the scene,
// brought well forward into the open foreground apron (y ~276) so it clears
// the hut's roofline (bottom edge ~y=256) instead of sitting against it.
// Clear of the well (x < ~47) and of x > ~290 where the storage shed and
// watchtower stand once built.
export const CHRISTMAS_TREES = [
  { x: 68, y: 276, scale: 1.6 },
];

// Wrapped gifts clustered at the foot of the tree, in the same foreground
// apron as the tree itself.
export const CHRISTMAS_GIFTS = [
  { x: 54, y: 280, scale: 1.15, box: '#8a2f2a', ribbon: '#e8dcc0' },
  { x: 74, y: 285, scale: 1.3, box: '#2f5c3a', ribbon: '#e8c14a' },
  { x: 92, y: 279, scale: 1.0, box: '#3a4a8a', ribbon: '#e8dcc0' },
];

// Warm candles/lanterns on the ground, recycling the Halloween candle shape
// with festive red/green wax instead of plain cream.
export const CHRISTMAS_CANDLES = [
  { x: 150, y: 258, scale: 1.0, wax: '#8a2f2a', delay: 0 },
  { x: 225, y: 252, scale: 0.85, wax: '#2f5c3a', delay: 0.6 },
];

// Faint pale snow mounds for ground texture. Kept low-opacity so they don't
// duplicate the winter season overlay's own snow, just add a little relief.
export const CHRISTMAS_SNOWDRIFTS = [
  { x: 110, y: 266, rx: 16, ry: 3.5, opacity: 0.3 },
  { x: 245, y: 261, rx: 15, ry: 3.5, opacity: 0.3 },
];

// A pine wreath with a bow, hung above the NIMEONITER sign board (board top
// edge at y=260, centered at x=260).
export const CHRISTMAS_WREATH = { x: 260, y: 253, scale: 1.0 };

// ---------------------------------------------------------------------------
// New Year decoration data (hand-drawn SVG, same technique as Halloween and
// Christmas above). New Year coincides with winter, so the snowy ground and
// falling snow already come from the season/weather systems — these only add
// the celebration itself: fireworks, a banner, sparkle, and a toast.
// ---------------------------------------------------------------------------

// Fireworks bursting high in the sky, each with its own rocket rising into
// it. `rise` is how far below the burst point (in px) the rocket starts;
// `duration`/`delay` are staggered so the three never pop in unison. Kept
// well above y=182 (the wall's top edge) so the rocket trail never needs to
// cross behind a building.
export const NEWYEAR_FIREWORKS = [
  { x: 90, burstY: 55, rise: 110, color: '#f0c14a', duration: 4.2, delay: 0 },
  { x: 230, burstY: 45, rise: 125, color: '#d94a3c', duration: 4.6, delay: 1.4 },
  { x: 330, burstY: 65, rise: 95, color: '#3f9a5c', duration: 4.0, delay: 2.6 },
];

// Small golden sparkle points scattered through the sky for ambience,
// twinkling like the existing stars but warmer and on their own rhythm.
export const NEWYEAR_SPARKLES = [
  { x: 20, y: 120, delay: 0 },
  { x: 130, y: 85, delay: 0.6 },
  { x: 190, y: 130, delay: 1.2 },
  { x: 270, y: 100, delay: 0.3 },
  { x: 350, y: 130, delay: 0.9 },
  { x: 60, y: 150, delay: 1.5 },
];

// A faint golden glow tint layered over the sky, lighter than the Halloween
// tint since it's meant to feel festive rather than ominous.
export const NEWYEAR_GLOW = {
  color: '#f0c14a',
  opacity: 0.08,
};

// A pennant banner strung across the very top of the scene, above where the
// fireworks burst. Wire sag follows the same technique as the Christmas
// light garlands.
export const NEWYEAR_BUNTING = [
  { x: 20, y: 8.6, color: '#f0c14a' },
  { x: 80, y: 9.9, color: '#d94a3c' },
  { x: 140, y: 10.7, color: '#3f9a5c' },
  { x: 200, y: 11.0, color: '#f0c14a' },
  { x: 260, y: 10.7, color: '#d94a3c' },
  { x: 320, y: 9.9, color: '#3f9a5c' },
  { x: 380, y: 8.6, color: '#f0c14a' },
];

// A champagne toast — bottle and two clinking glasses — standing on the
// ground right beside the campfire, the same spot the Halloween ghost and
// Christmas snowman use (survivor sits left of the fire). Drawn in the
// foreground, after the buildings and campfire, so it isn't clipped by the
// wall/tower/storage.
export const NEWYEAR_TOASTS = [
  { x: 300, y: 228, scale: 0.85 },
];

// ---------------------------------------------------------------------------
// Valentine's decoration data (hand-drawn SVG, same technique as the other
// holidays above). Valentine's falls in winter too, so the snowy ground and
// falling snow already come from the season/weather systems — these only add
// the romance: floating hearts, a warm glow, a garland, and roses.
// ---------------------------------------------------------------------------

// Floating hearts drifting slowly upward through the sky, fading in and out
// on a loop — the main Valentine's element. Different sizes/colors/timings
// so they read as a gentle drift rather than a uniform grid.
export const VALENTINES_HEARTS = [
  { x: 40, y: 130, scale: 0.7, color: '#e85a78', duration: 8, delay: 0 },
  { x: 110, y: 90, scale: 1.0, color: '#f08aa0', duration: 10, delay: 1.5 },
  { x: 180, y: 140, scale: 0.55, color: '#d9425e', duration: 7, delay: 3 },
  { x: 250, y: 75, scale: 0.85, color: '#e85a78', duration: 9, delay: 0.8 },
  { x: 310, y: 120, scale: 0.65, color: '#f08aa0', duration: 8.5, delay: 2.2 },
  { x: 360, y: 95, scale: 0.75, color: '#d9425e', duration: 9.5, delay: 1 },
];

// A warm pink glow tint layered over the sky, lighter than the Halloween
// tint since it's meant to feel romantic rather than ominous.
export const VALENTINES_GLOW = {
  color: '#e85a7a',
  opacity: 0.1,
};

// A heart garland strung across the very top of the scene, sag following
// the same wire technique as the Christmas light garlands.
export const VALENTINES_GARLAND = [
  { x: 20, y: 15.5, color: '#d9425e' },
  { x: 80, y: 19.1, color: '#f08aa0' },
  { x: 140, y: 21.3, color: '#d9425e' },
  { x: 200, y: 22.0, color: '#f08aa0' },
  { x: 260, y: 21.3, color: '#d9425e' },
  { x: 320, y: 19.1, color: '#f08aa0' },
  { x: 380, y: 15.5, color: '#d9425e' },
];

// A couple of roses on the ground, at the same spots the Christmas candles
// use — already proven clear of the well (x < ~47), the hut/field/fence
// footprints, and x > ~290 where the storage shed and watchtower stand once
// built.
export const VALENTINES_ROSES = [
  { x: 150, y: 258, scale: 1.0, rotate: -6 },
  { x: 225, y: 252, scale: 0.85, rotate: 8 },
];

// A softly pulsing heart-shaped glow near the campfire, on the survivor's
// opposite side — the same spot the Halloween ghost, Christmas snowman, and
// New Year toast use. Drawn in the foreground, after the buildings and
// campfire, so it isn't clipped by the wall/tower/storage.
export const VALENTINES_HEART_GLOWS = [
  { x: 300, y: 228, scale: 0.9 },
];