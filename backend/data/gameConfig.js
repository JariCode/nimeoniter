// All game economy rules — the backend is the source of truth.

// Total XP needed to go from level N to N+1. Growing cost.
function xpForLevel(level) {
  return level * 100;
}

// Buildings in the order they get built. Each stays permanently once built.
// The starting camp is free and not in this list.
const BUILD_STAGES = [
  { key: 'well',          name: 'WELL',           world: 'medieval', requiredLevel: 2,  cost: { wood: 10,  stone: 5,   food: 25 } },
  { key: 'hut',           name: 'HUT',            world: 'medieval', requiredLevel: 3,  cost: { wood: 20,  stone: 10,  food: 30 } },
  { key: 'house',         name: 'HOUSE',          world: 'medieval', requiredLevel: 5,  cost: { wood: 35,  stone: 25,  food: 30 } },
  { key: 'field',         name: 'FIELD',          world: 'medieval', requiredLevel: 7,  cost: { wood: 50,  stone: 35,  food: 40 } },
  { key: 'storage',       name: 'STORAGE',        world: 'medieval', requiredLevel: 9,  cost: { wood: 65,  stone: 50,  food: 60 } },
  { key: 'fence',         name: 'FENCE',          world: 'medieval', requiredLevel: 11, cost: { wood: 80,  stone: 65,  food: 75 } },
  { key: 'watchtower',    name: 'WATCHTOWER',     world: 'medieval', requiredLevel: 14, cost: { wood: 160, stone: 120, food: 140 } },
  { key: 'wall',          name: 'WALL',           world: 'medieval', requiredLevel: 18, cost: { wood: 270, stone: 210, food: 240 } },
  { key: 'street',        name: 'STREET',         world: 'city', requiredLevel: 21, cost: { wood: 280, stone: 220, food: 250 } },
  { key: 'apartment',     name: 'APARTMENT',      world: 'city', requiredLevel: 24, cost: { wood: 300, stone: 230, food: 260 } },
  { key: 'diner',         name: 'DINER',          world: 'city', requiredLevel: 27, cost: { wood: 330, stone: 250, food: 290 } },
  { key: 'shop',          name: 'SHOP',           world: 'city', requiredLevel: 30, cost: { wood: 360, stone: 280, food: 320 } },
  { key: 'hotel',         name: 'HOTEL',          world: 'city', requiredLevel: 34, cost: { wood: 550, stone: 430, food: 480 } },
  { key: 'casino',        name: 'CASINO',         world: 'city', requiredLevel: 38, cost: { wood: 620, stone: 480, food: 550 } },
  { key: 'theater',       name: 'THEATER',        world: 'city', requiredLevel: 42, cost: { wood: 690, stone: 540, food: 610 } },
  { key: 'skyscraper',    name: 'SKYSCRAPER',     world: 'city', requiredLevel: 46, cost: { wood: 750, stone: 590, food: 670 } },
  { key: 'landing-pad',   name: 'LANDING PAD',    world: 'space', requiredLevel: 50, cost: { wood: 820,  stone: 640,  food: 730 } },
  { key: 'habitat',       name: 'HABITAT',        world: 'space', requiredLevel: 54, cost: { wood: 890,  stone: 700,  food: 790 } },
  { key: 'greenhouse',    name: 'GREENHOUSE',     world: 'space', requiredLevel: 58, cost: { wood: 960,  stone: 750,  food: 850 } },
  { key: 'solar-array',   name: 'SOLAR ARRAY',    world: 'space', requiredLevel: 62, cost: { wood: 1030, stone: 810,  food: 920 } },
  { key: 'comms-tower',   name: 'COMMS TOWER',    world: 'space', requiredLevel: 66, cost: { wood: 1100, stone: 860,  food: 980 } },
  { key: 'lab',           name: 'LAB',            world: 'space', requiredLevel: 70, cost: { wood: 1170, stone: 920,  food: 1040 } },
  { key: 'reactor',       name: 'REACTOR',        world: 'space', requiredLevel: 75, cost: { wood: 1560, stone: 1220, food: 1380 } },
  { key: 'command-tower', name: 'COMMAND TOWER',  world: 'space', requiredLevel: 80, cost: { wood: 1670, stone: 1310, food: 1480 } },
];

// Level, progress within the level, and XP needed for the next — from total XP
function levelFromXp(xp) {
  let level = 1;
  let consumed = 0;
  while (xp >= consumed + xpForLevel(level)) {
    consumed += xpForLevel(level);
    level += 1;
  }
  return { level, xpIntoLevel: xp - consumed, xpForNext: xpForLevel(level) };
}

// Minimum totalXp needed to have reached a given level — the inverse of
// levelFromXp, used to check the level requirement atomically in a DB query.
function minXpForLevel(level) {
  let consumed = 0;
  for (let l = 1; l < level; l++) consumed += xpForLevel(l);
  return consumed;
}

module.exports = { xpForLevel, BUILD_STAGES, levelFromXp, minXpForLevel };