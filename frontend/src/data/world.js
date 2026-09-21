// Which world the built stages put the player in — derived from the world
// of the highest-built stage. Before any city stage is built this is
// 'medieval' (the starting world); it becomes 'city' the moment the first
// city stage (street) is built. Stages carry their own `world` field from
// the backend's BUILD_STAGES, so this only ever reads that.
export function currentWorldFromBuilt(buildStages, stageKey) {
  if (stageKey === 'camp') return 'medieval';
  const i = buildStages.findIndex((s) => s.key === stageKey);
  if (i === -1) return 'medieval';
  return buildStages[i]?.world || 'medieval';
}
