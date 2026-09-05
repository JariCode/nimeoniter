// Determine season from the real month, with ground palette and overlay type.

import { getTimeOfDay } from './timeOfDay';

export function getSeason(date = new Date()) {
 //return 'summer'; // TESTAUS: poista kommentti kokeillaksesi (winter/spring/summer/autumn), poista rivi lopuksi
  const m = date.getMonth(); // 0 = Jan
  if (m === 11 || m <= 1) return 'winter'; // Dec, Jan, Feb
  if (m >= 2 && m <= 4) return 'spring';   // Mar-May
  if (m >= 5 && m <= 7) return 'summer';   // Jun-Aug
  return 'autumn';                          // Sep-Nov
}

// Ground gradient stops per season
export const GROUND_STOPS = {
  winter: [['0%', '#3a3d42'], ['100%', '#20242a']],
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

// Deterministic pseudo-random 0..1 from a date + time-of-day segment, so
// the weather stays stable within that segment (dawn/day/dusk/night) but
// can change up to a few times a day instead of being fixed for 24h.
const TOD_INDEX = { dawn: 0, day: 1, dusk: 2, night: 3 };

function periodSeed(date) {
  const dayKey = date.getFullYear() * 372 + date.getMonth() * 31 + date.getDate();
  const key = dayKey * 4 + TOD_INDEX[getTimeOfDay(date)];
  const x = Math.sin(key) * 10000;
  return x - Math.floor(x);
}

// Active weather right now: 'rain' sometimes in autumn, 'snow' sometimes
// in winter, 'thunder' sometimes in summer, otherwise none (spring never
// gets weather here).
export function getWeather(date = new Date()) {
  //return 'thunder'; // TESTAUS: poista kommentti kokeillaksesi ('rain'/'snow'/'thunder'), poista rivi lopuksi
  const season = getSeason(date);
  const seed = periodSeed(date);
  if (season === 'autumn' && seed < 0.35) return 'rain';
  if (season === 'winter' && seed < 0.45) return 'snow';
  if (season === 'summer' && seed < 0.25) return 'thunder';
  return null;
}

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

