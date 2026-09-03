// All game economy tuning in one place.

// Total XP needed to go from level N to N+1. Growing cost.
export function xpForLevel(level) {
  return level * 100;
}

// Buildings in the order they get built. Each stays permanently once built.
// The starting camp (tent + fire + survivor) is free and not in this list.
export const BUILD_STAGES = [
  { key: 'well',       name: 'WELL',       requiredLevel: 2,  cost: { wood: 10, stone: 5,  food: 0 } },
  { key: 'hut',        name: 'HUT',        requiredLevel: 3,  cost: { wood: 20, stone: 10, food: 0 } },
  { key: 'house',      name: 'HOUSE',      requiredLevel: 5,  cost: { wood: 35, stone: 20, food: 0 } },
  { key: 'field',      name: 'FIELD',      requiredLevel: 7,  cost: { wood: 20, stone: 10, food: 10 } },
  { key: 'storage',    name: 'STORAGE',    requiredLevel: 9,  cost: { wood: 30, stone: 25, food: 0 } },
  { key: 'kitchen',    name: 'KITCHEN',    requiredLevel: 10, cost: { wood: 25, stone: 15, food: 10 } },
  { key: 'fence',      name: 'FENCE',      requiredLevel: 11, cost: { wood: 30, stone: 20, food: 0 } },
  { key: 'watchtower', name: 'WATCHTOWER', requiredLevel: 14, cost: { wood: 40, stone: 40, food: 10 } },
  { key: 'wall',       name: 'WALL',       requiredLevel: 18, cost: { wood: 90, stone: 80, food: 30 } },
];