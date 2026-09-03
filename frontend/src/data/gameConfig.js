export function xpForLevel(level) {
  return level * 100;
}

export const BUILD_STAGES = [
  { key: 'shelter',   name: 'SHELTER',   requiredLevel: 3,  cost: { wood: 20, stone: 10, food: 0 } },
  { key: 'homestead', name: 'HOMESTEAD', requiredLevel: 6,  cost: { wood: 40, stone: 30, food: 15 } },
  { key: 'fortress',  name: 'FORTRESS',  requiredLevel: 10, cost: { wood: 80, stone: 60, food: 30 } },
];