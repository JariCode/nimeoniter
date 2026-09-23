import './BaseWorld.css';
import Survivor from '../Survivor/Survivor';
import { getTimeOfDay, SKY_STOPS, STAR_OPACITY, SKY_IS_RADIAL, CELESTIAL } from '../../data/timeOfDay';
import { getSeason, GROUND_STOPS, SEASON_OVERLAY, FLOWERS, getWeather, WINTER_SNOWMAN } from '../../data/season';
import { SPACE_SKY_STOPS, SPACE_GROUND_STOPS, getSpaceCondition } from '../../data/spaceEnv';
import { currentWorldFromBuilt } from '../../data/world';
import { Wall, House, Hut, Well, Field, Storage, Fence, Watchtower } from './buildings/medieval';
import { Street, Apartment, Diner, Shop, Hotel, Casino, Theater, Skyscraper } from './buildings/city';
import {
  LandingPad, Habitat, Greenhouse, SolarArray, CommsTower, Lab, Reactor, CommandTower,
} from './buildings/space';
import {
  getHoliday,
  HALLOWEEN_PUMPKINS, HALLOWEEN_COBWEBS, HALLOWEEN_BATS, HALLOWEEN_GLOW, HALLOWEEN_SKELETONS, HALLOWEEN_GHOSTS, HALLOWEEN_CANDLES,
  CHRISTMAS_LIGHTS, CHRISTMAS_EAVES_LIGHTS, CHRISTMAS_ELVES, CHRISTMAS_TREES, CHRISTMAS_GIFTS, CHRISTMAS_CANDLES, CHRISTMAS_SNOWDRIFTS, CHRISTMAS_WREATH,
  NEWYEAR_FIREWORKS, NEWYEAR_SPARKLES, NEWYEAR_GLOW, NEWYEAR_BUNTING, NEWYEAR_TOASTS,
  VALENTINES_HEARTS, VALENTINES_GLOW, VALENTINES_GARLAND, VALENTINES_ROSES, VALENTINES_HEART_GLOWS,
  EASTER_EGGS, EASTER_FLOWERS, EASTER_GLOW, EASTER_GARLAND, EASTER_BUNNIES,
} from '../../data/holiday';
import {
  CITY_HALLOWEEN_GLOW, CITY_HALLOWEEN_NEON_BATS, CITY_HALLOWEEN_MARQUEE_PUMPKINS, CITY_HALLOWEEN_NEON_SIGN,
  CITY_HALLOWEEN_NEON_WEB, CITY_HALLOWEEN_NEON_GHOSTS, CITY_HALLOWEEN_STREET_PUMPKINS,
  CITY_CHRISTMAS_ROOFLINE_LIGHTS, CITY_CHRISTMAS_AWNING_LIGHTS, CITY_CHRISTMAS_NEON_TREE,
  CITY_CHRISTMAS_GIFTS, CITY_CHRISTMAS_ELVES,
  CITY_NEWYEAR_FIREWORKS, CITY_NEWYEAR_SPARKLES, CITY_NEWYEAR_STREET_SPARKLE, CITY_NEWYEAR_NEON_TOAST,
  CITY_NEWYEAR_STREET_DECOR,
  CITY_VALENTINES_GLOW, CITY_VALENTINES_NEON_HEARTS, CITY_VALENTINES_HEART_SIGNS, CITY_VALENTINES_NEON_HEART_GLOW,
  CITY_VALENTINES_STREET_HEARTS,
  CITY_EASTER_GLOW, CITY_EASTER_NEON_EGG_FLOATERS, CITY_EASTER_NEON_EGGS, CITY_EASTER_NEON_BUNNY,
  CITY_EASTER_STREET_EGGS, CITY_EASTER_NEON_CHICK,
} from '../../data/cityHolidayDecorations';
import {
  SPACE_HALLOWEEN_GLOW, SPACE_HALLOWEEN_HOLO_WEB, SPACE_HALLOWEEN_HOLO_SKELETON,
  SPACE_HALLOWEEN_HOLO_GHOSTS, SPACE_HALLOWEEN_HOLO_PUMPKINS,
  SPACE_CHRISTMAS_GLOW, SPACE_CHRISTMAS_HOLO_STAR, SPACE_CHRISTMAS_HOLO_ELVES,
  SPACE_CHRISTMAS_HOLO_TREE, SPACE_CHRISTMAS_HOLO_LIGHTS, SPACE_CHRISTMAS_HOLO_SNOWFLAKES,
  SPACE_CHRISTMAS_HOLO_GIFTS, SPACE_CHRISTMAS_HOLO_CANDLES,
  SPACE_NEWYEAR_GLOW, SPACE_NEWYEAR_HOLO_FIREWORKS, SPACE_NEWYEAR_HOLO_SPARKLES, SPACE_NEWYEAR_HOLO_TOASTS,
  SPACE_VALENTINES_GLOW, SPACE_VALENTINES_HOLO_HEARTS_SKY, SPACE_VALENTINES_HOLO_HEARTS_GROUND,
  SPACE_VALENTINES_HOLO_ROBOT,
} from '../../data/spaceHolidayDecorations';

// How many buildings are built, from the current stage key.
// 'camp' = 0 built; otherwise index in buildStages + 1.
function builtCountFromKey(buildStages, stageKey) {
  if (stageKey === 'camp') return 0;
  const i = buildStages.findIndex((s) => s.key === stageKey);
  return i === -1 ? 0 : i + 1;
}

// City-world sky gradient stops, one per time-of-day key — a dark, neon-tinted
// skyline palette that stands in for the medieval SKY_STOPS when world is
// 'city'. Keyed identically to SKY_STOPS; the time-of-day system itself
// (getTimeOfDay) is untouched, this only swaps which colors it points at.
const CITY_SKY_STOPS = {
  night: [['0%', '#0c0a1a'], ['45%', '#150f28'], ['80%', '#2a1030'], ['100%', '#170a1c']],
  dawn:  [['0%', '#231a3a'], ['35%', '#4a2650'], ['70%', '#7a3a5a'], ['100%', '#a8446a']],
  day:   [['0%', '#3a4468'], ['55%', '#5c6690'], ['100%', '#8a86a0']],
  dusk:  [['0%', '#1c1638'], ['40%', '#3a1e56'], ['75%', '#7a2e64'], ['100%', '#a83a5c']],
};

// City-world ground gradient stops, one per season key — dark asphalt tones
// standing in for the medieval GROUND_STOPS. Keyed identically to
// GROUND_STOPS; the season system itself (getSeason) is untouched.
// Lightened relative to the street's own `#18161f` fill so the ground
// reads as a distinct surface behind/around the street instead of
// blending into it.
const CITY_GROUND_STOPS = {
  // Lightened from #343a4a/#1e212c so the asphalt reads as snow-dusted,
  // matching the village's own winter lightening below.
  winter: [['0%', '#4b5268'], ['100%', '#2c303e']],
  spring: [['0%', '#2f324a'], ['100%', '#1c1e2c']],
  summer: [['0%', '#322e46'], ['100%', '#1e1a28']],
  autumn: [['0%', '#2c2a42'], ['100%', '#1c1926']],
};

// Fixed rain/snow particle positions and timing, spread across the canvas
// with staggered delays/durations so they don't fall in visible unison.
const RAIN_DROPS = Array.from({ length: 26 }, (_, i) => ({
  x: (i * 37 + 13) % 400,
  delay: (i % 7) * 0.18,
  duration: 0.7 + (i % 5) * 0.08,
}));

const SNOW_FLAKES = Array.from({ length: 28 }, (_, i) => ({
  x: (i * 29 + 8) % 400,
  r: 1 + (i % 3) * 0.6,
  delay: (i % 10) * 0.4,
  duration: 5 + (i % 6) * 1.3,
}));

// Heavier, faster drops for a thunderstorm downpour
const STORM_RAIN_DROPS = Array.from({ length: 40 }, (_, i) => ({
  x: (i * 23 + 7) % 400,
  delay: (i % 8) * 0.11,
  duration: 0.45 + (i % 5) * 0.05,
}));

// Two lightning bolt shapes striking down from different points in the sky
const LIGHTNING_BOLTS = [
  { path: 'M 95 -5 L 88 45 L 102 45 L 82 100 L 96 100 L 70 165', delay: 0 },
  { path: 'M 305 -5 L 296 50 L 312 50 L 290 110 L 306 110 L 278 170', delay: 3.4 },
];

// A few scattered clouds high in the sky, clear of the sun/moon band
// (celestial cy ranges 55-150) and the buildings below.
const CLOUD_SHAPES = [
  { cx: 65, cy: 40, s: 1.5 },
  { cx: 195, cy: 25, s: 1.7 },
  { cx: 330, cy: 45, s: 1.4 },
];

// Embers drifting up from the campfire, on top of the existing flicker
const SPARKS = [
  { x: 274, drift: -5, delay: 0, duration: 2.2 },
  { x: 281, drift: 4, delay: 0.8, duration: 1.9 },
  { x: 287, drift: -3, delay: 1.5, duration: 2.4 },
  { x: 278, drift: 6, delay: 2.3, duration: 2 },
];

// Meteors that streak across the night sky now and then — different cycle
// lengths (co-prime-ish) so the two never line up.
const SHOOTING_STARS = [
  { x: 55, y: 26, dx: 60, dy: 30, duration: 17, delay: 2 },
  { x: 250, y: 20, dx: -55, dy: 28, duration: 23, delay: 9 },
];

// Birds drifting across the daytime sky now and then, each its own height
// and timing so they don't fly in formation.
const BIRDS = [
  { y: 48, duration: 24, delay: 1 },
  { y: 66, duration: 29, delay: 11 },
  { y: 38, duration: 21, delay: 19 },
];

// Ray angles for a firework burst (8 evenly spaced spokes radiating out).
const FIREWORK_RAY_ANGLES = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2);

// ===== Space-world (World 3) background data =====

// Background planet, one look per Space Time — colors only, so it's tinted
// by the same tod key the sky gradient uses. Sits high in the sky, clear
// of the celestial (sun/moon) band.
const SPACE_PLANET = {
  dawn:  { cx: 305, cy: 72, r: 44, base: '#8a6a9a', shade: '#3e2c4a', band: '#d29a78' },
  day:   { cx: 305, cy: 64, r: 44, base: '#9aa8c4', shade: '#4a5470', band: '#d8e0ee' },
  dusk:  { cx: 305, cy: 72, r: 44, base: '#5a4272', shade: '#241a34', band: '#8a5a7c' },
  night: { cx: 305, cy: 68, r: 44, base: '#38395a', shade: '#16172a', band: '#565888' },
};

// Faint seasonal tint washed over the planet at low opacity — the only
// place season shows in the space sky (space has no weather/foliage).
const SPACE_SEASON_TINT = { winter: '#8fb8ff', spring: '#8fffb0', summer: '#ffd98f', autumn: '#ff9f6a' };

// Dense starfield, always visible in space (no atmosphere to wash it out
// at "day") — spread wider than the village/city star cluster.
const SPACE_STARS = [
  { x: 30, y: 30, r: 1 }, { x: 75, y: 55, r: 0.8 }, { x: 20, y: 100, r: 1.1 },
  { x: 110, y: 20, r: 0.9 }, { x: 150, y: 90, r: 1 }, { x: 190, y: 45, r: 0.8 },
  { x: 230, y: 110, r: 1.2 }, { x: 260, y: 30, r: 0.8 }, { x: 355, y: 100, r: 1 },
  { x: 375, y: 50, r: 0.9 }, { x: 130, y: 130, r: 0.8 }, { x: 55, y: 150, r: 1 },
  { x: 340, y: 150, r: 0.9 }, { x: 10, y: 60, r: 0.7 }, { x: 390, y: 20, r: 0.8 },
  { x: 210, y: 160, r: 0.7 },
];

// Meteor shower streaks: same "invisible most of the cycle, quick streak"
// idea as SHOOTING_STARS, but more of them cycling faster and closer
// together so it reads as a shower rather than a rare single event.
const METEOR_SHOWER_STREAKS = [
  { x: 40, y: 10, dx: 45, dy: 55, duration: 2.2, delay: 0 },
  { x: 140, y: 5, dx: 40, dy: 50, duration: 2.6, delay: 0.5 },
  { x: 240, y: 15, dx: 42, dy: 52, duration: 2.1, delay: 1.1 },
  { x: 320, y: 8, dx: 44, dy: 54, duration: 2.4, delay: 0.2 },
  { x: 90, y: 25, dx: 38, dy: 48, duration: 2.8, delay: 1.6 },
  { x: 280, y: 30, dx: 40, dy: 50, duration: 2.3, delay: 2.1 },
];

// Shared heart shape (roughly 16 wide, 18 tall), centered on its bottom
// point, reused for the Valentine's floating hearts, garland, and glow.
const HEART_PATH = 'M 0 6 C -2 3 -8 -1 -8 -6 C -8 -10 -4 -12 0 -8 C 4 -12 8 -10 8 -6 C 8 -1 2 3 0 6 Z';

// Butterflies fluttering near the summer flowers.
const BUTTERFLIES = [
  { x: 82, y: 231, delay: 0, duration: 4.6, cL: '#e86a8a', cR: '#f0e8f0' },
  { x: 212, y: 236, delay: 1.4, duration: 5.1, cL: '#f0c840', cR: '#fff6d8' },
  { x: 302, y: 229, delay: 2.7, duration: 4.9, cL: '#e8e8f0', cR: '#e86a8a' },
];

