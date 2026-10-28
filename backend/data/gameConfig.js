// All game economy rules — the backend is the source of truth.

// Total XP needed to go from level N to N+1. Growing cost.
function xpForLevel(level) {
  return level * 100;
}

// Buildings in the order they get built. Each stays permanently once built.
// The starting camp is free and not in this list.
const BUILD_STAGES = [
  { key: 'well',          name: 'WELL',           world: 'medieval', requiredLevel: 2,  cost: { wood: 10,  stone: 5,   food: 30 } },
  { key: 'hut',           name: 'HUT',            world: 'medieval', requiredLevel: 3,  cost: { wood: 20,  stone: 10,  food: 35 } },
  { key: 'house',         name: 'HOUSE',          world: 'medieval', requiredLevel: 5,  cost: { wood: 30,  stone: 15,  food: 40 } },
  { key: 'field',         name: 'FIELD',          world: 'medieval', requiredLevel: 7,  cost: { wood: 40,  stone: 20,  food: 45 } },
  { key: 'storage',       name: 'STORAGE',        world: 'medieval', requiredLevel: 9,  cost: { wood: 50,  stone: 25,  food: 50 } },
  { key: 'fence',         name: 'FENCE',          world: 'medieval', requiredLevel: 11, cost: { wood: 60,  stone: 30,  food: 55 } },
  { key: 'watchtower',    name: 'WATCHTOWER',     world: 'medieval', requiredLevel: 14, cost: { wood: 70,  stone: 35,  food: 60 } },
  { key: 'wall',          name: 'WALL',           world: 'medieval', requiredLevel: 18, cost: { wood: 80,  stone: 40,  food: 65 } },
  { key: 'street',         name: 'STREET',         world: 'city', requiredLevel: 21, cost: { wood: 90,  stone: 45,  food: 70 } },
  { key: 'apartment',      name: 'APARTMENT',      world: 'city', requiredLevel: 24, cost: { wood: 100, stone: 50,  food: 75 } },
  { key: 'diner',          name: 'DINER',          world: 'city', requiredLevel: 27, cost: { wood: 110, stone: 55,  food: 80 } },
  { key: 'shop',           name: 'SHOP',           world: 'city', requiredLevel: 30, cost: { wood: 120, stone: 60,  food: 85 } },
  { key: 'hotel',          name: 'HOTEL',          world: 'city', requiredLevel: 34, cost: { wood: 130, stone: 65,  food: 90 } },
  { key: 'casino',         name: 'CASINO',         world: 'city', requiredLevel: 38, cost: { wood: 140, stone: 70,  food: 95 } },
  { key: 'theater',        name: 'THEATER',        world: 'city', requiredLevel: 42, cost: { wood: 150, stone: 75,  food: 100 } },
  { key: 'skyscraper',     name: 'SKYSCRAPER',     world: 'city', requiredLevel: 46, cost: { wood: 160, stone: 80,  food: 105 } },
  { key: 'landing-pad',    name: 'LANDING PAD',    world: 'space', requiredLevel: 50, cost: { wood: 170, stone: 85,  food: 110 } },
  { key: 'habitat',        name: 'HABITAT',        world: 'space', requiredLevel: 54, cost: { wood: 180, stone: 90,  food: 115 } },
  { key: 'greenhouse',     name: 'GREENHOUSE',     world: 'space', requiredLevel: 58, cost: { wood: 190, stone: 95,  food: 120 } },
  { key: 'solar-array',    name: 'SOLAR ARRAY',    world: 'space', requiredLevel: 62, cost: { wood: 200, stone: 100, food: 125 } },
  { key: 'comms-tower',    name: 'COMMS TOWER',    world: 'space', requiredLevel: 66, cost: { wood: 210, stone: 105, food: 130 } },
  { key: 'lab',            name: 'LAB',            world: 'space', requiredLevel: 70, cost: { wood: 220, stone: 110, food: 135 } },
  { key: 'reactor',        name: 'REACTOR',        world: 'space', requiredLevel: 75, cost: { wood: 230, stone: 115, food: 140 } },
  { key: 'command-tower',  name: 'COMMAND TOWER',  world: 'space', requiredLevel: 80, cost: { wood: 240, stone: 120, food: 145 } },
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