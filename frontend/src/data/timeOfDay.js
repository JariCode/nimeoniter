// Determine time of day from the real clock, with matching greeting.

export function getTimeOfDay(date = new Date()) {
  //return 'night'; // TESTAUS: poista kommentti kokeillaksesi (dawn/day/dusk/night), poista rivi lopuksi
  const h = date.getHours();
  if (h >= 5 && h < 11) return 'dawn';
  if (h >= 11 && h < 17) return 'day';
  if (h >= 17 && h < 21) return 'dusk';
  return 'night';
}

export const GREETINGS = {
  dawn: 'RISE, SURVIVOR',
  day: 'KEEP GOING',
  dusk: 'STAY SHARP',
  night: 'STILL AWAKE?',
};

// Sky gradient stops per time of day
export const SKY_STOPS = {
  night: [['0%', '#2a2418'], ['45%', '#16140f'], ['100%', '#0b0a08']],
  dawn:  [['0%', '#3a3352'], ['35%', '#7a5a5e'], ['70%', '#c8783c'], ['100%', '#e0954a']],
  day:   [['0%', '#3a5a7e'], ['55%', '#6a88a6'], ['100%', '#a8b4b0']],
  dusk:  [['0%', '#22284a'], ['40%', '#5a3a6a'], ['75%', '#b85a34'], ['100%', '#d67a3a']],
};

// Star visibility per time of day
export const STAR_OPACITY = { night: 1, dawn: 0.3, day: 0, dusk: 0.45 };

// Night uses a radial sky; others use linear (top to horizon)
export const SKY_IS_RADIAL = { night: true, dawn: false, day: false, dusk: false };

// Sun (day/dawn/dusk) or moon (night): position, size, colors
export const CELESTIAL = {
  dawn:  { cx: 310, cy: 150, r: 16, color: '#ffd27a', glow: '#ffb84d', kind: 'sun' },
  day:   { cx: 320, cy: 55,  r: 18, color: '#fff4d6', glow: '#ffe9a8', kind: 'sun' },
  dusk:  { cx: 90,  cy: 150, r: 17, color: '#ff9a5a', glow: '#ff7a3c', kind: 'sun' },
  night: { cx: 305, cy: 60,  r: 15, color: '#e8ecf2', glow: '#c8d4e8', kind: 'moon' },
};