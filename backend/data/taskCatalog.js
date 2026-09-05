// The task catalog — the backend is the source of truth for rewards.
// All give 10 XP; resources vary by the task's nature.
const TASK_CATALOG = [
  { key: 'walk',      icon: '🚶', name: 'Go for a walk',      xp: 10, resources: { wood: 2 } },
  { key: 'run',       icon: '🏃', name: 'Go for a run',       xp: 10, resources: { wood: 3 } },
  { key: 'bike',      icon: '🚴', name: 'Ride a bike',        xp: 10, resources: { wood: 3 } },
  { key: 'outdoors',  icon: '🌲', name: 'Spend time outside', xp: 10, resources: { wood: 2, food: 1 } },
  { key: 'garden',    icon: '🌱', name: 'Do some gardening',  xp: 10, resources: { wood: 2, food: 2 } },
  { key: 'exercise',  icon: '🏋️', name: 'Exercise',           xp: 10, resources: { stone: 2 } },
  { key: 'gym',       icon: '💪', name: 'Go to the gym',      xp: 10, resources: { stone: 3 } },
  { key: 'stretch',   icon: '🧘', name: 'Stretch or yoga',    xp: 10, resources: { stone: 1, food: 1 } },
  { key: 'chores',    icon: '🔨', name: 'Do heavy chores',    xp: 10, resources: { stone: 2, wood: 1 } },
  { key: 'shop',      icon: '🛒', name: 'Buy groceries',      xp: 10, resources: { food: 3 } },
  { key: 'cook',      icon: '🍳', name: 'Cook a meal',        xp: 10, resources: { food: 3 } },
  { key: 'water',     icon: '💧', name: 'Drink water',        xp: 10, resources: { food: 1 } },
  { key: 'healthy',   icon: '🥗', name: 'Eat something healthy', xp: 10, resources: { food: 2 } },
  { key: 'sleep',     icon: '😴', name: 'Go to bed on time',  xp: 10, resources: { food: 2 } },
  { key: 'clean',     icon: '🧹', name: 'Clean',              xp: 10, resources: { stone: 1, food: 1 } },
  { key: 'laundry',   icon: '🧺', name: 'Do laundry',         xp: 10, resources: { wood: 1, stone: 1 } },
  { key: 'dishes',    icon: '🍽️', name: 'Wash the dishes',    xp: 10, resources: { food: 1, stone: 1 } },
  { key: 'tidy',      icon: '🛏️', name: 'Tidy your room',     xp: 10, resources: { wood: 1, food: 1 } },
  { key: 'study',     icon: '📚', name: 'Study',              xp: 10, resources: { wood: 1, stone: 1 } },
  { key: 'read',      icon: '📖', name: 'Read',               xp: 10, resources: { wood: 1 } },
  { key: 'work',      icon: '💻', name: 'Focused work',       xp: 10, resources: { wood: 2, stone: 1 } },
  { key: 'journal',   icon: '📝', name: 'Write / journal',    xp: 10, resources: { wood: 1, food: 1 } },
  { key: 'meditate',  icon: '🧠', name: 'Meditate',           xp: 10, resources: { food: 1, stone: 1 } },
  { key: 'call',      icon: '📞', name: 'Call someone',       xp: 10, resources: { food: 2 } },
];

// Quick lookup by key, for validating rewards on the server
const TASK_BY_KEY = Object.fromEntries(TASK_CATALOG.map((t) => [t.key, t]));

module.exports = { TASK_CATALOG, TASK_BY_KEY };