// Determine season from the real month, with ground palette and overlay type.

export function getSeason(date = new Date()) {
  //return 'winter'; // TESTAUS: poista kommentti kokeillaksesi (winter/spring/summer/autumn), poista rivi lopuksi
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

