// Achievement definitions. Each has a check(stats) that returns true when earned.
// stats = { tasksDone, level, buildingsBuilt, buildingsTotal }

export const ACHIEVEMENTS = [
  { id: 'first_task',   icon: '✅', title: 'First Step',      desc: 'Complete your first task',
    check: (s) => s.tasksDone >= 1 },
  { id: 'tasks_10',     icon: '📋', title: 'Getting Things Done', desc: 'Complete 10 tasks',
    check: (s) => s.tasksDone >= 10 },
  { id: 'tasks_50',     icon: '🏅', title: 'Relentless',      desc: 'Complete 50 tasks',
    check: (s) => s.tasksDone >= 50 },
  { id: 'level_5',      icon: '⭐', title: 'Survivor',        desc: 'Reach level 5',
    check: (s) => s.level >= 5 },
  { id: 'level_10',     icon: '🌟', title: 'Veteran',         desc: 'Reach level 10',
    check: (s) => s.level >= 10 },
  { id: 'first_build',  icon: '🔨', title: 'Foundations',     desc: 'Build your first structure',
    check: (s) => s.buildingsBuilt >= 1 },
  { id: 'base_complete', icon: '🏰', title: 'Fortress',       desc: 'Build your entire base',
    check: (s) => s.buildingsTotal > 0 && s.buildingsBuilt >= s.buildingsTotal },
];