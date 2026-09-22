// Determine season from the real month, with ground palette and overlay type.

export function getSeason(date = new Date()) {
  //return 'winter'; // TEST: uncomment to force a season (winter/spring/summer/autumn); remove this line afterwards
  const m = date.getMonth(); // 0 = Jan
  if (m === 11 || m <= 1) return 'winter'; // Dec, Jan, Feb
  if (m >= 2 && m <= 4) return 'spring';   // Mar-May
  if (m >= 5 && m <= 7) return 'summer';   // Jun-Aug
  return 'autumn';                          // Sep-Nov
}

// Ground gradient stops per season
export const GROUND_STOPS = {
  // Lightened from #3a3d42/#20242a to read as snow-dusted ground rather than
  // plain dark dirt, while staying dark enough to match the other seasons'
  // overall value (the `snow` overlay below adds the actual white blanket).
  winter: [['0%', '#565c66'], ['100%', '#33383f']],
  spring: [['0%', '#2a3018'], ['100%', '#161c0d']],
  summer: [['0%', '#2e3618'], ['100%', '#181f0c']],
  autumn: [['0%', '#2a2012'], ['100%', '#14100a']],
};

// Overlay kind per season: 'snow' | 'flowers' | 'flowersDense' | 'puddles'
export const SEASON_OVERLAY = {
  winter: 'snow',
  spring: 'flowers',
  summer: 'flowersDense',
  autumn: 'puddles',
};

// Deterministic pseudo-random 0..1 from a date + short fixed-length block, so
// weather stays stable within that block but re-rolls often — using the
// dawn/day/dusk/night segments here would let rain/snow/thunder run for a
// whole 4-8h segment (and longer if the next segment rolls the same way).
const WEATHER_BLOCK_HOURS = 2;// 2h blocks, so 12 blocks per day
const BLOCKS_PER_DAY = 24 / WEATHER_BLOCK_HOURS;

function periodSeed(date) {
  const dayKey = date.getFullYear() * 372 + date.getMonth() * 31 + date.getDate();
  const block = Math.floor(date.getHours() / WEATHER_BLOCK_HOURS);
  const key = dayKey * BLOCKS_PER_DAY + block;
  const x = Math.sin(key) * 10000;
  return x - Math.floor(x);
}

// Active weather right now: 'rain' sometimes in autumn, 'snow' sometimes
// in winter, 'thunder' sometimes in summer, otherwise none (spring never
// gets weather here).
export function getWeather(date = new Date()) {
  // return 'thunder'; // TEST: uncomment to force weather ('rain'/'snow'/'thunder'); remove this line afterwards
  const season = getSeason(date);
  const seed = periodSeed(date);
  if (season === 'autumn' && seed < 0.35) return 'rain';
  if (season === 'winter' && seed < 0.45) return 'snow';
  if (season === 'summer' && seed < 0.25) return 'thunder';
  return null;
}

// A single classic snowman standing in the foreground whenever it's winter
// (season === 'winter'), independent of any holiday — reused as-is in both
// worlds, since a plain white snowman doesn't need a neon reinterpretation
// to fit the city. Position differs per world because the open foreground
// gaps differ:
//  - village: the whole right side of the scene is tightly packed at
//    building height — the always-on NIMEONITER sign (final x 220-300),
//    the storage shed (final x ~295-365 — roof apex y~219, window at
//    x~322-333/y~249-260, plain dark lower wall at x~333-351/y~253-279)
//    and the watchtower (final x 360-403, ground shadow y~280) all overlap
//    in x. Same scale as the other seasonal props (0.7) — an earlier
//    version at this scale but y270 put its hat inside the shed's window;
//    rather than shrinking it, it's pushed down to y288, clear of the
//    shed's window and roof, with only its lower body overlapping the
//    shed's plain dark wall (not a distinctive feature, so it reads as
//    standing in front of the shed rather than pasted onto it) — the same
//    "small solid overlap with a plain surface is fine" pattern used for
//    the city's street props against the casino/theater.
//  - city: clear of the casino (x 23-101) and the shop (x 136-204, which
//    reaches down to street level), placed in the open pavement gap
//    between them — the apartment building sits above that gap but stops
//    at final y~222, well above street level, so it doesn't reach down
//    into this spot. Also checked against the parked car (final x ~119-189,
//    but its shadow stops at y~250, well above this snowman's y256+).
// Both positions are also well clear of the survivor (x 220-270) and,
// in the city, the NIMEONITER sign (final x 214-306).
export const WINTER_SNOWMAN = {
  village: { x: 335, y: 288, scale: 0.7 },
  city: { x: 118, y: 278, scale: 0.6 },
};

// Fixed flower positions (so they don't jump around on every render)
export const FLOWERS = [
  { x: 45, y: 250, c: '#e0d040' }, { x: 80, y: 244, c: '#e86a8a' },
  { x: 120, y: 256, c: '#e8e8f0' }, { x: 165, y: 248, c: '#f0c840' },
  { x: 210, y: 254, c: '#e86a8a' }, { x: 255, y: 246, c: '#e8e8f0' },
  { x: 300, y: 252, c: '#f08040' }, { x: 345, y: 245, c: '#e0d040' },
  { x: 60, y: 258, c: '#e86a8a' }, { x: 190, y: 260, c: '#f0c840' },
  { x: 270, y: 258, c: '#e8e0f0' }, { x: 320, y: 260, c: '#e86a8a' },
  { x: 100, y: 262, c: '#f0c840' }, { x: 230, y: 262, c: '#e8e8f0' },
];