function BaseWorld({ stageKey, buildStages = [], justBuilt }) {
  const built = builtCountFromKey(buildStages, stageKey);
  const has = (key) => buildStages.slice(0, built).some((s) => s.key === key);

  // Which world's scenery to show. Only the sky/ground gradient palette and
  // the building set depend on this — time/season/weather/holiday keep
  // driving the same systems in both worlds, untouched.
  const world = currentWorldFromBuilt(buildStages, stageKey);
  const isCity = world === 'city';
  const isSpace = world === 'space';

  // Time of day drives the sky gradient, star visibility, and sun/moon
  const tod = getTimeOfDay();
  const skyStops = isSpace ? SPACE_SKY_STOPS[tod] : (isCity ? CITY_SKY_STOPS[tod] : SKY_STOPS[tod]);
  const starOp = STAR_OPACITY[tod];
  const skyRadial = SKY_IS_RADIAL[tod];
  const celestial = CELESTIAL[tod];

  // Season drives the ground color and overlay (snow / flowers / puddles)
  const season = getSeason();
  const groundStops = isSpace ? SPACE_GROUND_STOPS[season] : (isCity ? CITY_GROUND_STOPS[season] : GROUND_STOPS[season]);
  const overlay = SEASON_OVERLAY[season];

  // Active weather (rain in autumn, snow in winter) — not every day.
  // Ground weather doesn't apply in space; getSpaceCondition() drives its
  // own condition layer there instead (solar flares, meteor showers, etc).
  const weather = getWeather();
  const condition = isSpace ? getSpaceCondition() : null;

  // Active holiday (Halloween week, etc.) — an extra decoration layer only,
  // it never changes the season/time/weather systems or any game mechanic.
  const holiday = getHoliday();

  // Clouds only show up with weather: dark and gloomy for rain/thunder,
  // pale for a snowy sky. Clear weather gets no clouds at all. Ground
  // weather doesn't apply in space, so clouds never show there.
  const showClouds = !isSpace && (weather === 'rain' || weather === 'thunder' || weather === 'snow');
  const cloudColor = weather === 'snow' ? '#9aa5b0' : '#23262b';
  const cloudOpacity = weather === 'snow' ? 0.55 : 0.9;

  return (
    <div className="base-world">
      <svg
        viewBox="0 0 400 300"
        className="base-world-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {skyRadial ? (
            <radialGradient id="sky" cx="50%" cy="30%" r="80%">
              {skyStops.map(([off, col]) => (
                <stop key={off} offset={off} stopColor={col} />
              ))}
            </radialGradient>
          ) : (
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              {skyStops.map(([off, col]) => (
                <stop key={off} offset={off} stopColor={col} />
              ))}
            </linearGradient>
          )}
          <radialGradient id="celestialGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={celestial.glow} stopOpacity="0.55" />
            <stop offset="100%" stopColor={celestial.glow} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            {groundStops.map(([off, col]) => (
              <stop key={off} offset={off} stopColor={col} />
            ))}
          </linearGradient>
          <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a3c28" />
            <stop offset="100%" stopColor="#2e2418" />
          </linearGradient>
          <linearGradient id="woodDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#342a1c" />
            <stop offset="100%" stopColor="#1c150d" />
          </linearGradient>
          <linearGradient id="roof" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a4a30" />
            <stop offset="100%" stopColor="#2b2115" />
          </linearGradient>
          <linearGradient id="thatch" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8a7440" />
            <stop offset="100%" stopColor="#5a4a26" />
          </linearGradient>
          <linearGradient id="stone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6b6255" />
            <stop offset="100%" stopColor="#35302a" />
          </linearGradient>
          <radialGradient id="flame" cx="50%" cy="70%" r="60%">
            <stop offset="0%" stopColor="#fff3c4" />
            <stop offset="45%" stopColor="#f0b429" />
            <stop offset="100%" stopColor="#c8641e" />
          </radialGradient>
          <radialGradient id="lanternGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff6d8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fff6d8" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="paneGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe8a3" />
            <stop offset="100%" stopColor="#e8a23d" />
          </linearGradient>
          <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="3" />
          </filter>

          {/* ===== City-world materials (Vegas-neon buildings) ===== */}
          <linearGradient id="cityGlass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a3e5c" />
            <stop offset="100%" stopColor="#16182a" />
          </linearGradient>
          <linearGradient id="cityGlassDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#26283e" />
            <stop offset="100%" stopColor="#0e0f1a" />
          </linearGradient>
          <linearGradient id="cityConcrete" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a4658" />
            <stop offset="100%" stopColor="#221f30" />
          </linearGradient>
          <linearGradient id="cityWindowLit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff3b0" />
            <stop offset="100%" stopColor="#e8b23d" />
          </linearGradient>
          <radialGradient id="neonPinkGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff3d9a" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ff3d9a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="neonCyanGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3de0ff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#3de0ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="neonGoldGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd23d" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffd23d" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="neonPurpleGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#b24bf3" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#b24bf3" stopOpacity="0" />
          </radialGradient>

          {/* ===== Space-world materials/effects ===== */}
          <radialGradient id="solarFlareGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff9a4a" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#ff9a4a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cosmicStormGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#b24bf3" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#b24bf3" stopOpacity="0" />
          </radialGradient>

          {/* ===== Space-world building materials ===== */}
          <linearGradient id="spaceMetal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7a8494" />
            <stop offset="100%" stopColor="#363c48" />
          </linearGradient>
          <linearGradient id="spaceMetalDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a5058" />
            <stop offset="100%" stopColor="#1e2228" />
          </linearGradient>
          <linearGradient id="spaceGlassCyan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a0eaff" />
            <stop offset="100%" stopColor="#1a4a5a" />
          </linearGradient>
          <linearGradient id="greenhouseGlass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b8f0c8" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#2a5a38" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="solarPanel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3a5a8a" />
            <stop offset="100%" stopColor="#0e1526" />
          </linearGradient>
          <radialGradient id="reactorCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#eafcff" />
            <stop offset="45%" stopColor="#6fd8ff" />
            <stop offset="100%" stopColor="#1a4a72" />
          </radialGradient>
          <radialGradient id="spaceBeaconGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff5a5a" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ff5a5a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sky */}
        <rect x="0" y="0" width="400" height="300" fill="url(#sky)" />

        {/* Sun or moon */}
        <circle cx={celestial.cx} cy={celestial.cy} r={celestial.r * 2.6} fill="url(#celestialGlow)" />
        {celestial.kind === 'sun' ? (
          <circle cx={celestial.cx} cy={celestial.cy} r={celestial.r} fill={celestial.color} />
        ) : (
          <g>
            <circle cx={celestial.cx} cy={celestial.cy} r={celestial.r} fill={celestial.color} />
            <circle cx={celestial.cx + 5} cy={celestial.cy - 3} r={celestial.r} fill="#0b0a08" opacity="0.18" />
            <circle cx={celestial.cx - 4} cy={celestial.cy + 3} r="2" fill="#b8c2d4" opacity="0.5" />
            <circle cx={celestial.cx + 3} cy={celestial.cy + 5} r="1.4" fill="#b8c2d4" opacity="0.4" />
          </g>
        )}

        {/* Stars (fade out toward day) */}
        <g opacity={starOp}>
          <circle className="star" cx="60" cy="40" r="1" fill="#e8dcc0" opacity="0.5" />
          <circle className="star" cx="130" cy="60" r="1.2" fill="#e8dcc0" opacity="0.4" />
          <circle className="star" cx="320" cy="35" r="1" fill="#e8dcc0" opacity="0.6" />
          <circle className="star" cx="360" cy="80" r="1" fill="#e8dcc0" opacity="0.3" />
          <circle className="star" cx="240" cy="50" r="0.8" fill="#e8dcc0" opacity="0.5" />
          <circle className="star" cx="90" cy="90" r="0.8" fill="#e8dcc0" opacity="0.35" />
        </g>

        {/* ===== SPACE: background starfield + planet =====
            Always visible (no atmosphere to wash them out at "day"),
            tinted by Space Time via SPACE_PLANET[tod] and by season via a
            faint SPACE_SEASON_TINT wash. */}
        {isSpace && (
          <g>
            {SPACE_STARS.map((s, i) => (
              <circle
                key={i}
                className="star"
                cx={s.x}
                cy={s.y}
                r={s.r}
                fill="#e8dcc0"
                opacity="0.6"
                style={{ animationDelay: `${(i % 7) * 0.4}s` }}
              />
            ))}
            {(() => {
              const p = SPACE_PLANET[tod];
              return (
                <g>
                  <circle cx={p.cx} cy={p.cy} r={p.r} fill={p.base} />
                  <ellipse cx={p.cx + 4} cy={p.cy + 4} rx={p.r} ry={p.r} fill={p.shade} opacity="0.4" />
                  <ellipse cx={p.cx - p.r * 0.6} cy={p.cy - p.r * 0.15} rx={p.r * 1.1} ry={p.r * 0.22} fill={p.band} opacity="0.5" />
                  <ellipse cx={p.cx - p.r * 0.5} cy={p.cy + p.r * 0.3} rx={p.r * 1.05} ry={p.r * 0.18} fill={p.band} opacity="0.3" />
                  <circle cx={p.cx} cy={p.cy} r={p.r} fill={SPACE_SEASON_TINT[season]} opacity="0.1" />
                </g>
              );
            })()}
          </g>
        )}

        {/* ===== SPACE CONDITIONS: solar flare / meteor shower / cosmic
            storm / eclipse — the space-world equivalent of the ground's
            weather layer (clear gets no effect). ===== */}
        {isSpace && condition === 'solarflare' && (
          <g className="solar-flare-pulse">
            <ellipse cx="60" cy="20" rx="150" ry="90" fill="url(#solarFlareGlow)" />
          </g>
        )}
        {isSpace && condition === 'meteor' && (
          <g>
            {METEOR_SHOWER_STREAKS.map((m, i) => {
              const len = Math.hypot(m.dx, m.dy);
              const tailX = m.x - (m.dx / len) * 20;
              const tailY = m.y - (m.dy / len) * 20;
              return (
                <line
                  key={i}
                  x1={m.x}
                  y1={m.y}
                  x2={tailX}
                  y2={tailY}
                  stroke="#cfe8ff"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  className="meteor-shower-streak"
                  style={{ '--dx': m.dx, '--dy': m.dy, animationDuration: `${m.duration}s`, animationDelay: `${m.delay}s` }}
                />
              );
            })}
          </g>
        )}
        {isSpace && condition === 'cosmicstorm' && (
          <g>
            <g className="cosmic-storm-pulse" opacity="0.5">
              <ellipse cx="120" cy="60" rx="90" ry="40" fill="url(#cosmicStormGlow)" />
              <ellipse cx="280" cy="100" rx="100" ry="45" fill="url(#cosmicStormGlow)" />
            </g>
            <rect x="0" y="0" width="400" height="230" fill="#c9a0ff" className="cosmic-storm-flash" />
          </g>
        )}
        {isSpace && condition === 'eclipse' && (
          <g>
            <rect x="0" y="0" width="400" height="230" fill="#020208" opacity="0.4" />
            <circle
              cx={celestial.cx}
              cy={celestial.cy}
              r={celestial.r + 4}
              fill="none"
              stroke="#ffdca0"
              strokeWidth="2"
              opacity="0.8"
              filter="url(#softGlow)"
              className="eclipse-rim-glow"
            />
          </g>
        )}

        {/* Shooting stars: rare streaks across the night sky. The tail end is
            placed opposite the travel vector (dx, dy) so it always trails
            behind the star, head first, whichever way it's flying. */}
        {tod === 'night' && SHOOTING_STARS.map((s, i) => {
          const len = Math.hypot(s.dx, s.dy);
          const tailX = s.x - (s.dx / len) * 18;
          const tailY = s.y - (s.dy / len) * 18;
          return (
            <line
              key={i}
              x1={s.x}
              y1={s.y}
              x2={tailX}
              y2={tailY}
              stroke="#f5f0e0"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="shooting-star"
              style={{ '--dx': s.dx, '--dy': s.dy, animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s` }}
            />
          );
        })}

        {/* Birds drifting across the daytime sky now and then — grounded
            wildlife, so they don't show up in the space colony */}
        {!isSpace && tod === 'day' && BIRDS.map((b, i) => (
          <g key={i} className="bird" style={{ animationDuration: `${b.duration}s`, animationDelay: `${b.delay}s` }}>
            <path
              d={`M -5 ${b.y} Q -2.5 ${b.y - 3} 0 ${b.y} Q 2.5 ${b.y - 3} 5 ${b.y}`}
              className="bird-wings"
              stroke="#241f19"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        ))}

        {/* Clouds: only on rain/thunder (dark, gloomy) or snow (pale) —
            clear skies get none. */}
        {showClouds && CLOUD_SHAPES.map((c, i) => (
          <g key={i} fill={cloudColor} opacity={cloudOpacity}>
            <ellipse cx={c.cx} cy={c.cy} rx={20 * c.s} ry={9 * c.s} />
            <ellipse cx={c.cx - 18 * c.s} cy={c.cy + 3 * c.s} rx={13 * c.s} ry={7 * c.s} />
            <ellipse cx={c.cx + 19 * c.s} cy={c.cy + 3 * c.s} rx={14 * c.s} ry={7.5 * c.s} />
            <ellipse cx={c.cx + 3 * c.s} cy={c.cy - 5 * c.s} rx={12 * c.s} ry={7 * c.s} />
            <ellipse cx={c.cx - 6 * c.s} cy={c.cy - 4 * c.s} rx={9 * c.s} ry={6 * c.s} />
          </g>
        ))}

        {/* Ground */}
        <rect x="0" y="220" width="400" height="80" fill="url(#ground)" />
        <ellipse cx="200" cy="220" rx="200" ry="18" fill="#221d13" opacity="0.6" />
        {/* scattered ground texture */}
        <ellipse cx="130" cy="235" rx="10" ry="2.5" fill="#241f15" opacity="0.5" />
        <ellipse cx="250" cy="245" rx="14" ry="3" fill="#1a160f" opacity="0.5" />
        <ellipse cx="60" cy="250" rx="12" ry="2.5" fill="#241f15" opacity="0.4" />

        {/* Season overlay: snow blanket, flowers, or puddles — ground
            growth/weather, so none of it appears on the station deck.
            Season still tints the deck's own gradient (SPACE_GROUND_STOPS)
            and the background planet, just not as a physical overlay. */}
        {!isSpace && overlay === 'snow' && (
          <g>
            {/* Opacities raised across the board (was 0.16-0.3) so the
                ground reads as properly snow-covered rather than just
                tinted, plus one extra drift for fuller coverage. */}
            <rect x="0" y="220" width="400" height="80" fill="#c8d0d8" opacity="0.3" />
            <ellipse cx="200" cy="222" rx="200" ry="14" fill="#e8eef4" opacity="0.4" />
            <ellipse cx="90" cy="238" rx="40" ry="7" fill="#e8eef4" opacity="0.5" />
            <ellipse cx="300" cy="245" rx="50" ry="8" fill="#e8eef4" opacity="0.48" />
            <ellipse cx="180" cy="258" rx="60" ry="9" fill="#e8eef4" opacity="0.45" />
            <ellipse cx="360" cy="265" rx="40" ry="8" fill="#e8eef4" opacity="0.42" />
          </g>
        )}
        {!isSpace && overlay === 'puddles' && (
          <g>
            <ellipse cx="120" cy="242" rx="22" ry="4" fill="#3a4a52" opacity="0.5" />
            <ellipse cx="300" cy="252" rx="28" ry="5" fill="#3a4a52" opacity="0.45" />
            <ellipse cx="120" cy="241" rx="14" ry="2" fill="#6a7a82" opacity="0.35" />
          </g>
        )}
        {!isSpace && (overlay === 'flowers' || overlay === 'flowersDense') && (
          <g>
            {FLOWERS.slice(0, overlay === 'flowersDense' ? FLOWERS.length : 8).map((fl, i) => (
              <g key={i}>
                <line x1={fl.x} y1={fl.y} x2={fl.x} y2={fl.y + 4} stroke="#4a5a28" strokeWidth="1" />
                <circle cx={fl.x} cy={fl.y} r="1.8" fill={fl.c} />
              </g>
            ))}
          </g>
        )}

        {/* ===== HALLOWEEN: sky-layer decorations (glow, cobwebs, bats) =====
            Village-only: positions are laid out for the medieval scenery. */}
        {!isCity && !isSpace && holiday === 'halloween' && (
          <g>
            {/* Orange glow tint over the whole sky */}
            <rect
              x="0" y="0" width="400" height="230"
              fill={HALLOWEEN_GLOW.color}
              opacity={HALLOWEEN_GLOW.opacity}
            />
            {/* Cobwebs in the top corners */}
            {HALLOWEEN_COBWEBS.map((web, i) => {
              const left = web.corner === 'left';
              const ox = left ? 0 : 400;
              const dir = left ? 1 : -1;
              return (
                <g key={i} stroke="#c8ccd4" strokeWidth="0.7" fill="none" opacity="0.5">
                  {/* radial threads */}
                  <line x1={ox} y1="0" x2={ox + dir * 60} y2="6" />
                  <line x1={ox} y1="0" x2={ox + dir * 55} y2="30" />
                  <line x1={ox} y1="0" x2={ox + dir * 30} y2="55" />
                  <line x1={ox} y1="0" x2={ox + dir * 6} y2="60" />
                  {/* connecting arcs */}
                  <path d={`M ${ox + dir * 18} 4 Q ${ox + dir * 20} 18 ${ox + dir * 6} 20`} />
                  <path d={`M ${ox + dir * 40} 8 Q ${ox + dir * 42} 34 ${ox + dir * 12} 40`} />
                  <path d={`M ${ox + dir * 58} 12 Q ${ox + dir * 60} 50 ${ox + dir * 20} 58`} />
                </g>
              );
            })}
            {/* Bats drifting across the sky */}
            {HALLOWEEN_BATS.map((bat, i) => (
              // Outer <g> holds the position (attribute transform); inner <g>
              // holds the CSS-animated transform. A CSS transform animation
              // on the same element as an SVG transform attribute overrides
              // it entirely rather than composing, so they must be split.
              <g key={i} transform={`translate(${bat.x}, ${bat.y}) scale(${bat.scale})`}>
                <g
                  className="bat"
                  style={{ animationDuration: `${bat.duration}s`, animationDelay: `${bat.delay}s` }}
                >
                  <path
                    className="bat-body"
                    d="M0 0 C -4 -4, -8 -3, -11 0 C -8 -1, -6 1, -4 3 C -2 1, -1 1, 0 2 C 1 1, 2 1, 4 3 C 6 1, 8 -1, 11 0 C 8 -3, 4 -4, 0 0 Z"
                    fill="#14100a"
                  />
                </g>
              </g>
            ))}
          </g>
        )}

        {/* ===== CHRISTMAS: sky-layer decorations (string lights) =====
            Village-only: positions are laid out for the medieval scenery. */}
        {!isCity && !isSpace && holiday === 'christmas' && (
          <g>
            {/* garland wire, swagged in two dips across the top of the scene */}
            <path
              d="M 0 16 Q 100 34 200 18 Q 300 34 400 16"
              fill="none"
              stroke="#2a2018"
              strokeWidth="0.6"
              opacity="0.55"
            />
            {/* bulbs hanging along the wire, glowing on their own rhythm */}
            {CHRISTMAS_LIGHTS.map((l, i) => (
              <circle
                key={i}
                cx={l.x}
                cy={l.y}
                r="2.2"
                fill={l.color}
                className="christmas-light-glow"
                style={{ animationDelay: `${l.delay}s` }}
              />
            ))}
            {/* second, lower garland wire so the top edge reads fuller */}
            <path
              d="M 0 30 Q 100 48 200 32 Q 300 48 400 30"
              fill="none"
              stroke="#2a2018"
              strokeWidth="0.6"
              opacity="0.45"
            />
            {CHRISTMAS_EAVES_LIGHTS.map((l, i) => (
              <circle
                key={i}
                cx={l.x}
                cy={l.y}
                r="1.8"
                fill={l.color}
                className="christmas-light-glow"
                style={{ animationDelay: `${l.delay}s` }}
              />
            ))}
          </g>
        )}

        {/* ===== NEW YEAR: sky-layer decorations (glow, bunting, sparkle, fireworks) =====
            Village-only: positions are laid out for the medieval scenery. */}
        {!isCity && !isSpace && holiday === 'newyear' && (
          <g>
            {/* Faint golden glow tint over the whole sky */}
            <rect
              x="0" y="0" width="400" height="230"
              fill={NEWYEAR_GLOW.color}
              opacity={NEWYEAR_GLOW.opacity}
            />
            {/* Pennant banner strung across the very top */}
            <path
              d="M 0 8 Q 200 22 400 8"
              fill="none"
              stroke="#2a2018"
              strokeWidth="0.6"
              opacity="0.55"
            />
            {NEWYEAR_BUNTING.map((p, i) => (
              <g key={i} transform={`translate(${p.x}, ${p.y})`}>
                <g className="bunting-flag">
                  <path d="M -3.2 0 L 3.2 0 L 0 6.5 Z" fill={p.color} />
                </g>
              </g>
            ))}
            {/* Scattered golden sparkle points */}
            {NEWYEAR_SPARKLES.map((s, i) => (
              <circle
                key={i}
                cx={s.x}
                cy={s.y}
                r="1"
                fill="#f0dca0"
                className="newyear-sparkle"
                style={{ animationDelay: `${s.delay}s` }}
              />
            ))}
            {/* Fireworks: a rocket rises into each burst point, then explodes */}
            {NEWYEAR_FIREWORKS.map((f, i) => (
              <g key={i} transform={`translate(${f.x}, ${f.burstY})`}>
                {/* rocket trail rising up from below into the burst point */}
                <g
                  className="newyear-rocket-trail"
                  style={{ '--rise': `${f.rise}px`, animationDelay: `${f.delay}s`, animationDuration: `${f.duration}s` }}
                >
                  <path d="M 0 14 Q 1.5 7 0 0" fill="none" stroke={f.color} strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
                  <circle cx="0" cy="0" r="1.3" fill="#fff6d8" />
                </g>
                {/* burst: rays radiating from the center, scaling and fading as a unit */}
                <g
                  className="newyear-firework"
                  style={{ animationDelay: `${f.delay}s`, animationDuration: `${f.duration}s` }}
                >
                  {FIREWORK_RAY_ANGLES.map((a, j) => (
                    <line
                      key={j}
                      x1="0" y1="0"
                      x2={Math.cos(a) * 12}
                      y2={Math.sin(a) * 12}
                      stroke={f.color}
                      strokeWidth="1.1"
                      strokeLinecap="round"
                    />
                  ))}
                  {FIREWORK_RAY_ANGLES.map((a, j) => (
                    <circle key={j} cx={Math.cos(a) * 12} cy={Math.sin(a) * 12} r="0.9" fill={f.color} />
                  ))}
                  <circle cx="0" cy="0" r="1.6" fill="#fff6d8" opacity="0.9" />
                </g>
              </g>
            ))}
          </g>
        )}

        {/* ===== VALENTINE'S: sky-layer decorations (glow, garland, floating hearts) =====
            Village-only: positions are laid out for the medieval scenery. */}
        {!isCity && !isSpace && holiday === 'valentines' && (
          <g>
            {/* Warm pink glow tint over the whole sky */}
            <rect
              x="0" y="0" width="400" height="230"
              fill={VALENTINES_GLOW.color}
              opacity={VALENTINES_GLOW.opacity}
            />
            {/* Heart garland strung across the top */}
            <path
              d="M 0 14 Q 200 30 400 14"
              fill="none"
              stroke="#2a2018"
              strokeWidth="0.6"
              opacity="0.5"
            />
            {VALENTINES_GARLAND.map((h, i) => (
              <g key={i} transform={`translate(${h.x}, ${h.y}) scale(0.45)`}>
                <path d={HEART_PATH} fill={h.color} className="valentine-garland-heart" style={{ animationDelay: `${i * 0.3}s` }} />
              </g>
            ))}
            {/* Hearts drifting slowly upward, fading in and out on a loop */}
            {VALENTINES_HEARTS.map((h, i) => (
              <g key={i} transform={`translate(${h.x}, ${h.y}) scale(${h.scale})`}>
                <g
                  className="valentine-heart-float"
                  style={{ animationDuration: `${h.duration}s`, animationDelay: `${h.delay}s` }}
                >
                  <path d={HEART_PATH} fill={h.color} opacity="0.85" />
                </g>
              </g>
            ))}
          </g>
        )}

        {/* ===== EASTER: sky-layer decorations (glow, egg garland) =====
            Village-only: positions are laid out for the medieval scenery. */}
        {!isCity && !isSpace && holiday === 'easter' && (
          <g>
            {/* Pale spring glow tint over the whole sky */}
            <rect
              x="0" y="0" width="400" height="230"
              fill={EASTER_GLOW.color}
              opacity={EASTER_GLOW.opacity}
            />
            {/* Egg garland strung across the top */}
            <path
              d="M 0 14 Q 200 30 400 14"
              fill="none"
              stroke="#2a2018"
              strokeWidth="0.6"
              opacity="0.5"
            />
            {EASTER_GARLAND.map((e, i) => (
              <g key={i} transform={`translate(${e.x}, ${e.y}) scale(0.45)`}>
                <g className="easter-egg-sway" style={{ animationDelay: `${i * 0.25}s` }}>
                  <ellipse cx="0" cy="0" rx="3.2" ry="4.4" fill={e.color} />
                  <circle cx="-1" cy="-1" r="0.6" fill="#fff" opacity="0.6" />
                  <circle cx="1.2" cy="1.4" r="0.6" fill="#fff" opacity="0.6" />
                </g>
              </g>
            ))}
          </g>
        )}

        {/* ===== CITY HALLOWEEN: sky-layer decorations (violet glow, neon bats) ===== */}
        {isCity && holiday === 'halloween' && (
          <g>
            {/* Violet neon glow tint over the whole sky, standing in for the
                village's warm orange tint */}
            <rect
              x="0" y="0" width="400" height="230"
              fill={CITY_HALLOWEEN_GLOW.color}
              opacity={CITY_HALLOWEEN_GLOW.opacity}
            />
            {/* A single, big neon-glow spiderweb in the top-left sky corner
                (the top-right corner is occupied by the skyscraper, x
                322-382, so only one web fits). Drawn twice per stroke: a
                wide blurred pass for the glow, then a crisp pass on top —
                the same "double stroke" trick used by the neon pumpkin
                signs below — wrapped in `.neon-pulse` so the whole web
                breathes with the rest of the city's neon signage. */}
            <g transform={`translate(${CITY_HALLOWEEN_NEON_WEB.x}, ${CITY_HALLOWEEN_NEON_WEB.y}) scale(${CITY_HALLOWEEN_NEON_WEB.scale})`}>
              <circle cx="0" cy="0" r="80" fill="url(#neonPurpleGlow)" opacity="0.3" />
              <g className="neon-pulse">
                <g stroke="#c060ff" strokeWidth="2.2" fill="none" filter="url(#softGlow)" opacity="0.8">
                  <line x1="0" y1="0" x2="88" y2="16" />
                  <line x1="0" y1="0" x2="80" y2="48" />
                  <line x1="0" y1="0" x2="55" y2="78" />
                  <line x1="0" y1="0" x2="18" y2="88" />
                  <line x1="0" y1="0" x2="68" y2="62" />
                  <path d="M 22 4 Q 26 24 7 26" />
                  <path d="M 48 10 Q 56 44 14 52" />
                  <path d="M 72 18 Q 80 64 20 76" />
                </g>
                <g stroke="#eecbff" strokeWidth="0.9" fill="none" opacity="0.95">
                  <line x1="0" y1="0" x2="88" y2="16" />
                  <line x1="0" y1="0" x2="80" y2="48" />
                  <line x1="0" y1="0" x2="55" y2="78" />
                  <line x1="0" y1="0" x2="18" y2="88" />
                  <line x1="0" y1="0" x2="68" y2="62" />
                  <path d="M 22 4 Q 26 24 7 26" />
                  <path d="M 48 10 Q 56 44 14 52" />
                  <path d="M 72 18 Q 80 64 20 76" />
                </g>
              </g>
            </g>
            {/* Bats drifting past the rooftops/skyscraper, same drift/flap
                animation as the village bats, recolored neon magenta with a
                glow filter */}
            {CITY_HALLOWEEN_NEON_BATS.map((bat, i) => (
              <g key={i} transform={`translate(${bat.x}, ${bat.y}) scale(${bat.scale})`}>
                <g
                  className="bat"
                  style={{ animationDuration: `${bat.duration}s`, animationDelay: `${bat.delay}s` }}
                >
                  <path
                    className="bat-body"
                    d="M0 0 C -4 -4, -8 -3, -11 0 C -8 -1, -6 1, -4 3 C -2 1, -1 1, 0 2 C 1 1, 2 1, 4 3 C 6 1, 8 -1, 11 0 C 8 -3, 4 -4, 0 0 Z"
                    fill="#ff3dd4"
                    filter="url(#softGlow)"
                  />
                </g>
              </g>
            ))}
          </g>
        )}

        {/* ===== SPACE HALLOWEEN: sky-layer decorations (violet/green
             hologram glow) =====
             Space-only: a faint violet-green sky wash standing in for the
             village's warm orange tint and the city's violet neon tint —
             two soft blurred ellipses instead of a flat rect tint so it
             reads as drifting haze, kept clear of the background planet
             (SPACE_PLANET, x 261-349 / y 20-116). */}
        {isSpace && holiday === 'halloween' && (
          <g>
            <ellipse cx="110" cy="90" rx="130" ry="80" fill={SPACE_HALLOWEEN_GLOW.violet} opacity="0.10" filter="url(#softGlow)" />
            <ellipse cx="70" cy="130" rx="100" ry="60" fill={SPACE_HALLOWEEN_GLOW.green} opacity="0.08" filter="url(#softGlow)" />
            {/* A holographic spiderweb projected in the top-left sky corner,
                the same double-stroke (blurred glow pass + crisp pass)
                technique as the city's neon web, recolored cyan and
                flickering like a projection instead of pulsing like neon.
                Kept small enough (scale 0.9) to stay clear of the floating
                ghosts, which are positioned toward the center of the sky
                for exactly this reason. */}
            <g transform={`translate(${SPACE_HALLOWEEN_HOLO_WEB.x}, ${SPACE_HALLOWEEN_HOLO_WEB.y}) scale(${SPACE_HALLOWEEN_HOLO_WEB.scale})`}>
              <circle cx="0" cy="0" r="72" fill="url(#neonCyanGlow)" opacity="0.22" />
              <g className="hologram-flicker">
                <g stroke="#3de0ff" strokeWidth="1.8" fill="none" filter="url(#softGlow)" opacity="0.7">
                  <line x1="0" y1="0" x2="80" y2="14" />
                  <line x1="0" y1="0" x2="72" y2="44" />
                  <line x1="0" y1="0" x2="50" y2="70" />
                  <line x1="0" y1="0" x2="16" y2="80" />
                  <line x1="0" y1="0" x2="62" y2="56" />
                  <path d="M 20 4 Q 24 22 6 24" />
                  <path d="M 44 9 Q 51 40 13 47" />
                  <path d="M 65 16 Q 72 58 18 69" />
                </g>
                <g stroke="#eafcff" strokeWidth="0.8" fill="none" opacity="0.9">
                  <line x1="0" y1="0" x2="80" y2="14" />
                  <line x1="0" y1="0" x2="72" y2="44" />
                  <line x1="0" y1="0" x2="50" y2="70" />
                  <line x1="0" y1="0" x2="16" y2="80" />
                  <line x1="0" y1="0" x2="62" y2="56" />
                  <path d="M 20 4 Q 24 22 6 24" />
                  <path d="M 44 9 Q 51 40 13 47" />
                  <path d="M 65 16 Q 72 58 18 69" />
                </g>
              </g>
            </g>
          </g>
        )}

        {/* ===== SPACE CHRISTMAS: sky-layer decorations (cyan/gold glow,
             star, floating lights, snowflakes) =====
             Space-only: same hologram technique as SPACE HALLOWEEN above
             (translucent fills, softGlow-filtered outlines, scan lines
             clipped to each shape, `.hologram-flicker`), in a cyan + warm
             gold palette instead of violet/green. */}
        {isSpace && holiday === 'christmas' && (
          <g>
            <ellipse cx="110" cy="90" rx="130" ry="80" fill={SPACE_CHRISTMAS_GLOW.cyan} opacity="0.08" filter="url(#softGlow)" />
            <ellipse cx="70" cy="130" rx="100" ry="60" fill={SPACE_CHRISTMAS_GLOW.gold} opacity="0.07" filter="url(#softGlow)" />
            {/* Big holographic Christmas star, an 8-point burst with a soft
                glow halo underneath */}
            <g transform={`translate(${SPACE_CHRISTMAS_HOLO_STAR.x}, ${SPACE_CHRISTMAS_HOLO_STAR.y}) scale(${SPACE_CHRISTMAS_HOLO_STAR.scale})`}>
              <clipPath id="space-christmas-star-clip">
                <rect x="-20" y="-20" width="40" height="40" />
              </clipPath>
              <circle cx="0" cy="0" r="22" fill="url(#neonCyanGlow)" opacity="0.25" />
              <g className="hologram-flicker">
                <path
                  d="M 0 -20 L 5 -5 L 20 0 L 5 5 L 0 20 L -5 5 L -20 0 L -5 -5 Z"
                  fill={SPACE_CHRISTMAS_GLOW.gold}
                  opacity="0.18"
                />
                <path
                  d="M 0 -20 L 5 -5 L 20 0 L 5 5 L 0 20 L -5 5 L -20 0 L -5 -5 Z"
                  fill="none"
                  stroke="#eafcff"
                  strokeWidth="1"
                  opacity="0.85"
                  filter="url(#softGlow)"
                />
                <g clipPath="url(#space-christmas-star-clip)" stroke="#8fe0ff" strokeWidth="0.5" opacity="0.3">
                  <line x1="-20" y1="-8" x2="20" y2="-8" />
                  <line x1="-20" y1="0" x2="20" y2="0" />
                  <line x1="-20" y1="8" x2="20" y2="8" />
                </g>
              </g>
            </g>
            {/* Small floating holo lights, cyan/gold alternating, twinkling
                like the village's wire-strung CHRISTMAS_LIGHTS but drifting
                free in the open sky instead of hanging from a wire */}
            {SPACE_CHRISTMAS_HOLO_LIGHTS.map((l, i) => (
              <circle
                key={i}
                cx={l.x}
                cy={l.y}
                r="3.4"
                fill={l.color}
                opacity="0.85"
                filter="url(#softGlow)"
                className="christmas-light-glow"
                style={{ animationDelay: `${l.delay}s` }}
              />
            ))}
            {/* Floating holo snowflakes, gently bobbing like the Halloween
                ghosts do */}
            {SPACE_CHRISTMAS_HOLO_SNOWFLAKES.map((s, i) => (
              <g key={i} transform={`translate(${s.x}, ${s.y}) scale(${s.scale})`}>
                <g className="ghost-float" style={{ animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s` }}>
                  <g className="hologram-flicker" stroke="#eafcff" strokeWidth="0.8" opacity="0.75" filter="url(#softGlow)">
                    <line x1="-5" y1="0" x2="5" y2="0" />
                    <line x1="0" y1="-5" x2="0" y2="5" />
                    <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" />
                    <line x1="-3.5" y1="3.5" x2="3.5" y2="-3.5" />
                  </g>
                </g>
              </g>
            ))}
          </g>
        )}

        {/* ===== CITY CHRISTMAS: sky-layer decorations (rooftop chase lights) =====
            Grouped per building along its own roofline rather than one
            continuous wire, since the skyscraper is far taller than the
            others and a flat wire at village-garland height would cut
            straight through it. */}
        {isCity && holiday === 'christmas' && (
          <g>
            {CITY_CHRISTMAS_ROOFLINE_LIGHTS.map((l, i) => (
              <circle
                key={i}
                cx={l.x}
                cy={l.y}
                r="1.8"
                fill={l.color}
                className="christmas-light-glow"
                style={{ animationDelay: `${l.delay}s` }}
              />
            ))}
          </g>
        )}

        {/* ===== SPACE NEW YEAR: sky-layer decorations (cyan/gold glow,
             fireworks, sparkles) =====
             Space-only: same hologram technique as SPACE HALLOWEEN/
             CHRISTMAS above (translucent fills, softGlow-filtered outlines,
             `.hologram-flicker`), reusing the village/city firework rise+
             burst animation classes (`.newyear-rocket-trail`,
             `.newyear-firework`, `.newyear-sparkle`) recolored cyan/gold. */}
        {isSpace && holiday === 'newyear' && (
          <g>
            <ellipse cx="110" cy="90" rx="130" ry="80" fill={SPACE_NEWYEAR_GLOW.cyan} opacity="0.08" filter="url(#softGlow)" />
            <ellipse cx="70" cy="130" rx="100" ry="60" fill={SPACE_NEWYEAR_GLOW.gold} opacity="0.07" filter="url(#softGlow)" />
            {/* Scattered holo sparkle points */}
            {SPACE_NEWYEAR_HOLO_SPARKLES.map((s, i) => (
              <circle
                key={i}
                cx={s.x}
                cy={s.y}
                r="1.1"
                fill="#eafcff"
                opacity="0.9"
                filter="url(#softGlow)"
                className="newyear-sparkle"
                style={{ animationDelay: `${s.delay}s` }}
              />
            ))}
            {/* Holo fireworks: a rocket rises into each burst point, then a
                translucent ray-burst with scan lines flickers through it */}
            {SPACE_NEWYEAR_HOLO_FIREWORKS.map((f, i) => (
              <g key={i} transform={`translate(${f.x}, ${f.burstY})`}>
                <clipPath id={`space-newyear-firework-clip-${i}`}>
                  <rect x="-13" y="-13" width="26" height="26" />
                </clipPath>
                <g
                  className="newyear-rocket-trail"
                  style={{ '--rise': `${f.rise}px`, animationDelay: `${f.delay}s`, animationDuration: `${f.duration}s` }}
                >
                  <path d="M 0 14 Q 1.5 7 0 0" fill="none" stroke={f.color} strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
                  <circle cx="0" cy="0" r="1.3" fill="#eafcff" />
                </g>
                <g
                  className="newyear-firework"
                  style={{ animationDelay: `${f.delay}s`, animationDuration: `${f.duration}s` }}
                >
                  <g className="hologram-flicker">
                    {FIREWORK_RAY_ANGLES.map((a, j) => (
                      <line
                        key={j}
                        x1="0" y1="0"
                        x2={Math.cos(a) * 12}
                        y2={Math.sin(a) * 12}
                        stroke={f.color}
                        strokeWidth="1"
                        strokeLinecap="round"
                        opacity="0.75"
                        filter="url(#softGlow)"
                      />
                    ))}
                    {FIREWORK_RAY_ANGLES.map((a, j) => (
                      <circle key={j} cx={Math.cos(a) * 12} cy={Math.sin(a) * 12} r="0.8" fill={f.color} opacity="0.85" />
                    ))}
                    <circle cx="0" cy="0" r="1.6" fill="#eafcff" opacity="0.9" />
                    <g clipPath={`url(#space-newyear-firework-clip-${i})`} stroke="#8fe0ff" strokeWidth="0.4" opacity="0.3">
                      <line x1="-13" y1="-6" x2="13" y2="-6" />
                      <line x1="-13" y1="0" x2="13" y2="0" />
                      <line x1="-13" y1="6" x2="13" y2="6" />
                    </g>
                  </g>
                </g>
              </g>
            ))}
          </g>
        )}

        {/* ===== CITY NEW YEAR: sky-layer decorations (bigger neon fireworks show) ===== */}
        {isCity && holiday === 'newyear' && (
          <g>
            {/* Scattered neon sparkle points, denser than the village's */}
            {CITY_NEWYEAR_SPARKLES.map((s, i) => (
              <circle
                key={i}
                cx={s.x}
                cy={s.y}
                r="1"
                fill="#f0dca0"
                className="newyear-sparkle"
                style={{ animationDelay: `${s.delay}s` }}
              />
            ))}
            {/* Fireworks bursting over the skyline, neon palette matching
                the building signage (pink/cyan/gold/purple) */}
            {CITY_NEWYEAR_FIREWORKS.map((f, i) => (
              <g key={i} transform={`translate(${f.x}, ${f.burstY})`}>
                <g
                  className="newyear-rocket-trail"
                  style={{ '--rise': `${f.rise}px`, animationDelay: `${f.delay}s`, animationDuration: `${f.duration}s` }}
                >
                  <path d="M 0 14 Q 1.5 7 0 0" fill="none" stroke={f.color} strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
                  <circle cx="0" cy="0" r="1.3" fill="#fff6d8" />
                </g>
                <g
                  className="newyear-firework"
                  style={{ animationDelay: `${f.delay}s`, animationDuration: `${f.duration}s` }}
                >
                  {FIREWORK_RAY_ANGLES.map((a, j) => (
                    <line
                      key={j}
                      x1="0" y1="0"
                      x2={Math.cos(a) * 12}
                      y2={Math.sin(a) * 12}
                      stroke={f.color}
                      strokeWidth="1.1"
                      strokeLinecap="round"
                    />
                  ))}
                  {FIREWORK_RAY_ANGLES.map((a, j) => (
                    <circle key={j} cx={Math.cos(a) * 12} cy={Math.sin(a) * 12} r="0.9" fill={f.color} />
                  ))}
                  <circle cx="0" cy="0" r="1.6" fill="#fff6d8" opacity="0.9" />
                </g>
              </g>
            ))}
          </g>
        )}

        {/* ===== CITY VALENTINE'S: sky-layer decorations (hot-neon glow, drifting hearts) ===== */}
        {isCity && holiday === 'valentines' && (
          <g>
            <rect
              x="0" y="0" width="400" height="230"
              fill={CITY_VALENTINES_GLOW.color}
              opacity={CITY_VALENTINES_GLOW.opacity}
            />
            {CITY_VALENTINES_NEON_HEARTS.map((h, i) => (
              <g key={i} transform={`translate(${h.x}, ${h.y}) scale(${h.scale})`}>
                <g
                  className="valentine-heart-float"
                  style={{ animationDuration: `${h.duration}s`, animationDelay: `${h.delay}s` }}
                >
                  <path d={HEART_PATH} fill={h.color} opacity="0.9" filter="url(#softGlow)" />
                  <path d={HEART_PATH} fill={h.color} opacity="0.9" />
                </g>
              </g>
            ))}
          </g>
        )}

        {/* ===== SPACE VALENTINE'S: sky-layer decorations (pink/cyan glow,
             floating hologram hearts) =====
             Space-only: same hologram technique as the other three space
             holidays above (translucent fill, `softGlow`-filtered glow
             pass, `.hologram-flicker`), reusing the village/city
             `.valentine-heart-float` rise-and-fade animation. */}
        {isSpace && holiday === 'valentines' && (
          <g>
            <ellipse cx="110" cy="90" rx="130" ry="80" fill={SPACE_VALENTINES_GLOW.pink} opacity="0.08" filter="url(#softGlow)" />
            <ellipse cx="70" cy="130" rx="100" ry="60" fill={SPACE_VALENTINES_GLOW.cyan} opacity="0.07" filter="url(#softGlow)" />
            {SPACE_VALENTINES_HOLO_HEARTS_SKY.map((h, i) => (
              <g key={i} transform={`translate(${h.x}, ${h.y}) scale(0.55)`}>
                <g
                  className="valentine-heart-float"
                  style={{ animationDuration: `${h.duration}s`, animationDelay: `${h.delay}s` }}
                >
                  <g className="hologram-flicker">
                    <path d={HEART_PATH} fill={h.color} opacity="0.22" />
                    <path d={HEART_PATH} fill="none" stroke={h.color} strokeWidth="1.2" opacity="0.8" filter="url(#softGlow)" />
                  </g>
                </g>
              </g>
            ))}
          </g>
        )}

        {/* ===== CITY EASTER: sky-layer decorations (pastel-neon glow, floating eggs) =====
            Eggs bob gently near the rooftops instead of hanging from a
            strung garland, since a flat wire at village-garland height
            would cut through the skyscraper. */}
        {isCity && holiday === 'easter' && (
          <g>
            <rect
              x="0" y="0" width="400" height="230"
              fill={CITY_EASTER_GLOW.color}
              opacity={CITY_EASTER_GLOW.opacity}
            />
            {CITY_EASTER_NEON_EGG_FLOATERS.map((e, i) => (
              <g key={i} transform={`translate(${e.x}, ${e.y}) scale(${e.scale})`}>
                <g
                  className="ghost-float"
                  style={{ animationDuration: `${e.duration}s`, animationDelay: `${e.delay}s` }}
                >
                  <ellipse cx="0" cy="0" rx="5" ry="6.5" fill={e.color} opacity="0.9" filter="url(#softGlow)" />
                  <ellipse cx="0" cy="0" rx="5" ry="6.5" fill="none" stroke={e.color} strokeWidth="1" opacity="0.9" />
                </g>
              </g>
            ))}
          </g>
        )}

        {/* STREET — the city's first build: a paved lane with painted lines
            and a lamppost. Painted here, before any building, as part of
            the ground itself — the front-row buildings (shop/theater/
            casino) now sit deep enough into its depth band that if it
            painted later (as it used to, alongside the medieval TENT) it
            would draw its dark road rect right over their lower halves. */}
        {isCity && has('street') && <Street justBuilt={justBuilt} />}

        {/* LANDING PAD — the space world's first build: a metal deck with a
            glowing landing ring, painted here for the same reason the
            street is — front-row buildings sit deep enough into its depth
            band that painting it later would draw over their lower halves. */}
        {isSpace && has('landing-pad') && <LandingPad justBuilt={justBuilt} />}

        {/* ===== BACK LAYER ===== */}

        {/* WALL + big corner tower — final build */}
        {!isCity && !isSpace && has('wall') && <Wall justBuilt={justBuilt} />}

        {/* SKYSCRAPER — back-right tower, the city world's final build,
            occupying the same back-layer real estate as the wall+tower */}
        {isCity && has('skyscraper') && <Skyscraper justBuilt={justBuilt} />}

        {/* COMMAND TOWER — back row, right cluster: the space world's final
            build, occupying the same back-layer real estate as the
            wall+tower/skyscraper */}
        {isSpace && has('command-tower') && <CommandTower justBuilt={justBuilt} />}

        {/* COMMS TOWER — back row, left cluster: a slim mast with a dish,
            the space world's hotel equivalent. Drawn back here (not mid)
            so the mid/front buildings in front of it partly cover its base,
            leaving its tall mast/dish rising above them. */}
        {isSpace && has('comms-tower') && <CommsTower justBuilt={justBuilt} />}

        {/* ===== MID LAYER (original buildings, unchanged) ===== */}

        {/* HOUSE (original) */}
        {!isCity && !isSpace && has('house') && <House justBuilt={justBuilt} />}

        {/* HUT (original, enlarged so the doorway reads against the survivor) */}
        {!isCity && !isSpace && has('hut') && <Hut justBuilt={justBuilt} />}

        {/* WELL (brought forward and clear of the hut, shadow aligned to its base) */}
        {!isCity && !isSpace && has('well') && <Well justBuilt={justBuilt} />}

        {/* APARTMENT — mid-left block of flats, lit windows in mixed colors,
            rooftop water tank (same footprint the medieval house used) */}
        {isCity && has('apartment') && <Apartment justBuilt={justBuilt} />}

        {/* HOTEL — mid-right tower, taller than the apartment, vertical neon
            sign running down its face */}
        {isCity && has('hotel') && <Hotel justBuilt={justBuilt} />}

        {/* HABITAT — mid row, left cluster: round crew-quarters pods, the
            space world's apartment equivalent */}
        {isSpace && has('habitat') && <Habitat justBuilt={justBuilt} />}

        {/* LAB — mid row, left cluster: modest research module at the far
            left edge, the space world's hotel-slot equivalent */}
        {isSpace && has('lab') && <Lab justBuilt={justBuilt} />}

        {/* Parked car on the street, drawn after the apartment/hotel (so it
            sits in front of those, not swallowed by the hotel's tall glass
            footprint the way it was when it rendered before all mid-layer
            buildings) but before the shop. Faces right, toward the diner/
            survivor. Wrapped in a scale+reposition (pivoting on its own
            ground-shadow anchor) to grow it and shift it left of the shop,
            nudged back right a touch from its first left placement so it
            sits closer to the shop's corner — most of the car (cabin, both
            wheels, shadow) stays clear, with just its headlight/front edge
            tucking behind the shop's left edge. */}
        {isCity && has('street') && (
          <g transform="translate(-174,-152.4) scale(1.6)">
            <ellipse cx="205" cy="249" rx="22" ry="2.5" fill="#000" opacity="0.4" />
            <rect x="185" y="233" width="40" height="13" rx="2" fill="#26232f" stroke="#100f18" strokeWidth="0.7" />
            <rect x="195" y="224" width="20" height="9" rx="2" fill="#26232f" stroke="#100f18" strokeWidth="0.7" />
            <rect x="197" y="225" width="16" height="6" fill="#3de0ff" opacity="0.35" />
            <circle cx="193" cy="246" r="4.5" fill="#0c0c0e" />
            <circle cx="217" cy="246" r="4.5" fill="#0c0c0e" />
            <circle cx="227" cy="240" r="1.8" fill="#ffe8a3" opacity="0.9" />
            <circle cx="183" cy="240" r="1.8" fill="#ff3d9a" opacity="0.8" />
          </g>
        )}

        {/* SHOP — small storefront, lit awning and a neon window sign,
            tucked between the apartment and the hotel */}
        {isCity && has('shop') && <Shop justBuilt={justBuilt} />}

        {/* DINER — right behind where the survivor sits with a coffee cup,
            the city's version of the campfire hangout */}
        {isCity && has('diner') && <Diner justBuilt={justBuilt} />}

        {/* SOLAR ARRAY — angled panels on ground struts, the space world's
            parked-car-street-prop equivalent */}
        {isSpace && has('solar-array') && <SolarArray justBuilt={justBuilt} />}

        {/* ===== FRONT LAYER ===== */}

        {/* TENT (medieval, original) */}
        {!isCity && !isSpace && (
        <g transform="translate(0, 18)">
          <ellipse cx="175" cy="222" rx="46" ry="8" fill="#000" opacity="0.4" />
          <path d="M 140 220 L 175 165 L 210 220 Z" fill="#43371f" />
          <path d="M 175 165 L 175 220 L 210 220 Z" fill="#2b2318" />
          <path d="M 175 165 L 145 220 L 152 220 Z" fill="#4d4023" opacity="0.6" />
          <rect x="163" y="196" width="9" height="6" fill="#372c19" opacity="0.6" transform="rotate(-3 167 199)" />
          <line x1="175" y1="165" x2="175" y2="220" stroke="#1c160e" strokeWidth="1" />
          <line x1="175" y1="165" x2="150" y2="220" stroke="#372c19" strokeWidth="1" />
          <line x1="175" y1="180" x2="195" y2="220" stroke="#1c160e" strokeWidth="0.7" opacity="0.5" />
          <path d="M 175 200 L 166 220 L 184 220 Z" fill="#0d0b07" />
          <line x1="175" y1="165" x2="175" y2="158" stroke="#2a2018" strokeWidth="2" />
          {/* guy lines */}
          <line x1="175" y1="172" x2="196" y2="219" stroke="#5a4a2c" strokeWidth="0.7" opacity="0.6" />
          <line x1="175" y1="172" x2="154" y2="219" stroke="#5a4a2c" strokeWidth="0.7" opacity="0.6" />
          <circle cx="196" cy="220" r="1.4" fill="#241d13" />
          <circle cx="154" cy="220" r="1.4" fill="#241d13" />
        </g>
        )}

        {/* FIELD (medieval, foreground, enlarged, shifted left so it stays clear of the survivor) */}
        {!isCity && !isSpace && has('field') && <Field justBuilt={justBuilt} />}

        {/* Butterflies fluttering near the summer flowers — drawn in the
            front layer so they stay clear of buildings, not hidden behind
            them. Tied to the (ground-only) flower overlay, so they sit
            out space along with it. */}
        {!isSpace && season === 'summer' && BUTTERFLIES.map((b, i) => (
          <g key={i} className="butterfly" style={{ animationDuration: `${b.duration}s`, animationDelay: `${b.delay}s` }}>
            <ellipse cx={b.x - 1.5} cy={b.y} rx="2" ry="1.4" fill={b.cL} className="butterfly-wing" />
            <ellipse cx={b.x + 1.5} cy={b.y} rx="2" ry="1.4" fill={b.cR} className="butterfly-wing" />
          </g>
        ))}

        {/* ===== HALLOWEEN: ground-layer decorations (jack-o'-lanterns) =====
            Village-only: positions are laid out for the medieval scenery. */}
        {!isCity && !isSpace && holiday === 'halloween' && HALLOWEEN_PUMPKINS.map((p, i) => (
          <g key={i} transform={`translate(${p.x}, ${p.y}) scale(${p.scale})`}>
            {/* stalk */}
            <rect x="-1.5" y="-11" width="3" height="4" rx="1" fill="#3f5225" />
            {/* body */}
            <ellipse cx="0" cy="0" rx="9" ry="7" fill="#d9721e" />
            <ellipse cx="-3.5" cy="0" rx="3.5" ry="6.5" fill="#c4611a" opacity="0.6" />
            <ellipse cx="3.5" cy="0" rx="3.5" ry="6.5" fill="#c4611a" opacity="0.6" />
            {/* glowing carved face */}
            <path d="M -5 -2 L -2 -2 L -3.5 1 Z" fill="#ffd24a" className="pumpkin-glow" />
            <path d="M 5 -2 L 2 -2 L 3.5 1 Z" fill="#ffd24a" className="pumpkin-glow" />
            <path d="M -4 3 L -2 5 L 0 3 L 2 5 L 4 3 L 3 4.5 L -3 4.5 Z" fill="#ffd24a" className="pumpkin-glow" />
          </g>
        ))}

        {/* A skeleton resting on the ground, off to the side (village-only) */}
        {!isCity && !isSpace && holiday === 'halloween' && HALLOWEEN_SKELETONS.map((sk, i) => (
          <g key={i} transform={`translate(${sk.x}, ${sk.y}) scale(${sk.scale})`}>
            {/* skull */}
            <circle cx="0" cy="-10" r="4" fill="#d8d8cc" />
            <circle cx="-1.4" cy="-10.5" r="0.8" fill="#2a2a26" />
            <circle cx="1.4" cy="-10.5" r="0.8" fill="#2a2a26" />
            <rect x="-0.9" y="-8.6" width="1.8" height="1.3" fill="#2a2a26" />
            {/* ribcage */}
            <path d="M -3 -6 L -3.5 2 L 3.5 2 L 3 -6 Z" fill="none" stroke="#d8d8cc" strokeWidth="0.8" />
            <line x1="-2.6" y1="-4" x2="2.6" y2="-4" stroke="#d8d8cc" strokeWidth="0.6" />
            <line x1="-2.8" y1="-2" x2="2.8" y2="-2" stroke="#d8d8cc" strokeWidth="0.6" />
            <line x1="-3" y1="0" x2="3" y2="0" stroke="#d8d8cc" strokeWidth="0.6" />
            {/* arms resting on the ground */}
            <line x1="-3" y1="-5" x2="-7" y2="2" stroke="#d8d8cc" strokeWidth="1" strokeLinecap="round" />
            <line x1="3" y1="-5" x2="6" y2="1" stroke="#d8d8cc" strokeWidth="1" strokeLinecap="round" />
            {/* legs, sitting pose */}
            <line x1="-2" y1="2" x2="-6" y2="5" stroke="#d8d8cc" strokeWidth="1.1" strokeLinecap="round" />
            <line x1="-6" y1="5" x2="-9" y2="4" stroke="#d8d8cc" strokeWidth="1.1" strokeLinecap="round" />
            <line x1="2" y1="2" x2="7" y2="4" stroke="#d8d8cc" strokeWidth="1.1" strokeLinecap="round" />
          </g>
        ))}

        {/* Small candles keeping the pumpkins company, flames flickering
            (village-only) */}
        {!isCity && !isSpace && holiday === 'halloween' && HALLOWEEN_CANDLES.map((c, i) => (
          <g key={i} transform={`translate(${c.x}, ${c.y}) scale(${c.scale})`}>
            {/* wax body */}
            <rect x="-1.6" y="-6" width="3.2" height="6" rx="0.6" fill="#e8dcc0" />
            <ellipse cx="0" cy="-6" rx="1.6" ry="0.6" fill="#f4ecd8" />
            {/* wick */}
            <line x1="0" y1="-6" x2="0" y2="-7.2" stroke="#3a2f22" strokeWidth="0.5" />
            {/* flame */}
            <path
              className="candle-flame"
              style={{ animationDelay: `${c.delay}s` }}
              d="M 0 -7.2 C 1.4 -8.6 1.2 -10.4 0 -11.6 C -1.2 -10.4 -1.4 -8.6 0 -7.2 Z"
              fill="#ffb347"
            />
          </g>
        ))}

        {/* ===== CHRISTMAS: ground-layer decorations (tree, gifts, candles, snow mounds) =====
            Village-only: positions are laid out for the medieval scenery. */}
        {/* Faint snow mounds for ground texture, drawn first so everything else sits on top */}
        {!isCity && !isSpace && holiday === 'christmas' && CHRISTMAS_SNOWDRIFTS.map((d, i) => (
          <ellipse key={i} cx={d.x} cy={d.y} rx={d.rx} ry={d.ry} fill="#eef3f8" opacity={d.opacity} />
        ))}

        {/* A small decorated tree, ornaments glowing softly */}
        {!isCity && !isSpace && holiday === 'christmas' && CHRISTMAS_TREES.map((t, i) => (
          <g key={i} transform={`translate(${t.x}, ${t.y}) scale(${t.scale})`}>
            {/* trunk */}
            <rect x="-1.5" y="-4" width="3" height="4" fill="#4a2f1a" />
            {/* three stacked tiers */}
            <path d="M -9 -4 L 0 -14 L 9 -4 Z" fill="#2f5c3a" />
            <path d="M -7 -10 L 0 -19 L 7 -10 Z" fill="#356b40" />
            <path d="M -5 -15 L 0 -23 L 5 -15 Z" fill="#3f7a4a" />
            {/* ornaments, each twinkling on its own rhythm */}
            <circle cx="-4" cy="-6" r="1" fill="#d94a3c" className="christmas-light-glow" style={{ animationDelay: '0.1s' }} />
            <circle cx="4" cy="-7" r="1" fill="#4a86c8" className="christmas-light-glow" style={{ animationDelay: '0.5s' }} />
            <circle cx="-3" cy="-12" r="0.9" fill="#f0c14a" className="christmas-light-glow" style={{ animationDelay: '0.9s' }} />
            <circle cx="3" cy="-13" r="0.9" fill="#d94a3c" className="christmas-light-glow" style={{ animationDelay: '0.3s' }} />
            <circle cx="0" cy="-17" r="0.8" fill="#4a86c8" className="christmas-light-glow" style={{ animationDelay: '0.7s' }} />
            {/* star on top */}
            <path
              d="M 0 -27 L 1.1 -24.3 L 4 -24 L 1.8 -22 L 2.4 -19.2 L 0 -20.7 L -2.4 -19.2 L -1.8 -22 L -4 -24 L -1.1 -24.3 Z"
              fill="#f0c14a"
              className="christmas-light-glow"
              style={{ animationDelay: '0s' }}
            />
          </g>
        ))}

        {/* Wrapped gifts at the foot of the tree (village-only) */}
        {!isCity && !isSpace && holiday === 'christmas' && CHRISTMAS_GIFTS.map((g, i) => (
          <g key={i} transform={`translate(${g.x}, ${g.y}) scale(${g.scale})`}>
            <rect x="-4" y="-6" width="8" height="6" rx="0.6" fill={g.box} />
            <rect x="-1" y="-6" width="2" height="6" fill={g.ribbon} />
            <rect x="-4" y="-3.5" width="8" height="1.5" fill={g.ribbon} />
            {/* bow */}
            <path d="M -2.2 -6 Q -3.2 -8 -0.6 -7.4 Z" fill={g.ribbon} />
            <path d="M 2.2 -6 Q 3.2 -8 0.6 -7.4 Z" fill={g.ribbon} />
          </g>
        ))}

        {/* Warm candles keeping watch nearby, flames flickering (same shape as
            the Halloween candles, festive wax colors) (village-only) */}
        {!isCity && !isSpace && holiday === 'christmas' && CHRISTMAS_CANDLES.map((c, i) => (
          <g key={i} transform={`translate(${c.x}, ${c.y}) scale(${c.scale})`}>
            {/* wax body */}
            <rect x="-1.6" y="-6" width="3.2" height="6" rx="0.6" fill={c.wax} />
            <ellipse cx="0" cy="-6" rx="1.6" ry="0.6" fill="#f4ecd8" />
            {/* wick */}
            <line x1="0" y1="-6" x2="0" y2="-7.2" stroke="#3a2f22" strokeWidth="0.5" />
            {/* flame */}
            <path
              className="candle-flame"
              style={{ animationDelay: `${c.delay}s` }}
              d="M 0 -7.2 C 1.4 -8.6 1.2 -10.4 0 -11.6 C -1.2 -10.4 -1.4 -8.6 0 -7.2 Z"
              fill="#ffb347"
            />
          </g>
        ))}

        {/* A couple of red roses on the ground (village-only) */}
        {!isCity && !isSpace && holiday === 'valentines' && VALENTINES_ROSES.map((r, i) => (
          <g key={i} transform={`translate(${r.x}, ${r.y}) scale(${r.scale}) rotate(${r.rotate})`}>
            {/* stem, curving slightly */}
            <path d="M 0 0 C 1 -6 -1 -10 0 -16" fill="none" stroke="#3f6b3a" strokeWidth="1.1" strokeLinecap="round" />
            {/* leaves */}
            <ellipse cx="-2.2" cy="-7" rx="2.4" ry="1.1" fill="#4a7a44" transform="rotate(-35 -2.2 -7)" />
            <ellipse cx="1.8" cy="-10" rx="2.2" ry="1" fill="#4a7a44" transform="rotate(30 1.8 -10)" />
            {/* bloom: petals arranged around the center */}
            {Array.from({ length: 6 }, (_, j) => {
              const a = (j / 6) * Math.PI * 2;
              const px = Math.cos(a) * 2;
              const py = -16 + Math.sin(a) * 2;
              return (
                <ellipse
                  key={j}
                  cx={px}
                  cy={py}
                  rx="2.4"
                  ry="1.6"
                  fill="#c8283e"
                  transform={`rotate(${(a * 180) / Math.PI} ${px} ${py})`}
                />
              );
            })}
            <circle cx="0" cy="-16" r="1.6" fill="#8a1a2a" />
          </g>
        ))}

        {/* Decorated Easter eggs on the ground, pastel bases with a
            stripe/dot pattern (village-only) */}
        {!isCity && !isSpace && holiday === 'easter' && EASTER_EGGS.map((e, i) => (
          <g key={i} transform={`translate(${e.x}, ${e.y}) scale(${e.scale})`}>
            <path
              d="M 0 -8 C 4 -8 5 -2 5 2 C 5 6 2.5 8 0 8 C -2.5 8 -5 6 -5 2 C -5 -2 -4 -8 0 -8 Z"
              fill={e.base}
            />
            {e.pattern === 'dots' && (
              <>
                <circle cx="-1.8" cy="-2" r="0.9" fill={e.patternColor} />
                <circle cx="2" cy="0" r="0.9" fill={e.patternColor} />
                <circle cx="-1" cy="3.5" r="0.9" fill={e.patternColor} />
                <circle cx="1.8" cy="4.5" r="0.9" fill={e.patternColor} />
              </>
            )}
            {e.pattern === 'stripes' && (
              <>
                <path d="M -4.6 -3 Q 0 -1.5 4.6 -3" fill="none" stroke={e.patternColor} strokeWidth="1.1" />
                <path d="M -5 1 Q 0 2.5 5 1" fill="none" stroke={e.patternColor} strokeWidth="1.1" />
                <path d="M -4 5.2 Q 0 6.5 4 5.2" fill="none" stroke={e.patternColor} strokeWidth="1.1" />
              </>
            )}
          </g>
        ))}

        {/* Small spring flowers on the ground (village-only) */}
        {!isCity && !isSpace && holiday === 'easter' && EASTER_FLOWERS.map((fl, i) => (
          <g key={i} transform={`translate(${fl.x}, ${fl.y}) scale(${fl.scale})`}>
            <line x1="0" y1="0" x2="0" y2="-5" stroke="#4a7a44" strokeWidth="1" />
            {Array.from({ length: 4 }, (_, j) => {
              const a = (j / 4) * Math.PI * 2;
              return (
                <ellipse
                  key={j}
                  cx={Math.cos(a) * 2}
                  cy={-5 + Math.sin(a) * 2}
                  rx="1.8"
                  ry="1.2"
                  fill={fl.petal}
                  transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * 2} ${-5 + Math.sin(a) * 2})`}
                />
              );
            })}
            <circle cx="0" cy="-5" r="1.1" fill={fl.center} />
          </g>
        ))}

        {/* ===== CITY HALLOWEEN: ground-layer decorations (neon pumpkin signs on facades) =====
            No dark backing rect — the pumpkin glows directly on the street,
            like the other small foreground decorations. */}
        {isCity && holiday === 'halloween' && CITY_HALLOWEEN_MARQUEE_PUMPKINS.map((p, i) => (
          <g key={i} transform={`translate(${p.x}, ${p.y}) scale(${p.scale})`}>
            <ellipse cx="0" cy="-6" rx="6" ry="5" fill="none" stroke="#ff8c3d" strokeWidth="1.2" filter="url(#softGlow)" />
            <ellipse cx="0" cy="-6" rx="6" ry="5" fill="none" stroke="#ff8c3d" strokeWidth="1.2" className="neon-pulse" />
            <path d="M -1 -11 L 1 -11 L 1 -9 L -1 -9 Z" fill="#3f5225" />
            <g className="pumpkin-glow">
              <path d="M -3.5 -7.5 L -1.5 -7.5 L -2.5 -5.5 Z" fill="#ffb347" />
              <path d="M 3.5 -7.5 L 1.5 -7.5 L 2.5 -5.5 Z" fill="#ffb347" />
              <path d="M -2.5 -3.5 L -1 -2 L 0 -3.5 L 1 -2 L 2.5 -3.5 L 2 -2.5 L -2 -2.5 Z" fill="#ffb347" />
            </g>
          </g>
        ))}

        {/* ===== CITY CHRISTMAS: ground-layer decorations (shop awning lights) ===== */}
        {isCity && holiday === 'christmas' && CITY_CHRISTMAS_AWNING_LIGHTS.map((l, i) => (
          <circle
            key={i}
            cx={l.x}
            cy={l.y}
            r="1.6"
            fill={l.color}
            className="christmas-light-glow"
            style={{ animationDelay: `${l.delay}s` }}
          />
        ))}

        {/* ===== CITY NEW YEAR: ground-layer decorations (street-level sparkle) ===== */}
        {isCity && holiday === 'newyear' && CITY_NEWYEAR_STREET_SPARKLE.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r="1.2"
            fill="#f0dca0"
            className="newyear-sparkle"
            style={{ animationDelay: `${s.delay}s` }}
          />
        ))}

        {/* ===== CITY VALENTINE'S: ground-layer decorations (neon heart signs on facades) =====
            No dark backing rect — the heart glows directly on the street,
            like the other small foreground decorations. */}
        {isCity && holiday === 'valentines' && CITY_VALENTINES_HEART_SIGNS.map((h, i) => (
          <g key={i} transform={`translate(${h.x}, ${h.y}) scale(${h.scale})`}>
            <g className="neon-pulse">
              <path d={HEART_PATH} transform="translate(0, -7) scale(0.9)" fill="none" stroke="#ff3d9a" strokeWidth="1.2" filter="url(#softGlow)" />
              <path d={HEART_PATH} transform="translate(0, -7) scale(0.9)" fill="none" stroke="#ff3d9a" strokeWidth="1.2" />
            </g>
          </g>
        ))}

        {/* ===== CITY EASTER: ground-layer decorations (neon eggs standing on the street) ===== */}
        {isCity && holiday === 'easter' && CITY_EASTER_NEON_EGGS.map((e, i) => (
          <g key={i} transform={`translate(${e.x}, ${e.y}) scale(${e.scale})`}>
            <ellipse cx="0" cy="8" rx="7" ry="2" fill="#000" opacity="0.3" />
            <path
              d="M 0 -8 C 4 -8 5 -2 5 2 C 5 6 2.5 8 0 8 C -2.5 8 -5 6 -5 2 C -5 -2 -4 -8 0 -8 Z"
              fill="none"
              stroke={e.color}
              strokeWidth="1.3"
              filter="url(#softGlow)"
              className="neon-pulse"
            />
            <path
              d="M 0 -8 C 4 -8 5 -2 5 2 C 5 6 2.5 8 0 8 C -2.5 8 -5 6 -5 2 C -5 -2 -4 -8 0 -8 Z"
              fill="none"
              stroke={e.color}
              strokeWidth="1.3"
            />
          </g>
        ))}

        {/* SURVIVOR (always) — stands in front of the diner, holding its own
            small coffee cup, when the world is 'city' */}
        <g transform="translate(0, 20)">
          <Survivor world={world} />
        </g>

        {/* CAMPFIRE (medieval only) — right where the survivor stands. The
            city figure holds its own (reasonably sized) coffee cup, so
            there's no separate prop drawn here for the city world. Also
            withheld in space (no space-specific hangout prop yet — that
            comes with the character phase), so no open flame shows up in
            the station scene. */}
        <g transform="translate(0, 20)">
          {!isCity && !isSpace ? (
            <>
              <g filter="url(#glow)">
                <rect x="266" y="211" width="26" height="5" rx="2" fill="#2a2018" transform="rotate(14 280 214)" />
                <rect x="266" y="211" width="26" height="5" rx="2" fill="#2a2018" transform="rotate(-14 280 214)" />
                <rect x="269" y="213" width="22" height="4" rx="2" fill="#1c150d" transform="rotate(3 280 215)" />
                <path className="flame-outer" d="M 280 187 C 268 205, 273 214, 280 214 C 287 214, 292 205, 280 187 Z" fill="url(#flame)" />
                <path className="flame-inner" d="M 280 197 C 274 207, 277 213, 280 213 C 283 213, 286 207, 280 197 Z" fill="#fff3c4" opacity="0.85" />
              </g>
              <circle cx="272" cy="196" r="1" fill="#f0b429" opacity="0.8" />
              <circle cx="288" cy="192" r="0.8" fill="#f0b429" opacity="0.7" />
              <ellipse cx="280" cy="216" rx="58" ry="13" fill="#c8641e" opacity="0.15" />
              {SPARKS.map((s, i) => (
                <circle
                  key={i}
                  cx={s.x}
                  cy="205"
                  r="1"
                  fill="#f0b429"
                  className="spark"
                  style={{ '--drift': `${s.drift}px`, animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s` }}
                />
              ))}
            </>
          ) : null}
        </g>

        {/* HALLOWEEN GHOST (drawn in the foreground, after the buildings and
            campfire, so it isn't clipped by the wall/tower/storage)
            (village-only: sits beside the medieval campfire) */}
        {!isCity && !isSpace && holiday === 'halloween' && HALLOWEEN_GHOSTS.map((g, i) => (
          <g key={i} transform={`translate(${g.x}, ${g.y}) scale(${g.scale})`}>
            <g
              className="ghost-float"
              style={{ animationDuration: `${g.duration}s`, animationDelay: `${g.delay}s` }}
            >
              <path
                d="M -7 -4 C -7 -13, -4 -18, 0 -18 C 4 -18, 7 -13, 7 -4 L 7 5
                   C 7 5, 5.5 2, 4 5 C 2.5 8, 1 3, 0 6
                   C -1 3, -2.5 8, -4 5 C -5.5 2, -7 5, -7 5 Z"
                fill="#f4f4f2"
                opacity="0.5"
              />
              <ellipse cx="-2.5" cy="-8" rx="1.1" ry="1.5" fill="#1a1a1a" opacity="0.5" />
              <ellipse cx="2.5" cy="-8" rx="1.1" ry="1.5" fill="#1a1a1a" opacity="0.5" />
            </g>
          </g>
        ))}

        {/* CHRISTMAS ELF (drawn in the foreground, after the buildings and
            campfire, so it isn't clipped by the wall/tower/storage)
            (village-only: sits beside the medieval campfire). Same
            recognizable elf figure as the city's CITY_CHRISTMAS_ELVES —
            pointed red hat with a pompom, round face with pointed ears,
            green legs, red tunic — minus the city's neon rim-light accent,
            since the village has no neon styling to match. */}
        {!isCity && !isSpace && holiday === 'christmas' && CHRISTMAS_ELVES.map((e, i) => (
          <g key={i} transform={`translate(${e.x}, ${e.y}) scale(${e.scale})`}>
            <ellipse cx="0" cy="1" rx="5" ry="1.3" fill="#000" opacity="0.35" />
            {/* legs */}
            <rect x="-2.6" y="-8" width="2" height="8" rx="0.8" fill="#1c8a4a" />
            <rect x="0.6" y="-8" width="2" height="8" rx="0.8" fill="#1c8a4a" />
            {/* curled-toe shoes */}
            <path d="M -3.4 0 Q -5.2 -0.2 -4.6 -1.6 L -1.6 -1.6 L -1.6 0 Z" fill="#ffd23d" />
            <path d="M 3.4 0 Q 5.2 -0.2 4.6 -1.6 L 1.6 -1.6 L 1.6 0 Z" fill="#ffd23d" />
            {/* tunic */}
            <path d="M -3.2 -8 Q 0 -6.4 3.2 -8 L 3 -16 Q 0 -17.4 -3 -16 Z" fill="#d9342a" />
            <rect x="-3.2" y="-10.5" width="6.4" height="1.4" fill="#f0c14a" />
            {/* arms with mitten hands */}
            <path d="M -3 -15 Q -6.5 -13 -6 -9" fill="none" stroke="#d9342a" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M 3 -15 Q 6.5 -13 6 -9" fill="none" stroke="#d9342a" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="-6" cy="-9" r="1.1" fill="#f0c14a" />
            <circle cx="6" cy="-9" r="1.1" fill="#f0c14a" />
            {/* head with pointed ears */}
            <path d="M -3.4 -19 L -5.6 -18 L -3.6 -17.2 Z" fill="#f2c8a0" />
            <path d="M 3.4 -19 L 5.6 -18 L 3.6 -17.2 Z" fill="#f2c8a0" />
            <circle cx="0" cy="-19" r="3.4" fill="#f2c8a0" />
            <circle cx="-1.2" cy="-19.4" r="0.5" fill="#2a2a26" />
            <circle cx="1.2" cy="-19.4" r="0.5" fill="#2a2a26" />
            <path d="M -0.8 -17.6 Q 0 -17 0.8 -17.6" fill="none" stroke="#c06a4a" strokeWidth="0.5" />
            {/* pointed, folded hat with a pompom */}
            <path d="M -3.6 -21 Q -1 -29 5 -25 Q 1.5 -25.6 -1 -23.6 Q -2.6 -22.2 -3.6 -21 Z" fill="#d9342a" />
            <path d="M -3.6 -21 L 3.6 -21" stroke="#f0c14a" strokeWidth="1" opacity="0.9" />
            <circle cx="5" cy="-25" r="1.1" fill="#fff6d8" />
          </g>
        ))}

        {/* NEW YEAR TOAST — champagne bottle and two clinking glasses (drawn
            in the foreground, after the buildings and campfire, so it isn't
            clipped by the wall/tower/storage) (village-only: sits beside the
            medieval campfire) */}
        {!isCity && !isSpace && holiday === 'newyear' && NEWYEAR_TOASTS.map((t, i) => (
          <g key={i} transform={`translate(${t.x}, ${t.y}) scale(${t.scale})`}>
            {/* left flute, tilted toward the right glass */}
            <line x1="-6" y1="0" x2="-5" y2="-9" stroke="#c9b98a" strokeWidth="1" />
            <ellipse cx="-6" cy="0" rx="2" ry="0.7" fill="#c9b98a" opacity="0.8" />
            <path d="M -7.2 -9 L -2.8 -9 L -3.6 -16.5 L -6.4 -15.5 Z" fill="none" stroke="#cfe3ea" strokeWidth="0.7" />
            <path d="M -6.8 -10.3 L -3.2 -10.3 L -3.6 -16.5 L -6.4 -15.5 Z" fill="#f0c14a" opacity="0.55" />
            <circle cx="-5.6" cy="-13" r="0.35" fill="#fff6d8" opacity="0.8" />
            <circle cx="-4.6" cy="-12" r="0.3" fill="#fff6d8" opacity="0.7" />
            {/* right flute, tilted toward the left glass */}
            <line x1="4" y1="0" x2="3" y2="-9" stroke="#c9b98a" strokeWidth="1" />
            <ellipse cx="4" cy="0" rx="2" ry="0.7" fill="#c9b98a" opacity="0.8" />
            <path d="M 2.8 -9 L 7.2 -9 L 6.4 -15.5 L 3.6 -16.5 Z" fill="none" stroke="#cfe3ea" strokeWidth="0.7" />
            <path d="M 3.2 -10.3 L 6.8 -10.3 L 6.4 -15.5 L 3.6 -16.5 Z" fill="#f0c14a" opacity="0.55" />
            <circle cx="4.4" cy="-13" r="0.35" fill="#fff6d8" opacity="0.8" />
            <circle cx="5.4" cy="-12" r="0.3" fill="#fff6d8" opacity="0.7" />
            {/* clink spark, right where the two rims almost meet */}
            <path
              d="M 0 -17.6 L 0.5 -16.3 L 1.8 -16 L 0.5 -15.7 L 0 -14.4 L -0.5 -15.7 L -1.8 -16 L -0.5 -16.3 Z"
              fill="#fff6d8"
              className="newyear-sparkle"
              style={{ animationDelay: '0.4s' }}
            />
            {/* champagne bottle, standing to the right */}
            <rect x="9" y="-18" width="5" height="15" rx="1" fill="#1f4a30" />
            <rect x="9.5" y="-12" width="4" height="3" fill="#e8dcc0" opacity="0.85" />
            <rect x="10.3" y="-23" width="2.4" height="6" fill="#1f4a30" />
            <rect x="10" y="-24.5" width="3" height="2" fill="#d9b06a" />
            <ellipse cx="11.5" cy="-18" rx="2.5" ry="1" fill="#2a5c3a" opacity="0.5" />
            {/* cork-pop sparkle above the cap */}
            <path
              d="M 11.5 -25 L 11.9 -27.4 L 12.3 -25 L 14.5 -25.6 L 12.6 -24.4 L 14 -22.8 L 11.9 -23.7 L 11.5 -21.4 L 11.1 -23.7 L 9 -22.8 L 10.4 -24.4 L 8.5 -25.6 Z"
              fill="#f0c14a"
              className="newyear-sparkle"
              style={{ animationDelay: '0s' }}
            />
          </g>
        ))}

        {/* VALENTINE'S HEART GLOW — a softly pulsing heart near the campfire
            (drawn in the foreground, after the buildings and campfire, so it
            isn't clipped by the wall/tower/storage) (village-only: sits
            beside the medieval campfire) */}
        {!isCity && !isSpace && holiday === 'valentines' && VALENTINES_HEART_GLOWS.map((hg, i) => (
          <g key={i} transform={`translate(${hg.x}, ${hg.y}) scale(${hg.scale})`}>
            {/* soft blurred backdrop for the glow */}
            <path d={HEART_PATH} transform="translate(0, -14) scale(2)" fill="#e85a7a" opacity="0.3" filter="url(#softGlow)" />
            <g className="valentine-heart-glow">
              <path d={HEART_PATH} transform="translate(0, -14) scale(1.1)" fill="#d9425e" />
              <path d={HEART_PATH} transform="translate(-2.5, -17) scale(0.5)" fill="#f4a8b8" opacity="0.6" />
            </g>
          </g>
        ))}

        {/* EASTER BUNNY — sitting upright, ears up (drawn in the foreground,
            after the buildings and campfire, so it isn't clipped by the
            wall/tower/storage) (village-only: sits beside the medieval
            campfire) */}
        {!isCity && !isSpace && holiday === 'easter' && EASTER_BUNNIES.map((b, i) => (
          <g key={i} transform={`translate(${b.x}, ${b.y}) scale(${b.scale})`}>
            {/* tail */}
            <circle cx="-5.5" cy="-2" r="2" fill="#fff" />
            {/* body */}
            <ellipse cx="0" cy="-7" rx="6" ry="7.5" fill="#f7f2ea" />
            {/* front paws */}
            <ellipse cx="-3" cy="-1.2" rx="1.8" ry="1.3" fill="#f7f2ea" />
            <ellipse cx="3" cy="-1.2" rx="1.8" ry="1.3" fill="#f7f2ea" />
            {/* ears, standing up */}
            <ellipse cx="-2.3" cy="-23" rx="1.6" ry="7" fill="#f7f2ea" transform="rotate(-12 -2.3 -23)" />
            <ellipse cx="2.3" cy="-23" rx="1.6" ry="7" fill="#f7f2ea" transform="rotate(12 2.3 -23)" />
            <ellipse cx="-2.3" cy="-22" rx="0.8" ry="4.6" fill="#e8a8b8" transform="rotate(-12 -2.3 -22)" />
            <ellipse cx="2.3" cy="-22" rx="0.8" ry="4.6" fill="#e8a8b8" transform="rotate(12 2.3 -22)" />
            {/* head */}
            <circle cx="0" cy="-15.5" r="4.6" fill="#f7f2ea" />
            {/* face */}
            <circle cx="-1.6" cy="-15.5" r="0.6" fill="#2a2a26" />
            <circle cx="1.6" cy="-15.5" r="0.6" fill="#2a2a26" />
            <path d="M -0.6 -13.8 L 0.6 -13.8 L 0 -13 Z" fill="#e8708a" />
          </g>
        ))}

        {/* STORAGE (drawn after the campfire so its glow stays behind the building) */}
        {!isCity && !isSpace && has('storage') && <Storage justBuilt={justBuilt} />}

        {/* THEATER — showy marquee with a bulb-lined border, standing where
            the storage shed once did */}
        {isCity && has('theater') && <Theater justBuilt={justBuilt} />}

        {/* GREENHOUSE — front row, left cluster: translucent dome with
            plants glowing inside, the space world's theater-slot showpiece
            on this side, standing where the storage shed/theater once did */}
        {isSpace && has('greenhouse') && <Greenhouse justBuilt={justBuilt} />}

        {/* FENCE (right against the front edge of the field, matching its width) */}
        {!isCity && !isSpace && has('fence') && <Fence justBuilt={justBuilt} />}

        {/* WATCHTOWER (foreground, stays at the right edge) */}
        {!isCity && !isSpace && has('watchtower') && <Watchtower justBuilt={justBuilt} />}

        {/* CASINO — the city's showiest building, moved to the front-left to
            balance the composition, stacked neon signage and a blinking
            marquee crown */}
        {isCity && has('casino') && <Casino justBuilt={justBuilt} />}

        {/* REACTOR — front row, right cluster: the space world's showiest
            build, a glowing energy core in front of the command tower's
            foot, the casino/theater equivalent */}
        {isSpace && has('reactor') && <Reactor justBuilt={justBuilt} />}

        {/* ===== SPACE CHRISTMAS: holo elves on the landing-pad deck =====
             Recognizable elf silhouette (pointed hat with pompom, round
             head, tunic, legs) reused from the village/city elves, recolored
             as a translucent cyan hologram with a warm holo-red hat accent,
             scan lines clipped to the figure, wrapped in `.hologram-flicker`.
             Drawn after the reactor so the two over its footprint sit in
             front of it rather than behind. */}
        {isSpace && holiday === 'christmas' && SPACE_CHRISTMAS_HOLO_ELVES.map((e, i) => (
          <g key={i} transform={`translate(${e.x}, ${e.y}) scale(${e.scale})`}>
            <clipPath id={`space-christmas-elf-clip-${i}`}>
              <rect x="-8" y="-30" width="16" height="32" />
            </clipPath>
            <g className="hologram-flicker">
              {/* legs */}
              <rect x="-2.6" y="-8" width="2" height="8" rx="0.8" fill="#3de0ff" opacity="0.15" />
              <rect x="0.6" y="-8" width="2" height="8" rx="0.8" fill="#3de0ff" opacity="0.15" />
              <rect x="-2.6" y="-8" width="2" height="8" rx="0.8" fill="none" stroke="#8fe0ff" strokeWidth="0.5" opacity="0.6" />
              <rect x="0.6" y="-8" width="2" height="8" rx="0.8" fill="none" stroke="#8fe0ff" strokeWidth="0.5" opacity="0.6" />
              {/* tunic */}
              <path d="M -3.2 -8 Q 0 -6.4 3.2 -8 L 3 -16 Q 0 -17.4 -3 -16 Z" fill="#3de0ff" opacity="0.14" />
              <path d="M -3.2 -8 Q 0 -6.4 3.2 -8 L 3 -16 Q 0 -17.4 -3 -16 Z" fill="none" stroke="#8fe0ff" strokeWidth="0.7" opacity="0.75" filter="url(#softGlow)" />
              {/* arms */}
              <path d="M -3 -15 Q -6.5 -13 -6 -9" fill="none" stroke="#8fe0ff" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
              <path d="M 3 -15 Q 6.5 -13 6 -9" fill="none" stroke="#8fe0ff" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
              {/* head */}
              <circle cx="0" cy="-19" r="3.4" fill="#3de0ff" opacity="0.14" />
              <circle cx="0" cy="-19" r="3.4" fill="none" stroke="#eafcff" strokeWidth="0.7" opacity="0.8" />
              <circle cx="-1.2" cy="-19.4" r="0.5" fill="#eafcff" opacity="0.9" />
              <circle cx="1.2" cy="-19.4" r="0.5" fill="#eafcff" opacity="0.9" />
              {/* pointed hat, warm holo-red accent so the elf reads apart
                  from the cyan-only decorations */}
              <path d="M -3.6 -21 Q -1 -29 5 -25 Q 1.5 -25.6 -1 -23.6 Q -2.6 -22.2 -3.6 -21 Z" fill="#ff6a4a" opacity="0.2" />
              <path d="M -3.6 -21 Q -1 -29 5 -25 Q 1.5 -25.6 -1 -23.6 Q -2.6 -22.2 -3.6 -21 Z" fill="none" stroke="#ff9a7a" strokeWidth="0.8" opacity="0.85" filter="url(#softGlow)" />
              <circle cx="5" cy="-25" r="1.1" fill="#eafcff" opacity="0.9" />
              {/* scan lines clipped to the figure's bounding box */}
              <g clipPath={`url(#space-christmas-elf-clip-${i})`} stroke="#8fe0ff" strokeWidth="0.5" opacity="0.3">
                <line x1="-8" y1="-24" x2="8" y2="-24" />
                <line x1="-8" y1="-16" x2="8" y2="-16" />
                <line x1="-8" y1="-8" x2="8" y2="-8" />
                <line x1="-8" y1="0" x2="8" y2="0" />
              </g>
            </g>
          </g>
        ))}

        {/* ===== SPACE CHRISTMAS: holo Christmas tree on the landing-pad
             deck ===== Same three-tier tree/ornaments/star shape as the
             village's CHRISTMAS_TREES, recolored as a translucent cyan
             hologram with warm gold holo ornaments. Sits over the reactor's
             footprint, pushed forward to clear its solid housing, kept
             clear of the elf beside it (x 350). */}
        {isSpace && holiday === 'christmas' && SPACE_CHRISTMAS_HOLO_TREE.map((t, i) => (
          <g key={i} transform={`translate(${t.x}, ${t.y}) scale(${t.scale})`}>
            <clipPath id={`space-christmas-tree-clip-${i}`}>
              <rect x="-9" y="-27" width="18" height="27" />
            </clipPath>
            <g className="hologram-flicker">
              <rect x="-1.5" y="-4" width="3" height="4" fill="#3de0ff" opacity="0.3" />
              <path d="M -9 -4 L 0 -14 L 9 -4 Z" fill="#3de0ff" opacity="0.12" />
              <path d="M -7 -10 L 0 -19 L 7 -10 Z" fill="#3de0ff" opacity="0.12" />
              <path d="M -5 -15 L 0 -23 L 5 -15 Z" fill="#3de0ff" opacity="0.12" />
              <path d="M -9 -4 L 0 -14 L 9 -4 Z" fill="none" stroke="#8fe0ff" strokeWidth="0.8" opacity="0.7" filter="url(#softGlow)" />
              <path d="M -7 -10 L 0 -19 L 7 -10 Z" fill="none" stroke="#8fe0ff" strokeWidth="0.8" opacity="0.7" />
              <path d="M -5 -15 L 0 -23 L 5 -15 Z" fill="none" stroke="#8fe0ff" strokeWidth="0.8" opacity="0.7" />
              {/* ornaments — warm gold holo dots */}
              <circle cx="-4" cy="-6" r="1" fill="#f0c14a" opacity="0.9" />
              <circle cx="4" cy="-7" r="1" fill="#f0c14a" opacity="0.9" />
              <circle cx="-3" cy="-12" r="0.9" fill="#f0c14a" opacity="0.9" />
              <circle cx="3" cy="-13" r="0.9" fill="#f0c14a" opacity="0.9" />
              <circle cx="0" cy="-17" r="0.8" fill="#f0c14a" opacity="0.9" />
              {/* star on top */}
              <path
                d="M 0 -27 L 1.1 -24.3 L 4 -24 L 1.8 -22 L 2.4 -19.2 L 0 -20.7 L -2.4 -19.2 L -1.8 -22 L -4 -24 L -1.1 -24.3 Z"
                fill="#eafcff"
                opacity="0.9"
                filter="url(#softGlow)"
              />
              {/* scan lines clipped to the tree's bounding box */}
              <g clipPath={`url(#space-christmas-tree-clip-${i})`} stroke="#8fe0ff" strokeWidth="0.5" opacity="0.3">
                <line x1="-9" y1="-20" x2="9" y2="-20" />
                <line x1="-9" y1="-12" x2="9" y2="-12" />
                <line x1="-9" y1="-4" x2="9" y2="-4" />
              </g>
            </g>
          </g>
        ))}

        {/* ===== SPACE CHRISTMAS: holo gift boxes ===== Same box/ribbon/bow
             shape as the village's CHRISTMAS_GIFTS, recolored as a
             translucent cyan hologram with warm gold holo ribbon — small
             enough to tuck in at the foot of the tree/beside the corner elf
             without needing their own forward push to clear a building. */}
        {isSpace && holiday === 'christmas' && SPACE_CHRISTMAS_HOLO_GIFTS.map((g, i) => (
          <g key={i} transform={`translate(${g.x}, ${g.y}) scale(${g.scale})`}>
            <g className="hologram-flicker">
              <rect x="-4" y="-6" width="8" height="6" rx="0.6" fill="#3de0ff" opacity="0.14" />
              <rect x="-4" y="-6" width="8" height="6" rx="0.6" fill="none" stroke="#8fe0ff" strokeWidth="0.6" opacity="0.7" filter="url(#softGlow)" />
              <rect x="-1" y="-6" width="2" height="6" fill="#f0c14a" opacity="0.8" />
              <rect x="-4" y="-3.5" width="8" height="1.5" fill="#f0c14a" opacity="0.8" />
              <path d="M -2.2 -6 Q -3.2 -8 -0.6 -7.4 Z" fill="#f0c14a" opacity="0.85" />
              <path d="M 2.2 -6 Q 3.2 -8 0.6 -7.4 Z" fill="#f0c14a" opacity="0.85" />
            </g>
          </g>
        ))}

        {/* ===== SPACE CHRISTMAS: holo candles ===== Same wax-body shape as
             the village's HALLOWEEN_CANDLES/CHRISTMAS_CANDLES, recolored as
             a translucent cyan hologram with a warm gold flame (kept as the
             existing `.candle-flame` flicker rather than the hologram one,
             so it still reads as a flame). */}
        {isSpace && holiday === 'christmas' && SPACE_CHRISTMAS_HOLO_CANDLES.map((c, i) => (
          <g key={i} transform={`translate(${c.x}, ${c.y}) scale(${c.scale})`}>
            <g className="hologram-flicker">
              <rect x="-1.6" y="-6" width="3.2" height="6" rx="0.6" fill="#3de0ff" opacity="0.16" />
              <rect x="-1.6" y="-6" width="3.2" height="6" rx="0.6" fill="none" stroke="#8fe0ff" strokeWidth="0.5" opacity="0.7" />
              <ellipse cx="0" cy="-6" rx="1.6" ry="0.6" fill="#eafcff" opacity="0.4" />
            </g>
            <path
              className="candle-flame"
              style={{ animationDelay: `${c.delay}s` }}
              d="M 0 -7.2 C 1.4 -8.6 1.2 -10.4 0 -11.6 C -1.2 -10.4 -1.4 -8.6 0 -7.2 Z"
              fill="#f0c14a"
              opacity="0.85"
              filter="url(#softGlow)"
            />
          </g>
        ))}

        {/* ===== SPACE NEW YEAR: holo champagne toasts ===== Same bottle +
             two clinking flutes shape as the village's NEWYEAR_TOASTS,
             recolored as a translucent cyan hologram with warm gold accents
             (cork, cap), scan lines clipped to the bounding box, wrapped in
             `.hologram-flicker`, plus a few rising `.newyear-bubble-rise`
             bubbles off the bottle neck. Drawn after every building so
             it's never clipped by the greenhouse/reactor it sits over. */}
        {isSpace && holiday === 'newyear' && SPACE_NEWYEAR_HOLO_TOASTS.map((t, i) => (
          <g key={i} transform={`translate(${t.x}, ${t.y}) scale(${t.scale})`}>
            <clipPath id={`space-newyear-toast-clip-${i}`}>
              <rect x="-9" y="-28" width="25" height="28" />
            </clipPath>
            <g className="hologram-flicker">
              {/* Two clinking flutes: only on the toast(s) that keep them
                  (`glasses !== false`) — a whole row of toasts all clinking
                  glasses read as too busy, so most of this set is bottle-only. */}
              {t.glasses !== false && (
                <>
                  {/* left flute */}
                  <line x1="-6" y1="0" x2="-5" y2="-9" stroke="#8fe0ff" strokeWidth="1" opacity="0.7" />
                  <ellipse cx="-6" cy="0" rx="2" ry="0.7" fill="#3de0ff" opacity="0.3" />
                  <path d="M -7.2 -9 L -2.8 -9 L -3.6 -16.5 L -6.4 -15.5 Z" fill="#3de0ff" opacity="0.16" stroke="#8fe0ff" strokeWidth="0.6" />
                  {/* right flute */}
                  <line x1="4" y1="0" x2="3" y2="-9" stroke="#8fe0ff" strokeWidth="1" opacity="0.7" />
                  <ellipse cx="4" cy="0" rx="2" ry="0.7" fill="#3de0ff" opacity="0.3" />
                  <path d="M 2.8 -9 L 7.2 -9 L 6.4 -16.5 L 3.6 -16.5 Z" fill="#3de0ff" opacity="0.16" stroke="#8fe0ff" strokeWidth="0.6" />
                  {/* clink spark, right where the two rims almost meet */}
                  <path
                    d="M 0 -17.6 L 0.5 -16.3 L 1.8 -16 L 0.5 -15.7 L 0 -14.4 L -0.5 -15.7 L -1.8 -16 L -0.5 -16.3 Z"
                    fill="#eafcff"
                    className="newyear-sparkle"
                    style={{ animationDelay: '0.4s' }}
                  />
                </>
              )}
              {/* champagne bottle, standing to the right */}
              <rect x="9" y="-18" width="5" height="15" rx="1" fill="#3de0ff" opacity="0.16" />
              <rect x="9" y="-18" width="5" height="15" rx="1" fill="none" stroke="#8fe0ff" strokeWidth="0.6" opacity="0.7" filter="url(#softGlow)" />
              <rect x="10.3" y="-23" width="2.4" height="6" fill="#3de0ff" opacity="0.2" />
              <rect x="10" y="-24.5" width="3" height="2" fill="#f0c14a" opacity="0.85" />
              {/* cork-pop sparkle */}
              <path
                d="M 11.5 -25 L 11.9 -27.4 L 12.3 -25 L 14.5 -25.6 L 12.6 -24.4 L 14 -22.8 L 11.9 -23.7 L 11.5 -21.4 L 11.1 -23.7 L 9 -22.8 L 10.4 -24.4 L 8.5 -25.6 Z"
                fill="#f0c14a"
                className="newyear-sparkle"
                style={{ animationDelay: '0s' }}
              />
              {/* rising, fading bubbles above the bottle neck */}
              <circle className="newyear-bubble-rise" cx="11.5" cy="-25" r="0.6" fill="#8fe0ff" style={{ animationDelay: '0s' }} />
              <circle className="newyear-bubble-rise" cx="10.5" cy="-25" r="0.5" fill="#8fe0ff" style={{ animationDelay: '0.6s' }} />
              <circle className="newyear-bubble-rise" cx="12.5" cy="-25" r="0.45" fill="#8fe0ff" style={{ animationDelay: '1.2s' }} />
              {/* scan lines clipped to the toast's bounding box */}
              <g clipPath={`url(#space-newyear-toast-clip-${i})`} stroke="#8fe0ff" strokeWidth="0.5" opacity="0.3">
                <line x1="-9" y1="-22" x2="16" y2="-22" />
                <line x1="-9" y1="-14" x2="16" y2="-14" />
                <line x1="-9" y1="-6" x2="16" y2="-6" />
              </g>
            </g>
          </g>
        ))}

        {/* ===== SPACE VALENTINE'S: holo hearts on the landing-pad deck =====
             Same HEART_PATH shape the sky-layer hearts above use, larger
             and grounded rather than floating, wrapped in
             `.hologram-flicker` with scan lines clipped to the heart's own
             silhouette. Drawn after the buildings so it's never clipped by
             the greenhouse/reactor it sits over. */}
        {isSpace && holiday === 'valentines' && SPACE_VALENTINES_HOLO_HEARTS_GROUND.map((h, i) => (
          <g key={i} transform={`translate(${h.x}, ${h.y}) scale(${h.scale})`}>
            <clipPath id={`space-valentines-heart-clip-${i}`}>
              <rect x="-8" y="-12" width="16" height="18" />
            </clipPath>
            <g className="hologram-flicker">
              <path d={HEART_PATH} fill="#ff6ab0" opacity="0.18" />
              <path d={HEART_PATH} fill="none" stroke="#ff9ac8" strokeWidth="1" opacity="0.8" filter="url(#softGlow)" />
              <g clipPath={`url(#space-valentines-heart-clip-${i})`} stroke="#8fe0ff" strokeWidth="0.5" opacity="0.3">
                <line x1="-8" y1="-4" x2="8" y2="-4" />
                <line x1="-8" y1="0" x2="8" y2="0" />
                <line x1="-8" y1="4" x2="8" y2="4" />
              </g>
            </g>
          </g>
        ))}

        {/* ===== SPACE VALENTINE'S: holo robot companion beside the
             survivor ===== A small, clearly-readable friendly robot — round
             head with antenna, boxy body, stub arms, a tiny held heart —
             recolored as a translucent cyan hologram with a pink/magenta
             chest light and heart accent. Stands beside the survivor, not
             on top of it (see SPACE_VALENTINES_HOLO_ROBOT for the
             clearance math), drawn after the buildings for the same reason
             as the hearts above. */}
        {isSpace && holiday === 'valentines' && SPACE_VALENTINES_HOLO_ROBOT.map((r, i) => (
          <g key={i} transform={`translate(${r.x}, ${r.y}) scale(${r.scale})`}>
            <clipPath id={`space-valentines-robot-clip-${i}`}>
              <rect x="-9" y="-26" width="27" height="26" />
            </clipPath>
            <g className="hologram-flicker">
              {/* base/feet */}
              <ellipse cx="0" cy="0" rx="4" ry="1.5" fill="#3de0ff" opacity="0.15" />
              <rect x="-3" y="-3" width="2.4" height="3" rx="1" fill="#3de0ff" opacity="0.18" />
              <rect x="0.6" y="-3" width="2.4" height="3" rx="1" fill="#3de0ff" opacity="0.18" />
              {/* boxy body */}
              <rect x="-5" y="-14" width="10" height="11" rx="2" fill="#3de0ff" opacity="0.16" />
              <rect x="-5" y="-14" width="10" height="11" rx="2" fill="none" stroke="#8fe0ff" strokeWidth="0.7" opacity="0.8" filter="url(#softGlow)" />
              {/* chest light */}
              <circle cx="0" cy="-8" r="1.4" fill="#ff6ab0" opacity="0.85" />
              {/* stub arms */}
              <line x1="-5" y1="-10" x2="-8.5" y2="-6" stroke="#8fe0ff" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
              <line x1="5" y1="-10" x2="8" y2="-8" stroke="#8fe0ff" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
              {/* round head with two eye dots */}
              <circle cx="0" cy="-18" r="4.4" fill="#3de0ff" opacity="0.16" />
              <circle cx="0" cy="-18" r="4.4" fill="none" stroke="#eafcff" strokeWidth="0.7" opacity="0.85" />
              <circle cx="-1.6" cy="-18.5" r="0.8" fill="#eafcff" opacity="0.95" />
              <circle cx="1.6" cy="-18.5" r="0.8" fill="#eafcff" opacity="0.95" />
              {/* antenna */}
              <line x1="0" y1="-22.4" x2="0" y2="-25" stroke="#8fe0ff" strokeWidth="0.6" opacity="0.7" />
              <circle cx="0" cy="-25" r="0.9" fill="#ff6ab0" opacity="0.9" />
              {/* held heart, out in front of the body where it reads clearly
                  rather than tucked in against the arm */}
              <path d={HEART_PATH} transform="translate(-9, 7) scale(0.65)" fill="#ff6ab0" opacity="0.95" filter="url(#softGlow)" />
              <path d={HEART_PATH} transform="translate(-9, 7) scale(0.65)" fill="none" stroke="#ffc2e0" strokeWidth="0.6" opacity="0.9" />
              {/* scan lines clipped to the robot's bounding box */}
              <g clipPath={`url(#space-valentines-robot-clip-${i})`} stroke="#8fe0ff" strokeWidth="0.5" opacity="0.3">
                <line x1="-9" y1="-18" x2="11" y2="-18" />
                <line x1="-9" y1="-11" x2="11" y2="-11" />
                <line x1="-9" y1="-4" x2="11" y2="-4" />
              </g>
            </g>
          </g>
        ))}

        {/* ===== SPACE HALLOWEEN: floating holo ghosts (up in the sky) =====
             Same ghost silhouette and `.ghost-float` bob as the village's
             HALLOWEEN_GHOSTS, recolored as translucent holograms — a low-
             opacity fill pass plus a `softGlow`-filtered outline pass, each
             wrapped in `.hologram-flicker` for the unstable-projection
             flicker, with a few horizontal scan lines clipped to the
             ghost's own silhouette. One cyan/violet/green per ghost so the
             trio reads as separate projections. Rendered here (after the
             buildings) purely for code proximity to the other Halloween
             decorations — their sky position means draw order relative to
             the buildings no longer matters, same as the city's version. */}
        {isSpace && holiday === 'halloween' && SPACE_HALLOWEEN_HOLO_GHOSTS.map((g, i) => (
          <g key={i} transform={`translate(${g.x}, ${g.y}) scale(${g.scale})`}>
            <clipPath id={`space-halloween-ghost-clip-${i}`}>
              <rect x="-8" y="-19" width="16" height="26" />
            </clipPath>
            <g
              className="ghost-float"
              style={{ animationDuration: `${g.duration}s`, animationDelay: `${g.delay}s` }}
            >
              <g className="hologram-flicker">
                <path
                  d="M -7 -4 C -7 -13, -4 -18, 0 -18 C 4 -18, 7 -13, 7 -4 L 7 5
                     C 7 5, 5.5 2, 4 5 C 2.5 8, 1 3, 0 6
                     C -1 3, -2.5 8, -4 5 C -5.5 2, -7 5, -7 5 Z"
                  fill={g.color}
                  opacity="0.18"
                />
                <path
                  d="M -7 -4 C -7 -13, -4 -18, 0 -18 C 4 -18, 7 -13, 7 -4 L 7 5
                     C 7 5, 5.5 2, 4 5 C 2.5 8, 1 3, 0 6
                     C -1 3, -2.5 8, -4 5 C -5.5 2, -7 5, -7 5 Z"
                  fill="none"
                  stroke={g.color}
                  strokeWidth="1"
                  opacity="0.75"
                  filter="url(#softGlow)"
                />
                <ellipse cx="-2.5" cy="-8" rx="1" ry="1.3" fill={g.color} opacity="0.9" />
                <ellipse cx="2.5" cy="-8" rx="1" ry="1.3" fill={g.color} opacity="0.9" />
                <g clipPath={`url(#space-halloween-ghost-clip-${i})`} stroke={g.color} strokeWidth="0.5" opacity="0.35">
                  <line x1="-8" y1="-15" x2="8" y2="-15" />
                  <line x1="-8" y1="-9" x2="8" y2="-9" />
                  <line x1="-8" y1="-3" x2="8" y2="-3" />
                  <line x1="-8" y1="3" x2="8" y2="3" />
                </g>
              </g>
            </g>
          </g>
        ))}

        {/* ===== SPACE HALLOWEEN: holo skeleton on the landing-pad deck =====
             Same skull/ribcage/limb shapes as the village's
             HALLOWEEN_SKELETONS, recolored as a translucent cyan hologram
             instead of solid bone — low-opacity fills/strokes, a
             `softGlow`-filtered skull outline, and horizontal scan lines
             clipped to the figure's bounding box, all wrapped in
             `.hologram-flicker`. Drawn after the buildings so it isn't
             clipped by anything in the left cluster. */}
        {isSpace && holiday === 'halloween' && SPACE_HALLOWEEN_HOLO_SKELETON.map((sk, i) => (
          <g key={i} transform={`translate(${sk.x}, ${sk.y}) scale(${sk.scale})`}>
            <clipPath id={`space-halloween-skeleton-clip-${i}`}>
              <rect x="-10" y="-13" width="20" height="21" />
            </clipPath>
            <g className="hologram-flicker">
              {/* faint ground glow — a hologram casts light, not shadow */}
              <ellipse cx="0" cy="5" rx="10" ry="2" fill="#3de0ff" opacity="0.12" />
              {/* skull */}
              <circle cx="0" cy="-10" r="4" fill="#3de0ff" opacity="0.14" />
              <circle cx="0" cy="-10" r="4" fill="none" stroke="#8fe0ff" strokeWidth="0.8" opacity="0.8" filter="url(#softGlow)" />
              <circle cx="-1.4" cy="-10.5" r="0.7" fill="#eafcff" opacity="0.9" />
              <circle cx="1.4" cy="-10.5" r="0.7" fill="#eafcff" opacity="0.9" />
              {/* ribcage */}
              <path d="M -3 -6 L -3.5 2 L 3.5 2 L 3 -6 Z" fill="#3de0ff" opacity="0.1" />
              <path d="M -3 -6 L -3.5 2 L 3.5 2 L 3 -6 Z" fill="none" stroke="#8fe0ff" strokeWidth="0.8" opacity="0.8" />
              <line x1="-2.6" y1="-4" x2="2.6" y2="-4" stroke="#8fe0ff" strokeWidth="0.6" opacity="0.6" />
              <line x1="-2.8" y1="-2" x2="2.8" y2="-2" stroke="#8fe0ff" strokeWidth="0.6" opacity="0.6" />
              <line x1="-3" y1="0" x2="3" y2="0" stroke="#8fe0ff" strokeWidth="0.6" opacity="0.6" />
              {/* arms resting on the ground */}
              <line x1="-3" y1="-5" x2="-7" y2="2" stroke="#8fe0ff" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
              <line x1="3" y1="-5" x2="6" y2="1" stroke="#8fe0ff" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
              {/* legs, sitting pose */}
              <line x1="-2" y1="2" x2="-6" y2="5" stroke="#8fe0ff" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
              <line x1="-6" y1="5" x2="-9" y2="4" stroke="#8fe0ff" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
              <line x1="2" y1="2" x2="7" y2="4" stroke="#8fe0ff" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
              {/* scan lines clipped to the figure's bounding box */}
              <g clipPath={`url(#space-halloween-skeleton-clip-${i})`} stroke="#eafcff" strokeWidth="0.5" opacity="0.3">
                <line x1="-10" y1="-9" x2="10" y2="-9" />
                <line x1="-10" y1="-4" x2="10" y2="-4" />
                <line x1="-10" y1="1" x2="10" y2="1" />
                <line x1="-10" y1="6" x2="10" y2="6" />
              </g>
            </g>
          </g>
        ))}

        {/* ===== CITY HALLOWEEN: floating neon ghosts (up in the sky) =====
            Same ghost silhouette and `.ghost-float` bob as the village's
            HALLOWEEN_GHOSTS, recolored neon with a glow-filtered fill pass
            under a crisp outline pass. Positioned well above every
            building's roofline (see CITY_HALLOWEEN_NEON_GHOSTS for the
            actual highest points) so they read as floating in open sky
            rather than pasted onto a facade, and clear of the skyscraper's
            full-height column (x 322-382) and the rooftop bats. Rendered
            here in the foreground group purely for code proximity to the
            other Halloween city decorations — their sky position means
            draw order relative to the buildings no longer matters. */}
        {isCity && holiday === 'halloween' && CITY_HALLOWEEN_NEON_GHOSTS.map((g, i) => (
          <g key={i} transform={`translate(${g.x}, ${g.y}) scale(${g.scale})`}>
            <g
              className="ghost-float"
              style={{ animationDuration: `${g.duration}s`, animationDelay: `${g.delay}s` }}
            >
              <path
                d="M -7 -4 C -7 -13, -4 -18, 0 -18 C 4 -18, 7 -13, 7 -4 L 7 5
                   C 7 5, 5.5 2, 4 5 C 2.5 8, 1 3, 0 6
                   C -1 3, -2.5 8, -4 5 C -5.5 2, -7 5, -7 5 Z"
                fill={g.color}
                opacity="0.35"
                filter="url(#softGlow)"
              />
              <path
                d="M -7 -4 C -7 -13, -4 -18, 0 -18 C 4 -18, 7 -13, 7 -4 L 7 5
                   C 7 5, 5.5 2, 4 5 C 2.5 8, 1 3, 0 6
                   C -1 3, -2.5 8, -4 5 C -5.5 2, -7 5, -7 5 Z"
                fill="none"
                stroke={g.color}
                strokeWidth="1"
                opacity="0.9"
              />
              <ellipse cx="-2.5" cy="-8" rx="1.1" ry="1.5" fill="#0d0c14" opacity="0.8" />
              <ellipse cx="2.5" cy="-8" rx="1.1" ry="1.5" fill="#0d0c14" opacity="0.8" />
            </g>
          </g>
        ))}

        {/* ===== CITY HALLOWEEN: extra street pumpkins in front of the
            casino/theater =====
            Same neon jack-o'-lantern sign as CITY_HALLOWEEN_MARQUEE_PUMPKINS,
            filling the pavement in front of the casino and theater that was
            otherwise bare. Positioned below each building's own
            ground-contact shadow (CITY_HALLOWEEN_STREET_PUMPKINS) so they
            clearly stand closer to the viewer than the facade, and drawn
            after those two buildings so they're never hidden behind one.
            No dark backing rect — glows directly on the street. */}
        {isCity && holiday === 'halloween' && CITY_HALLOWEEN_STREET_PUMPKINS.map((p, i) => (
          <g key={i} transform={`translate(${p.x}, ${p.y}) scale(${p.scale})`}>
            <ellipse cx="0" cy="-6" rx="6" ry="5" fill="none" stroke="#ff8c3d" strokeWidth="1.2" filter="url(#softGlow)" />
            <ellipse cx="0" cy="-6" rx="6" ry="5" fill="none" stroke="#ff8c3d" strokeWidth="1.2" className="neon-pulse" />
            <path d="M -1 -11 L 1 -11 L 1 -9 L -1 -9 Z" fill="#3f5225" />
            <g className="pumpkin-glow">
              <path d="M -3.5 -7.5 L -1.5 -7.5 L -2.5 -5.5 Z" fill="#ffb347" />
              <path d="M 3.5 -7.5 L 1.5 -7.5 L 2.5 -5.5 Z" fill="#ffb347" />
              <path d="M -2.5 -3.5 L -1 -2 L 0 -3.5 L 1 -2 L 2.5 -3.5 L 2 -2.5 L -2 -2.5 Z" fill="#ffb347" />
            </g>
          </g>
        ))}

        {/* ===== CITY CHRISTMAS: gifts at the foot of the tree =====
            Same box/ribbon shape as the village's CHRISTMAS_GIFTS, recolored
            neon: a dark box with a glow-filtered outline pass under a crisp
            pulsing one (the same double-stroke trick used elsewhere in the
            city decorations), plus a twinkling ribbon cross. Drawn after the
            casino so they sit in front of its facade. */}
        {isCity && holiday === 'christmas' && CITY_CHRISTMAS_GIFTS.map((g, i) => (
          <g key={i} transform={`translate(${g.x}, ${g.y}) scale(${g.scale})`}>
            <rect x="-4" y="-6" width="8" height="6" rx="0.6" fill="#0d0c14" opacity="0.85" />
            <rect x="-4" y="-6" width="8" height="6" rx="0.6" fill="none" stroke={g.box} strokeWidth="1.6" filter="url(#softGlow)" opacity="0.85" />
            <rect x="-4" y="-6" width="8" height="6" rx="0.6" fill="none" stroke={g.box} strokeWidth="0.8" className="neon-pulse" />
            <rect x="-1" y="-6" width="2" height="6" fill={g.ribbon} className="christmas-light-glow" />
            <rect x="-4" y="-3.5" width="8" height="1.5" fill={g.ribbon} className="christmas-light-glow" />
            <path d="M -2.2 -6 Q -3.2 -8 -0.6 -7.4 Z" fill={g.ribbon} />
            <path d="M 2.2 -6 Q 3.2 -8 0.6 -7.4 Z" fill={g.ribbon} />
          </g>
        ))}

        {/* ===== CITY CHRISTMAS: elves standing in the foreground =====
            Recognizable elf figure (pointed red hat with a glowing pompom,
            round face with pointed ears, green legs, red tunic) rather than
            an abstract neon shape, with a single neon rim-light stroke
            (`e.glow`) as the city touch. Positions (CITY_CHRISTMAS_ELVES)
            are fixed open-pavement spots — one by the tree/casino, two in
            front of the theater — not tucked behind any building. */}
        {isCity && holiday === 'christmas' && CITY_CHRISTMAS_ELVES.map((e, i) => (
          <g key={i} transform={`translate(${e.x}, ${e.y}) scale(${e.scale})`}>
            <ellipse cx="0" cy="1" rx="5" ry="1.3" fill="#000" opacity="0.35" />
            {/* legs */}
            <rect x="-2.6" y="-8" width="2" height="8" rx="0.8" fill="#1c8a4a" />
            <rect x="0.6" y="-8" width="2" height="8" rx="0.8" fill="#1c8a4a" />
            {/* curled-toe shoes */}
            <path d="M -3.4 0 Q -5.2 -0.2 -4.6 -1.6 L -1.6 -1.6 L -1.6 0 Z" fill="#ffd23d" />
            <path d="M 3.4 0 Q 5.2 -0.2 4.6 -1.6 L 1.6 -1.6 L 1.6 0 Z" fill="#ffd23d" />
            {/* tunic */}
            <path d="M -3.2 -8 Q 0 -6.4 3.2 -8 L 3 -16 Q 0 -17.4 -3 -16 Z" fill="#d9342a" />
            <rect x="-3.2" y="-10.5" width="6.4" height="1.4" fill="#f0c14a" />
            {/* arms with mitten hands */}
            <path d="M -3 -15 Q -6.5 -13 -6 -9" fill="none" stroke="#d9342a" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M 3 -15 Q 6.5 -13 6 -9" fill="none" stroke="#d9342a" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="-6" cy="-9" r="1.1" fill="#f0c14a" />
            <circle cx="6" cy="-9" r="1.1" fill="#f0c14a" />
            {/* head with pointed ears */}
            <path d="M -3.4 -19 L -5.6 -18 L -3.6 -17.2 Z" fill="#f2c8a0" />
            <path d="M 3.4 -19 L 5.6 -18 L 3.6 -17.2 Z" fill="#f2c8a0" />
            <circle cx="0" cy="-19" r="3.4" fill="#f2c8a0" />
            <circle cx="-1.2" cy="-19.4" r="0.5" fill="#2a2a26" />
            <circle cx="1.2" cy="-19.4" r="0.5" fill="#2a2a26" />
            <path d="M -0.8 -17.6 Q 0 -17 0.8 -17.6" fill="none" stroke="#c06a4a" strokeWidth="0.5" />
            {/* pointed, folded hat with a glowing pompom */}
            <path d="M -3.6 -21 Q -1 -29 5 -25 Q 1.5 -25.6 -1 -23.6 Q -2.6 -22.2 -3.6 -21 Z" fill="#d9342a" />
            <path d="M -3.6 -21 L 3.6 -21" stroke="#f0c14a" strokeWidth="1" opacity="0.9" />
            <circle cx="5" cy="-25" r="1.3" fill="#fff6d8" filter="url(#softGlow)" />
            <circle cx="5" cy="-25" r="0.8" fill="#fff6d8" className="christmas-light-glow" />
            {/* neon rim-light on the tunic, the city's accent on an
                otherwise traditionally-colored figure */}
            <path d="M -3.2 -8 Q 0 -6.4 3.2 -8 L 3 -16 Q 0 -17.4 -3 -16 Z" fill="none" stroke={e.glow} strokeWidth="0.7" opacity="0.85" filter="url(#softGlow)" />
          </g>
        ))}

        {/* ===== CITY NEW YEAR: champagne bottles in front of the
            casino/theater =====
            Standing neon champagne bottles (CITY_NEWYEAR_STREET_DECOR)
            filling the same pavement spots the Halloween street pumpkins
            and Christmas gifts use. Solid dark glass body first, then a
            glow pass + a crisp pulsing pass on top — the same double-stroke
            trick used everywhere else in the city decorations — so the
            casino/theater facade behind them is properly occluded rather
            than showing through (the lesson from the Christmas tree, which
            started outline-only). A few rising, fading bubbles above the
            neck for the "kohoavia kuplia" touch. */}
        {isCity && holiday === 'newyear' && CITY_NEWYEAR_STREET_DECOR.map((d, i) => (
          <g key={i} transform={`translate(${d.x}, ${d.y}) scale(${d.scale})`}>
            <ellipse cx="0" cy="1" rx="4" ry="1.1" fill="#000" opacity="0.35" />
            {/* solid bottle body */}
            <path d="M -3 0 L -3 -10 Q -3 -12 -1.6 -12.6 L -1.6 -15 L 1.6 -15 L 1.6 -12.6 Q 3 -12 3 -10 L 3 0 Z" fill="#0d2818" />
            {/* glow pass */}
            <path d="M -3 0 L -3 -10 Q -3 -12 -1.6 -12.6 L -1.6 -15 L 1.6 -15 L 1.6 -12.6 Q 3 -12 3 -10 L 3 0 Z" fill="none" stroke={d.color} strokeWidth="1.6" filter="url(#softGlow)" opacity="0.85" />
            {/* crisp pass */}
            <path d="M -3 0 L -3 -10 Q -3 -12 -1.6 -12.6 L -1.6 -15 L 1.6 -15 L 1.6 -12.6 Q 3 -12 3 -10 L 3 0 Z" fill="none" stroke={d.color} strokeWidth="0.8" className="neon-pulse" />
            {/* foil cap */}
            <rect x="-1.6" y="-15" width="3.2" height="2.5" fill={d.color} opacity="0.9" />
            {/* glowing label */}
            <ellipse cx="0" cy="-5" rx="2.2" ry="1.6" fill="#0d0c14" opacity="0.7" />
            <ellipse cx="0" cy="-5" rx="2.2" ry="1.6" fill="none" stroke={d.color} strokeWidth="0.5" opacity="0.9" />
            {/* rising, fading bubbles above the neck */}
            <circle className="newyear-bubble-rise" cx="0" cy="-16" r="0.6" fill={d.color} style={{ animationDelay: '0s' }} />
            <circle className="newyear-bubble-rise" cx="-1" cy="-16" r="0.5" fill={d.color} style={{ animationDelay: '0.6s' }} />
            <circle className="newyear-bubble-rise" cx="1" cy="-16" r="0.45" fill={d.color} style={{ animationDelay: '1.2s' }} />
          </g>
        ))}

        {/* ===== CITY VALENTINE'S: heart signs in front of the
            casino/theater =====
            Same glow-filtered + crisp double-stroke heart outline as
            CITY_VALENTINES_HEART_SIGNS, just placed in the same empty
            pavement spots the Halloween street pumpkins and New Year
            champagne bottles use — kept short so it clears each building's
            own ground-contact shadow the same way those did. No dark
            backing rect — glows directly on the street. */}
        {isCity && holiday === 'valentines' && CITY_VALENTINES_STREET_HEARTS.map((h, i) => (
          <g key={i} transform={`translate(${h.x}, ${h.y}) scale(${h.scale})`}>
            <g className="neon-pulse">
              <path d={HEART_PATH} transform="translate(0, -7) scale(0.9)" fill="none" stroke={h.color} strokeWidth="1.2" filter="url(#softGlow)" />
              <path d={HEART_PATH} transform="translate(0, -7) scale(0.9)" fill="none" stroke={h.color} strokeWidth="1.2" />
            </g>
          </g>
        ))}

        {/* ===== CITY EASTER: eggs in front of the casino/theater =====
            Solid-filled neon eggs (glow pass + crisp pass, same as the
            sky-layer CITY_EASTER_NEON_EGG_FLOATERS, unlike the outline-only
            CITY_EASTER_NEON_EGGS ground signage) placed in the same empty
            pavement spots the Halloween/New Year/Valentine's street props
            use. */}
        {isCity && holiday === 'easter' && CITY_EASTER_STREET_EGGS.map((e, i) => (
          <g key={i} transform={`translate(${e.x}, ${e.y}) scale(${e.scale})`}>
            <ellipse cx="0" cy="1" rx="4" ry="1.1" fill="#000" opacity="0.3" />
            <path
              d="M 0 -16 C 4 -16 5 -10 5 -6 C 5 -2 2.5 0 0 0 C -2.5 0 -5 -2 -5 -6 C -5 -10 -4 -16 0 -16 Z"
              fill={e.color}
              opacity="0.9"
              filter="url(#softGlow)"
            />
            <path
              d="M 0 -16 C 4 -16 5 -10 5 -6 C 5 -2 2.5 0 0 0 C -2.5 0 -5 -2 -5 -6 C -5 -10 -4 -16 0 -16 Z"
              fill={e.color}
              opacity="0.9"
            />
            {/* a simple painted band, a small nod to a decorated Easter egg */}
            <path d="M -5 -8 Q 0 -6 5 -8" fill="none" stroke="#fff" strokeWidth="0.6" opacity="0.5" />
          </g>
        ))}

        {/* ===== CITY EASTER: chick standing in front of the casino =====
            A clearly-readable chick (round fluffy body, wings, head tuft,
            eyes, orange beak/feet) rather than an abstract neon shape —
            same "recognizable figure + one neon accent" approach as the
            Christmas elves — standing between the two casino-front eggs
            above (CITY_EASTER_STREET_EGGS at x 46/86). */}
        {isCity && holiday === 'easter' && (
          <g transform={`translate(${CITY_EASTER_NEON_CHICK.x}, ${CITY_EASTER_NEON_CHICK.y}) scale(${CITY_EASTER_NEON_CHICK.scale})`}>
            <ellipse cx="0" cy="1" rx="4" ry="1.1" fill="#000" opacity="0.3" />
            {/* legs and feet */}
            <line x1="-2" y1="0" x2="-2" y2="-3" stroke="#ff8c3d" strokeWidth="0.9" />
            <line x1="2" y1="0" x2="2" y2="-3" stroke="#ff8c3d" strokeWidth="0.9" />
            <path d="M -2 0 L -3.2 1.6 M -2 0 L -0.8 1.6" stroke="#ff8c3d" strokeWidth="0.8" strokeLinecap="round" fill="none" />
            <path d="M 2 0 L 0.8 1.6 M 2 0 L 3.2 1.6" stroke="#ff8c3d" strokeWidth="0.8" strokeLinecap="round" fill="none" />
            {/* wings */}
            <ellipse cx="-6" cy="-8" rx="2" ry="3.2" fill="#ffd23d" opacity="0.9" transform="rotate(-20 -6 -8)" />
            <ellipse cx="6" cy="-8" rx="2" ry="3.2" fill="#ffd23d" opacity="0.9" transform="rotate(20 6 -8)" />
            {/* round fluffy body, bright yellow neon glow */}
            <ellipse cx="0" cy="-9" rx="6.5" ry="6" fill="#fff394" opacity="0.9" filter="url(#softGlow)" />
            <ellipse cx="0" cy="-9" rx="6.5" ry="6" fill="#ffe066" />
            <ellipse cx="0" cy="-9" rx="6.5" ry="6" fill="none" stroke="#fff6d8" strokeWidth="0.6" opacity="0.8" className="neon-pulse" />
            {/* head fluff tuft */}
            <path d="M -1.2 -15.5 Q 0 -18.5 1.2 -15.5" fill="none" stroke="#ffe066" strokeWidth="1.3" strokeLinecap="round" />
            {/* eyes */}
            <circle cx="-2.2" cy="-11" r="0.8" fill="#1a1a1a" />
            <circle cx="2.2" cy="-11" r="0.8" fill="#1a1a1a" />
            <circle cx="-1.9" cy="-11.3" r="0.3" fill="#fff" />
            <circle cx="2.5" cy="-11.3" r="0.3" fill="#fff" />
            {/* beak */}
            <path d="M -1.6 -9 L 0 -7.5 L 1.6 -9 Z" fill="#ff8c3d" />
          </g>
        )}

        {/* ===== CITY HOLIDAY STANDEES (foreground) =====
            The neon counterpart to the village's campfire-side props
            (ghost/snowman/toast/heart-glow/bunny) — a single glowing sign
            standing on the street beside the survivor. Drawn after every
            city building (including the theater/casino, whose footprints
            reach this x range) so it's never hidden behind one, the way the
            parked car briefly was earlier when it rendered too early. */}

        {/* CITY HALLOWEEN — neon jack-o'-lantern standee */}
        {isCity && holiday === 'halloween' && (
          <g transform={`translate(${CITY_HALLOWEEN_NEON_SIGN.x}, ${CITY_HALLOWEEN_NEON_SIGN.y}) scale(${CITY_HALLOWEEN_NEON_SIGN.scale})`}>
            <rect x="-1.2" y="-4" width="2.4" height="20" fill="#1c1a28" />
            <ellipse cx="0" cy="16" rx="7" ry="2" fill="#000" opacity="0.35" />
            <g className="neon-sign-buzz">
              <ellipse cx="0" cy="-16" rx="10" ry="9" fill="none" stroke="#ff8c3d" strokeWidth="1.6" filter="url(#softGlow)" />
              <ellipse cx="0" cy="-16" rx="10" ry="9" fill="none" stroke="#ff8c3d" strokeWidth="1.6" />
              <path d="M -3.5 -25 Q 0 -29 3.5 -25" fill="none" stroke="#3f5225" strokeWidth="1.6" />
              <g className="pumpkin-glow">
                <path d="M -5.5 -19 L -2 -19 L -3.7 -15 Z" fill="#ffb347" />
                <path d="M 5.5 -19 L 2 -19 L 3.7 -15 Z" fill="#ffb347" />
                <path d="M -4 -11 L -1.5 -9 L 0 -11 L 1.5 -9 L 4 -11 L 3 -9.5 L -3 -9.5 Z" fill="#ffb347" />
              </g>
            </g>
          </g>
        )}

        {/* CITY CHRISTMAS — big, lit neon tree standing in front of the
            casino (moved off the shared standee spot; see
            CITY_CHRISTMAS_NEON_TREE for why). Each tier now has a solid dark
            body under the neon outline — an earlier version was outline-only
            (fill="none"), so where it overlapped the casino's window grid
            the windows showed straight through it and it read as pasted
            onto the wall instead of standing in front of it. The outline
            itself is still drawn twice — a wide blurred glow pass, then a
            crisp pass on top — the same double-stroke trick used by the
            Halloween web/pumpkins, and the ornament count/palette is bumped
            up (one per neon color, spread across all three tiers) so it
            reads as lit rather than a bare wireframe. */}
        {isCity && holiday === 'christmas' && (
          <g transform={`translate(${CITY_CHRISTMAS_NEON_TREE.x}, ${CITY_CHRISTMAS_NEON_TREE.y}) scale(${CITY_CHRISTMAS_NEON_TREE.scale})`}>
            <ellipse cx="0" cy="1" rx="9" ry="2" fill="#000" opacity="0.35" />
            <g className="neon-sign-buzz">
              <rect x="-3" y="-6" width="6" height="6" fill="#0d0c14" />
              {/* solid body, so the tree fully occludes whatever is behind
                  it instead of letting it show through the outline */}
              <path d="M -9 -6 L 0 -16 L 9 -6 Z" fill="#0f2e18" />
              <path d="M -7 -12 L 0 -21 L 7 -12 Z" fill="#123a1e" />
              <path d="M -5 -18 L 0 -26 L 5 -18 Z" fill="#164625" />
              {/* glow pass */}
              <path d="M -9 -6 L 0 -16 L 9 -6 Z" fill="none" stroke="#3ddc6a" strokeWidth="2.6" filter="url(#softGlow)" opacity="0.85" />
              <path d="M -7 -12 L 0 -21 L 7 -12 Z" fill="none" stroke="#3ddc6a" strokeWidth="2.4" filter="url(#softGlow)" opacity="0.85" />
              <path d="M -5 -18 L 0 -26 L 5 -18 Z" fill="none" stroke="#3ddc6a" strokeWidth="2.2" filter="url(#softGlow)" opacity="0.85" />
              {/* crisp pass */}
              <path d="M -9 -6 L 0 -16 L 9 -6 Z" fill="none" stroke="#3ddc6a" strokeWidth="1.4" />
              <path d="M -7 -12 L 0 -21 L 7 -12 Z" fill="none" stroke="#3ddc6a" strokeWidth="1.3" />
              <path d="M -5 -18 L 0 -26 L 5 -18 Z" fill="none" stroke="#3ddc6a" strokeWidth="1.2" />
              {/* bright glow-filtered star */}
              <path
                d="M 0 -30 L 1.1 -27.3 L 4 -27 L 1.8 -25 L 2.4 -22.2 L 0 -23.7 L -2.4 -22.2 L -1.8 -25 L -4 -27 L -1.1 -27.3 Z"
                fill="#fff6d8"
                filter="url(#softGlow)"
              />
              <path
                d="M 0 -30 L 1.1 -27.3 L 4 -27 L 1.8 -25 L 2.4 -22.2 L 0 -23.7 L -2.4 -22.2 L -1.8 -25 L -4 -27 L -1.1 -27.3 Z"
                fill="#ffd23d"
                className="christmas-light-glow"
              />
              {/* ornaments spread across all three tiers, neon palette */}
              <circle cx="-4" cy="-8" r="1.1" fill="#ff3d9a" className="christmas-light-glow" style={{ animationDelay: '0.1s' }} />
              <circle cx="4" cy="-9" r="1.1" fill="#3de0ff" className="christmas-light-glow" style={{ animationDelay: '0.5s' }} />
              <circle cx="0" cy="-7" r="1" fill="#ffd23d" className="christmas-light-glow" style={{ animationDelay: '0.8s' }} />
              <circle cx="-4" cy="-14" r="1" fill="#3de0ff" className="christmas-light-glow" style={{ animationDelay: '0.3s' }} />
              <circle cx="4" cy="-15" r="1" fill="#b24bf3" className="christmas-light-glow" style={{ animationDelay: '0.7s' }} />
              <circle cx="0" cy="-13" r="0.9" fill="#ff3d9a" className="christmas-light-glow" style={{ animationDelay: '1.1s' }} />
              <circle cx="-3" cy="-19" r="0.9" fill="#ffd23d" className="christmas-light-glow" style={{ animationDelay: '0.4s' }} />
              <circle cx="3" cy="-20" r="0.9" fill="#ff3d9a" className="christmas-light-glow" style={{ animationDelay: '0.9s' }} />
              <circle cx="0" cy="-22" r="0.8" fill="#3de0ff" className="christmas-light-glow" style={{ animationDelay: '0.2s' }} />
            </g>
          </g>
        )}

        {/* CITY NEW YEAR — neon champagne-toast standee */}
        {isCity && holiday === 'newyear' && (
          <g transform={`translate(${CITY_NEWYEAR_NEON_TOAST.x}, ${CITY_NEWYEAR_NEON_TOAST.y}) scale(${CITY_NEWYEAR_NEON_TOAST.scale})`}>
            <ellipse cx="0" cy="1" rx="9" ry="2" fill="#000" opacity="0.35" />
            <g className="neon-sign-buzz">
              <line x1="-6" y1="0" x2="-5" y2="-9" stroke="#f0c14a" strokeWidth="1" />
              <path d="M -7.2 -9 L -2.8 -9 L -3.6 -16.5 L -6.4 -15.5 Z" fill="none" stroke="#f0c14a" strokeWidth="1" filter="url(#softGlow)" />
              <path d="M -7.2 -9 L -2.8 -9 L -3.6 -16.5 L -6.4 -15.5 Z" fill="none" stroke="#f0c14a" strokeWidth="1" />
              <line x1="4" y1="0" x2="3" y2="-9" stroke="#3de0ff" strokeWidth="1" />
              <path d="M 2.8 -9 L 7.2 -9 L 6.4 -15.5 L 3.6 -16.5 Z" fill="none" stroke="#3de0ff" strokeWidth="1" filter="url(#softGlow)" />
              <path d="M 2.8 -9 L 7.2 -9 L 6.4 -15.5 L 3.6 -16.5 Z" fill="none" stroke="#3de0ff" strokeWidth="1" />
              <path
                d="M 0 -17.6 L 0.5 -16.3 L 1.8 -16 L 0.5 -15.7 L 0 -14.4 L -0.5 -15.7 L -1.8 -16 L -0.5 -16.3 Z"
                fill="#fff6d8"
                className="newyear-sparkle"
              />
            </g>
          </g>
        )}

        {/* CITY VALENTINE'S — neon heart-glow standee, same technique as the
            village's campfire-side heart glow, recolored hot pink/cyan */}
        {isCity && holiday === 'valentines' && (
          <g transform={`translate(${CITY_VALENTINES_NEON_HEART_GLOW.x}, ${CITY_VALENTINES_NEON_HEART_GLOW.y}) scale(${CITY_VALENTINES_NEON_HEART_GLOW.scale})`}>
            <path d={HEART_PATH} transform="translate(0, -14) scale(2)" fill="#ff2d78" opacity="0.3" filter="url(#softGlow)" />
            <g className="valentine-heart-glow">
              <path d={HEART_PATH} transform="translate(0, -14) scale(1.1)" fill="#ff3d9a" />
              <path d={HEART_PATH} transform="translate(-2.5, -17) scale(0.5)" fill="#9ff0ff" opacity="0.7" />
            </g>
          </g>
        )}

        {/* CITY EASTER — neon-outline bunny standee */}
        {isCity && holiday === 'easter' && (
          <g transform={`translate(${CITY_EASTER_NEON_BUNNY.x}, ${CITY_EASTER_NEON_BUNNY.y}) scale(${CITY_EASTER_NEON_BUNNY.scale})`}>
            <ellipse cx="0" cy="1" rx="8" ry="2" fill="#000" opacity="0.35" />
            <g className="neon-sign-buzz">
              <ellipse cx="-2.3" cy="-23" rx="1.6" ry="7" fill="none" stroke="#ff9ad1" strokeWidth="1.1" transform="rotate(-12 -2.3 -23)" />
              <ellipse cx="2.3" cy="-23" rx="1.6" ry="7" fill="none" stroke="#ff9ad1" strokeWidth="1.1" transform="rotate(12 2.3 -23)" />
              <ellipse cx="0" cy="-9" rx="6" ry="7.5" fill="none" stroke="#ff9ad1" strokeWidth="1.2" filter="url(#softGlow)" />
              <ellipse cx="0" cy="-9" rx="6" ry="7.5" fill="none" stroke="#ff9ad1" strokeWidth="1.2" />
              <circle cx="0" cy="-17.5" r="4.6" fill="none" stroke="#ff9ad1" strokeWidth="1.2" />
              <circle cx="-1.6" cy="-17.5" r="0.5" fill="#9ae0ff" />
              <circle cx="1.6" cy="-17.5" r="0.5" fill="#9ae0ff" />
            </g>
          </g>
        )}

        {/* Weather: rain in autumn, snow in winter — not every day. Ground
            weather doesn't reach the space colony (see condition effects
            above instead). */}
        {!isSpace && weather === 'rain' && (
          <g opacity="0.55">
            {RAIN_DROPS.map((d, i) => (
              <line
                key={i}
                x1={d.x}
                y1="-10"
                x2={d.x - 6}
                y2="14"
                stroke="#9fb8cc"
                strokeWidth="1.4"
                strokeLinecap="round"
                className="rain-drop"
                style={{ animationDelay: `${d.delay}s`, animationDuration: `${d.duration}s` }}
              />
            ))}
          </g>
        )}
        {!isSpace && weather === 'snow' && (
          <g opacity="0.85">
            {SNOW_FLAKES.map((f, i) => (
              <circle
                key={i}
                cx={f.x}
                cy="-10"
                r={f.r}
                fill="#f2f6fa"
                className="snow-flake"
                style={{ animationDelay: `${f.delay}s`, animationDuration: `${f.duration}s` }}
              />
            ))}
          </g>
        )}
        {!isSpace && weather === 'thunder' && (
          <g>
            {/* Heavy downpour */}
            <g opacity="0.6">
              {STORM_RAIN_DROPS.map((d, i) => (
                <line
                  key={i}
                  x1={d.x}
                  y1="-10"
                  x2={d.x - 7}
                  y2="16"
                  stroke="#9fb8cc"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  className="rain-drop"
                  style={{ animationDelay: `${d.delay}s`, animationDuration: `${d.duration}s` }}
                />
              ))}
            </g>
            {/* Lightning bolts, each flickering on its own irregular cycle */}
            {LIGHTNING_BOLTS.map((b, i) => (
              <path
                key={i}
                d={b.path}
                fill="none"
                stroke="#f2f0e0"
                strokeWidth="2.2"
                strokeLinejoin="round"
                className="lightning-bolt"
                style={{ animationDelay: `${b.delay}s` }}
              />
            ))}
            {/* Whole-scene flash, synced loosely with the bolts */}
            <rect x="0" y="0" width="400" height="300" fill="#e8ecf5" className="lightning-flash" />
          </g>
        )}

        {/* NIMEONITER sign (always, front — in the gap right of the fence,
            ahead of the storage shed and watchtower): carved wood in the
            medieval world, a Las Vegas-style neon tube sign in the city, a
            flickering hologram projection in the space colony */}
        {isSpace ? (
        <g>
          {/* a hologram casts light, not shade — a faint ground glow stands
              in for the other worlds' solid post shadow */}
          <ellipse cx="260" cy="294" rx="44" ry="4" fill="#3de0ff" opacity="0.12" />
          {/* projector base */}
          <rect x="245" y="288" width="30" height="6" rx="2" fill="url(#spaceMetalDark)" />
          <circle cx="260" cy="288" r="2" fill="#3de0ff" opacity="0.9" />
          {/* holographic panel: translucent, scanlined, flickering */}
          <g className="hologram-flicker">
            <rect x="216" y="256" width="88" height="30" rx="2" fill="#3de0ff" opacity="0.08" />
            <rect x="216" y="256" width="88" height="30" rx="2" fill="none" stroke="#3de0ff" strokeWidth="1" opacity="0.6" />
            {Array.from({ length: 6 }, (_, i) => (
              <line key={i} x1="216" y1={260 + i * 5} x2="304" y2={260 + i * 5} stroke="#8fe0ff" strokeWidth="0.6" opacity="0.25" />
            ))}
            <text x="260" y="275" fontFamily="Georgia, serif" fontSize="9" fontWeight="bold" letterSpacing="0.6" textAnchor="middle" fill="none" stroke="#8fe0ff" strokeWidth="1.4" filter="url(#glow)" opacity="0.9">NIMEONITER</text>
            <text x="260" y="275" fontFamily="Georgia, serif" fontSize="9" fontWeight="bold" letterSpacing="0.6" textAnchor="middle" fill="#eafcff" opacity="0.95">NIMEONITER</text>
            {/* moving scan sweep */}
            <rect x="216" y="256" width="6" height="30" fill="#eafcff" opacity="0.25" className="hologram-scan-sweep" />
          </g>
        </g>
        ) : !isCity ? (
        <g>
          <ellipse cx="260" cy="294" rx="42" ry="4" fill="#000" opacity="0.4" />
          {/* posts */}
          <rect x="237" y="271" width="7" height="24" fill="url(#woodDark)" />
          <rect x="276" y="271" width="7" height="24" fill="url(#woodDark)" />
          {/* board */}
          <rect x="220" y="260" width="80" height="25" rx="3" fill="url(#wood)" stroke="#1c150d" strokeWidth="1.2" />
          <rect x="222" y="262" width="76" height="21" rx="2" fill="none" stroke="#6b5836" strokeWidth="0.6" opacity="0.4" />
          {/* nails */}
          <circle cx="228" cy="266" r="1.2" fill="#8a7350" />
          <circle cx="292" cy="266" r="1.2" fill="#8a7350" />
          {/* engraved text: shadow then bright face for relief */}
          <text x="260.6" y="276.6" fontFamily="Georgia, serif" fontSize="9" fontWeight="bold" letterSpacing="0.6" textAnchor="middle" fill="#140f08">NIMEONITER</text>
          <text x="260" y="276" fontFamily="Georgia, serif" fontSize="9" fontWeight="bold" letterSpacing="0.6" textAnchor="middle" fill="#d9b06a">NIMEONITER</text>
        </g>
        ) : (
        <g>
          <ellipse cx="260" cy="294" rx="46" ry="4" fill="#000" opacity="0.4" />
          {/* metal support poles */}
          <rect x="235" y="271" width="5" height="24" fill="#1c1a28" />
          <rect x="279" y="271" width="5" height="24" fill="#1c1a28" />
          {/* dark marquee backing */}
          <rect x="214" y="258" width="92" height="28" rx="3" fill="#0d0c14" stroke="#1c1a28" strokeWidth="1.5" />
          {/* chasing bulb border */}
          {Array.from({ length: 16 }, (_, i) => (
            <circle
              key={i}
              cx={219 + i * 5.7}
              cy={i % 2 === 0 ? 261 : 283}
              r="1.2"
              fill="#ffd23d"
              className="christmas-light-glow"
              style={{ animationDelay: `${i * 0.08}s` }}
            />
          ))}
          {/* glowing neon tube lettering */}
          <g filter="url(#glow)">
            <text
              x="260"
              y="276"
              fontFamily="Georgia, serif"
              fontSize="9"
              fontWeight="bold"
              letterSpacing="0.6"
              textAnchor="middle"
              fill="none"
              stroke="#ff3d9a"
              strokeWidth="1.6"
              className="neon-pulse"
            >
              NIMEONITER
            </text>
            <text
              x="260"
              y="276"
              fontFamily="Georgia, serif"
              fontSize="9"
              fontWeight="bold"
              letterSpacing="0.6"
              textAnchor="middle"
              fill="#fff6d8"
              className="neon-pulse"
            >
              NIMEONITER
            </text>
          </g>
        </g>
        )}

        {/* ===== SPACE HALLOWEEN: holo jack-o'-lanterns on the landing-pad
             deck ===== Same body/stalk/carved-face shapes as the village's
             HALLOWEEN_PUMPKINS, recolored as translucent cyan holograms
             with scan lines clipped to the body, wrapped in
             `.hologram-flicker`. Drawn after the NIMEONITER sign (rather
             than right after the reactor, where the rest of this file's
             other Halloween decorations sit) so the two pumpkins tucked in
             right against the sign's edge render on top of its panel
             instead of being clipped by it. */}
        {isSpace && holiday === 'halloween' && SPACE_HALLOWEEN_HOLO_PUMPKINS.map((p, i) => (
          <g key={i} transform={`translate(${p.x}, ${p.y}) scale(${p.scale})`}>
            <clipPath id={`space-halloween-pumpkin-clip-${i}`}>
              <rect x="-10" y="-12" width="20" height="20" />
            </clipPath>
            <g className="hologram-flicker">
              <rect x="-1.5" y="-11" width="3" height="4" rx="1" fill="#3de0ff" opacity="0.4" />
              <ellipse cx="0" cy="0" rx="9" ry="7" fill="#3de0ff" opacity="0.14" />
              <ellipse cx="0" cy="0" rx="9" ry="7" fill="none" stroke="#8fe0ff" strokeWidth="1" opacity="0.7" filter="url(#softGlow)" />
              <path d="M -5 -2 L -2 -2 L -3.5 1 Z" fill="#eafcff" opacity="0.9" />
              <path d="M 5 -2 L 2 -2 L 3.5 1 Z" fill="#eafcff" opacity="0.9" />
              <path d="M -4 3 L -2 5 L 0 3 L 2 5 L 4 3 L 3 4.5 L -3 4.5 Z" fill="#eafcff" opacity="0.9" />
              <g clipPath={`url(#space-halloween-pumpkin-clip-${i})`} stroke="#8fe0ff" strokeWidth="0.5" opacity="0.3">
                <line x1="-10" y1="-7" x2="10" y2="-7" />
                <line x1="-10" y1="-2" x2="10" y2="-2" />
                <line x1="-10" y1="3" x2="10" y2="3" />
              </g>
            </g>
          </g>
        ))}

        {/* WINTER SNOWMAN — season-wide (season === 'winter'), independent
            of any holiday, so it can appear alongside a winter holiday's own
            standee (Christmas/New Year/Valentine's all fall in winter) as
            well as on its own. Same classic snowman in both worlds (see
            WINTER_SNOWMAN for why each world's position clears its own
            buildings/sign/survivor); drawn last so it isn't hidden behind
            anything. The village's Christmas standee (below, "beside the
            campfire") used to be a second snowman here too, which read as
            redundant/floating next to this one — it's now an elf instead,
            so this is the only snowman in the village during Christmas. */}
        {!isSpace && season === 'winter' && (() => {
          const sm = isCity ? WINTER_SNOWMAN.city : WINTER_SNOWMAN.village;
          return (
            <g transform={`translate(${sm.x}, ${sm.y}) scale(${sm.scale})`}>
              <ellipse cx="0" cy="1" rx="10" ry="2.2" fill="#000" opacity="0.35" />
              {/* three stacked snowballs, slightly overlapping */}
              <circle cx="0" cy="-7" r="7" fill="#eef3f6" />
              <circle cx="0" cy="-17" r="5.5" fill="#eef3f6" />
              <circle cx="0" cy="-25" r="4" fill="#eef3f6" />
              {/* soft shading, same trick as the celestial bodies */}
              <ellipse cx="2.5" cy="-6" rx="4.5" ry="6" fill="#c8d4da" opacity="0.35" />
              <ellipse cx="2" cy="-16" rx="3.4" ry="4.6" fill="#c8d4da" opacity="0.35" />
              {/* twig arms */}
              <line x1="-5" y1="-17" x2="-13" y2="-22" stroke="#5c4028" strokeWidth="1" strokeLinecap="round" />
              <line x1="-13" y1="-22" x2="-16" y2="-19" stroke="#5c4028" strokeWidth="0.7" strokeLinecap="round" />
              <line x1="-13" y1="-22" x2="-15" y2="-24" stroke="#5c4028" strokeWidth="0.7" strokeLinecap="round" />
              <line x1="5" y1="-17" x2="13" y2="-13" stroke="#5c4028" strokeWidth="1" strokeLinecap="round" />
              <line x1="13" y1="-13" x2="16" y2="-15" stroke="#5c4028" strokeWidth="0.7" strokeLinecap="round" />
              <line x1="13" y1="-13" x2="15" y2="-11" stroke="#5c4028" strokeWidth="0.7" strokeLinecap="round" />
              {/* coal buttons */}
              <circle cx="0" cy="-9" r="0.6" fill="#1a1a1a" />
              <circle cx="0" cy="-14" r="0.6" fill="#1a1a1a" />
              {/* scarf, knotted at the neck with a dangling tail */}
              <path d="M -4 -21 Q 0 -19 4 -21 L 4 -19.3 Q 0 -17.3 -4 -19.3 Z" fill="#b5342a" />
              <rect x="1.8" y="-19.3" width="2.2" height="7" rx="1" fill="#b5342a" transform="rotate(18 2.9 -19.3)" />
              {/* coal eyes and carrot nose */}
              <circle cx="-1.4" cy="-26" r="0.7" fill="#1a1a1a" />
              <circle cx="1.4" cy="-26" r="0.7" fill="#1a1a1a" />
              <path d="M 4 -25 L 9 -24.3 L 4 -23.6 Z" fill="#e2822a" />
              {/* top hat */}
              <ellipse cx="0" cy="-29" rx="5" ry="1.3" fill="#1c1c1c" />
              <rect x="-3" y="-36" width="6" height="7" rx="1" fill="#1c1c1c" />
              <rect x="-3" y="-31.2" width="6" height="1.8" fill="#b5342a" />
            </g>
          );
        })()}

        {/* CHRISTMAS WREATH, hung above the sign board (village-only: sized
            and positioned for the wooden sign board, not the city's neon
            marquee) */}
        {!isCity && !isSpace && holiday === 'christmas' && (
          <g transform={`translate(${CHRISTMAS_WREATH.x}, ${CHRISTMAS_WREATH.y}) scale(${CHRISTMAS_WREATH.scale})`}>
            {/* pine ring */}
            <circle cx="0" cy="0" r="6.5" fill="none" stroke="#2f5c3a" strokeWidth="3.2" />
            <circle cx="0" cy="0" r="6.5" fill="none" stroke="#1f4028" strokeWidth="1" strokeDasharray="1.6 1.4" opacity="0.6" />
            {/* berries */}
            <circle cx="-3.5" cy="-5.4" r="0.7" fill="#c8402e" />
            <circle cx="5.8" cy="-2" r="0.7" fill="#c8402e" />
            <circle cx="-5.8" cy="2" r="0.7" fill="#c8402e" />
            {/* bow at the bottom */}
            <path d="M -2.2 6.2 Q -4 4 -0.6 5.2 Z" fill="#b5342a" />
            <path d="M 2.2 6.2 Q 4 4 0.6 5.2 Z" fill="#b5342a" />
            <circle cx="0" cy="5.6" r="1" fill="#8a2620" />
            <rect x="-0.6" y="6" width="1.2" height="4" fill="#b5342a" transform="rotate(8 0 6)" />
          </g>
        )}

      </svg>

      <p className="base-world-stage">{stageKey.toUpperCase()}</p>
    </div>
  );
}

export default BaseWorld;