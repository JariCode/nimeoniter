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