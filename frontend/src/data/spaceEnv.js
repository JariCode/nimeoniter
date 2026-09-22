// Space-world (World 3) environment palettes and condition selection.
// Mirrors timeOfDay.js/season.js's data shape exactly (same keys, same
// deterministic seeding) so BaseWorld can swap in these palettes without
// touching the underlying time/season/weather systems at all.

// Sky gradient stops per Space Time (keyed like SKY_STOPS): dawn ->
// "Artificial Dawn" (station lighting ramping up, cool violet with a warm
// accent strip low on the horizon), day -> "Station Day" (bright but still
// deep-space dark, blue-white panel lighting), dusk -> "Station Night"
// (lighting powering down, deep indigo), night -> "Deep Night" (near-black
// void, maximum star contrast).
export const SPACE_SKY_STOPS = {
  dawn:  [['0%', '#241a3a'], ['40%', '#382a52'], ['75%', '#4a3258'], ['100%', '#6a3a4a']],
  day:   [['0%', '#141a30'], ['50%', '#20283f'], ['100%', '#38405a']],
  dusk:  [['0%', '#120f24'], ['45%', '#1c1636'], ['80%', '#241a3c'], ['100%', '#2e1e3a']],
  night: [['0%', '#0a081a'], ['45%', '#070610'], ['100%', '#030308']],
};

// Station deck/ground gradient stops per season (keyed like GROUND_STOPS):
// a metallic platform surface, tinted rather than covered — no grass or
// snow, since the colony sits on a built deck rather than open ground.
export const SPACE_GROUND_STOPS = {
  winter: [['0%', '#4a5468'], ['100%', '#282e3c']], // frost-blue plating
  spring: [['0%', '#3e4a48'], ['100%', '#20281f']], // faint life-support green
  summer: [['0%', '#4a4638'], ['100%', '#26221a']], // warm solar-amber sheen
  autumn: [['0%', '#463c38'], ['100%', '#241d1a']], // rust-worn plating
};

// Same deterministic 2h-block seeding as season.js's weather roll, kept as
// a local copy rather than importing it — space conditions are a separate
// roll from ground weather, just built on the same timing so both stay
// stable within a block and re-roll at the same cadence.
const CONDITION_BLOCK_HOURS = 2;
const BLOCKS_PER_DAY = 24 / CONDITION_BLOCK_HOURS;

function periodSeed(date) {
  const dayKey = date.getFullYear() * 372 + date.getMonth() * 31 + date.getDate();
  const block = Math.floor(date.getHours() / CONDITION_BLOCK_HOURS);
  const key = dayKey * BLOCKS_PER_DAY + block;
  const x = Math.sin(key) * 10000;
  return x - Math.floor(x);
}

// Active space condition right now: 'clear' (most common), 'solarflare',
// 'meteor', 'cosmicstorm', or 'eclipse' — the space-world equivalent of
// getWeather(), on the same deterministic timing.
export function getSpaceCondition(date = new Date()) {
  // return 'eclipse'; // TEST: uncomment to force a condition ('clear'/'solarflare'/'meteor'/'cosmicstorm'/'eclipse'); remove this line afterwards
  const seed = periodSeed(date);
  if (seed >= 0.45) return 'clear';
  if (seed >= 0.30) return 'solarflare';
  if (seed >= 0.18) return 'meteor';
  if (seed >= 0.08) return 'cosmicstorm';
  return 'eclipse';
}
