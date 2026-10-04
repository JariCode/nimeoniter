// Achievement definitions — the backend is the source of truth for rewards.

// Each achievement is earned once: when its condition is first met, the server
// grants the reward and records the id in PlayerState.unlockedAchievements so
// it can never be granted again (no farming by undo/redo). stats is:
//   { tasksDone, level, buildingsBuilt, buildingsTotal, streak }

const { BUILD_STAGES, levelFromXp } = require('./gameConfig');

const ACHIEVEMENTS = [

  // --- Total tasks completed ---

  { id: 'first_task', icon: '✅', title: 'First Step', desc: 'Complete your first task',
    reward: { xp: 15, wood: 0, stone: 0, food: 1 },
    check: (s) => s.tasksDone >= 1 },

  { id: 'tasks_10', icon: '📋', title: 'Getting Things Done', desc: 'Complete 10 tasks',
    reward: { xp: 30, wood: 1, stone: 1, food: 1 },
    check: (s) => s.tasksDone >= 10 },

  { id: 'tasks_50', icon: '🏅', title: 'Relentless', desc: 'Complete 50 tasks',
    reward: { xp: 60, wood: 2, stone: 2, food: 2 },
    check: (s) => s.tasksDone >= 50 },

  { id: 'tasks_100', icon: '🎖️', title: 'Centurion', desc: 'Complete 100 tasks',
    reward: { xp: 120, wood: 3, stone: 3, food: 3 },
    check: (s) => s.tasksDone >= 100 },

  { id: 'tasks_250', icon: '⚙️', title: 'Machine', desc: 'Complete 250 tasks',
    reward: { xp: 250, wood: 5, stone: 5, food: 5 },
    check: (s) => s.tasksDone >= 250 },

  { id: 'tasks_500', icon: '🏆', title: 'Untiring', desc: 'Complete 500 tasks',
    reward: { xp: 400, wood: 7, stone: 7, food: 7 },
    check: (s) => s.tasksDone >= 500 },

  // --- Level ---

  { id: 'level_5', icon: '⭐', title: 'Survivor', desc: 'Reach level 5',
    reward: { xp: 40, wood: 2, stone: 1, food: 1 },
    check: (s) => s.level >= 5 },

  { id: 'level_10', icon: '🌟', title: 'Veteran', desc: 'Reach level 10',
    reward: { xp: 80, wood: 3, stone: 3, food: 3 },
    check: (s) => s.level >= 10 },

  { id: 'level_15', icon: '💫', title: 'Hardened', desc: 'Reach level 15',
    reward: { xp: 120, wood: 3, stone: 4, food: 4 },
    check: (s) => s.level >= 15 },

  { id: 'level_20', icon: '👑', title: 'Legend', desc: 'Reach level 20',
    reward: { xp: 200, wood: 5, stone: 5, food: 5 },
    check: (s) => s.level >= 20 },

  { id: 'level_30', icon: '🛡️', title: 'Champion', desc: 'Reach level 30',
    reward: { xp: 300, wood: 6, stone: 6, food: 6 },
    check: (s) => s.level >= 30 },

  { id: 'level_50', icon: '⚔️', title: 'Myth', desc: 'Reach level 50',
    reward: { xp: 500, wood: 8, stone: 8, food: 8 },
    check: (s) => s.level >= 50 },

  { id: 'level_80', icon: '🚀', title: 'Ascendant', desc: 'Reach level 80',
    reward: { xp: 800, wood: 10, stone: 10, food: 10 },
    check: (s) => s.level >= 80 },

  // --- Building ---

  { id: 'first_build', icon: '🔨', title: 'Foundations', desc: 'Build your first structure',
    reward: { xp: 20, wood: 1, stone: 1, food: 1 },
    check: (s) => s.buildingsBuilt >= 1 },

  { id: 'build_4', icon: '🏘️', title: 'Settler', desc: 'Build 4 structures',
    reward: { xp: 50, wood: 2, stone: 2, food: 2 },
    check: (s) => s.buildingsBuilt >= 4 },

  { id: 'build_8', icon: '🏕️', title: 'Homestead', desc: 'Build 8 structures',
    reward: { xp: 100, wood: 3, stone: 3, food: 3 },
    check: (s) => s.buildingsBuilt >= 8 },

  { id: 'build_16', icon: '🌆', title: 'Metropolis', desc: 'Build 16 structures',
    reward: { xp: 250, wood: 5, stone: 5, food: 5 },
    check: (s) => s.buildingsBuilt >= 16 },

  { id: 'base_complete', icon: '🏰', title: 'Fortress', desc: 'Build your entire base',
    reward: { xp: 150, wood: 5, stone: 5, food: 5 },
    check: (s) => s.buildingsTotal > 0 && s.buildingsBuilt >= s.buildingsTotal },

  // --- Streak (consecutive days with a completed task) ---

  { id: 'streak_3', icon: '🔥', title: 'Consistent', desc: 'Reach a 3-day streak',
    reward: { xp: 25, wood: 1, stone: 1, food: 1 },
    check: (s) => s.streak >= 3 },

  { id: 'streak_7', icon: '🔥', title: 'Dedicated', desc: 'Reach a 7-day streak',
    reward: { xp: 50, wood: 2, stone: 2, food: 2 },
    check: (s) => s.streak >= 7 },

  { id: 'streak_14', icon: '🔥', title: 'Unbroken', desc: 'Reach a 14-day streak',
    reward: { xp: 100, wood: 3, stone: 3, food: 3 },
    check: (s) => s.streak >= 14 },

  { id: 'streak_30', icon: '🔥', title: 'Unstoppable', desc: 'Reach a 30-day streak',
    reward: { xp: 200, wood: 5, stone: 5, food: 5 },
    check: (s) => s.streak >= 30 },

  { id: 'streak_60', icon: '🔥', title: 'Relentless Spirit', desc: 'Reach a 60-day streak',
    reward: { xp: 300, wood: 6, stone: 6, food: 6 },
    check: (s) => s.streak >= 60 },

  { id: 'streak_100', icon: '🔥', title: 'Eternal Flame', desc: 'Reach a 100-day streak',
    reward: { xp: 500, wood: 8, stone: 8, food: 8 },
    check: (s) => s.streak >= 100 },

];

// Given a player state document, work out the stats an achievement checks.

function statsFromState(state) {

  const doneCount = Array.isArray(state.missions)
    ? state.missions.filter((m) => m.done).length
    : 0;

  return {
    tasksDone: doneCount,
    level: levelFromXp(state.totalXp || 0).level,
    buildingsBuilt: (state.baseStageIndex ?? -1) + 1,
    buildingsTotal: BUILD_STAGES.length,
    streak: state.streak || 0,
  };
}

// Returns the list of achievements newly earned but NOT yet unlocked, given a
// state. Does not mutate anything — the caller decides how to grant.

function newlyEarned(state) {

  const already = new Set(state.unlockedAchievements || []);
  const stats = statsFromState(state);

  return ACHIEVEMENTS.filter((a) => !already.has(a.id) && a.check(stats));
}

// Display-only view of the achievements (no check functions) — safe to send as
// JSON to the frontend so the achievement list lives in ONE place: here.

const ACHIEVEMENTS_PUBLIC = ACHIEVEMENTS.map(({ id, icon, title, desc, reward }) => ({
  id, icon, title, desc, reward,
}));

module.exports = { ACHIEVEMENTS, ACHIEVEMENTS_PUBLIC, statsFromState, newlyEarned };