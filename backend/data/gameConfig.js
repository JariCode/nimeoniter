// All game economy rules — the backend is the source of truth.

// Total XP needed to go from level N to N+1. Growing cost.
function xpForLevel(level) {
  return level * 100;
}

// Buildings in the order they get built. Each stays permanently once built.
// The starting camp is free and not in this list.
const BUILD_STAGES = [
  { key: 'well',       name: 'WELL',       requiredLevel: 2,  cost: { wood: 10, stone: 5,  food: 0 } },
  { key: 'hut',        name: 'HUT',        requiredLevel: 3,  cost: { wood: 20, stone: 10, food: 0 } },
  { key: 'house',      name: 'HOUSE',      requiredLevel: 5,  cost: { wood: 35, stone: 20, food: 0 } },
  { key: 'field',      name: 'FIELD',      requiredLevel: 7,  cost: { wood: 20, stone: 10, food: 10 } },
  { key: 'storage',    name: 'STORAGE',    requiredLevel: 9,  cost: { wood: 30, stone: 25, food: 0 } },
  { key: 'fence',      name: 'FENCE',      requiredLevel: 11, cost: { wood: 30, stone: 20, food: 0 } },
  { key: 'watchtower', name: 'WATCHTOWER', requiredLevel: 14, cost: { wood: 40, stone: 40, food: 10 } },
  { key: 'wall',       name: 'WALL',       requiredLevel: 18, cost: { wood: 90, stone: 80, food: 30 } },
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