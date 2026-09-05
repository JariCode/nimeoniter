// The task catalog — the backend is the source of truth for rewards.
// All give 10 XP; resources vary by the task's nature:
//   movement / outdoors        -> wood
//   strength / hard effort     -> stone
//   food / self-care / social  -> food
//   home / mixed chores        -> a mix
const TASK_CATALOG = [
  // --- Movement & outdoors (wood) ---
  { key: 'walk',      icon: '🚶', name: 'Go for a walk',        xp: 10, resources: { wood: 2 } },
  { key: 'run',       icon: '🏃', name: 'Go for a run',         xp: 10, resources: { wood: 3 } },
  { key: 'bike',      icon: '🚴', name: 'Ride a bike',          xp: 10, resources: { wood: 3 } },
  { key: 'hike',      icon: '🥾', name: 'Go for a hike',        xp: 10, resources: { wood: 4 } },
  { key: 'outdoors',  icon: '🌲', name: 'Spend time outside',   xp: 10, resources: { wood: 2, food: 1 } },
  { key: 'garden',    icon: '🌱', name: 'Do some gardening',    xp: 10, resources: { wood: 2, food: 2 } },
  { key: 'swim',      icon: '🏊', name: 'Go swimming',          xp: 10, resources: { wood: 3 } },
  { key: 'dogwalk',   icon: '🐕', name: 'Walk the dog',         xp: 10, resources: { wood: 2 } },
  { key: 'stairs',    icon: '🧗', name: 'Take the stairs',      xp: 10, resources: { wood: 1, stone: 1 } },
  { key: 'dance',     icon: '💃', name: 'Dance',                xp: 10, resources: { wood: 2 } },

  // --- Strength & hard effort (stone) ---
  { key: 'exercise',  icon: '🏋️', name: 'Exercise',             xp: 10, resources: { stone: 2 } },
  { key: 'gym',       icon: '💪', name: 'Go to the gym',        xp: 10, resources: { stone: 3 } },
  { key: 'stretch',   icon: '🧘', name: 'Stretch or yoga',      xp: 10, resources: { stone: 1, food: 1 } },
  { key: 'chores',    icon: '🔨', name: 'Do heavy chores',      xp: 10, resources: { stone: 2, wood: 1 } },
  { key: 'pushups',   icon: '🤸', name: 'Do a workout set',     xp: 10, resources: { stone: 2 } },
  { key: 'carry',     icon: '📦', name: 'Move something heavy', xp: 10, resources: { stone: 2 } },
  { key: 'shovel',    icon: '⛏️', name: 'Yard work',            xp: 10, resources: { stone: 2, wood: 1 } },

  // --- Food & self-care (food) ---
  { key: 'shop',      icon: '🛒', name: 'Buy groceries',        xp: 10, resources: { food: 3 } },
  { key: 'cook',      icon: '🍳', name: 'Cook a meal',          xp: 10, resources: { food: 3 } },
  { key: 'water',     icon: '💧', name: 'Drink water',          xp: 10, resources: { food: 1 } },
  { key: 'healthy',   icon: '🥗', name: 'Eat something healthy', xp: 10, resources: { food: 2 } },
  { key: 'breakfast', icon: '🥣', name: 'Eat breakfast',        xp: 10, resources: { food: 2 } },
  { key: 'sleep',     icon: '😴', name: 'Go to bed on time',    xp: 10, resources: { food: 2 } },
  { key: 'shower',    icon: '🚿', name: 'Shower',               xp: 10, resources: { food: 1 } },
  { key: 'brush',     icon: '🪥', name: 'Brush your teeth',     xp: 10, resources: { food: 1 } },
  { key: 'vitamins',  icon: '💊', name: 'Take vitamins',        xp: 10, resources: { food: 1 } },
  { key: 'bath',      icon: '🛁', name: 'Take a relaxing bath', xp: 10, resources: { food: 2 } },
  { key: 'skincare',  icon: '🧴', name: 'Skincare routine',     xp: 10, resources: { food: 1 } },
  { key: 'meal_prep', icon: '🍱', name: 'Meal prep',            xp: 10, resources: { food: 3 } },

  // --- Home & tidying (mixed) ---
  { key: 'clean',     icon: '🧹', name: 'Clean',                xp: 10, resources: { stone: 1, food: 1 } },
  { key: 'laundry',   icon: '🧺', name: 'Do laundry',           xp: 10, resources: { wood: 1, stone: 1 } },
  { key: 'dishes',    icon: '🍽️', name: 'Wash the dishes',      xp: 10, resources: { food: 1, stone: 1 } },
  { key: 'tidy',      icon: '🛏️', name: 'Tidy your room',       xp: 10, resources: { wood: 1, food: 1 } },
  { key: 'trash',     icon: '🗑️', name: 'Take out the trash',   xp: 10, resources: { stone: 1 } },
  { key: 'vacuum',    icon: '🧽', name: 'Vacuum',               xp: 10, resources: { stone: 1, wood: 1 } },
  { key: 'plants',    icon: '🪴', name: 'Water the plants',     xp: 10, resources: { wood: 1, food: 1 } },
  { key: 'organize',  icon: '🗂️', name: 'Organize a space',     xp: 10, resources: { wood: 1, stone: 1 } },
  { key: 'repair',    icon: '🔧', name: 'Fix something',        xp: 10, resources: { stone: 2 } },
  { key: 'makebed',   icon: '🛏️', name: 'Make the bed',         xp: 10, resources: { food: 1 } },

  // --- Mind & growth (wood + food) ---
  { key: 'study',     icon: '📚', name: 'Study',                xp: 10, resources: { wood: 1, stone: 1 } },
  { key: 'read',      icon: '📖', name: 'Read',                 xp: 10, resources: { wood: 1 } },
  { key: 'work',      icon: '💻', name: 'Focused work',         xp: 10, resources: { wood: 2, stone: 1 } },
  { key: 'journal',   icon: '📝', name: 'Write / journal',      xp: 10, resources: { wood: 1, food: 1 } },
  { key: 'meditate',  icon: '🧠', name: 'Meditate',             xp: 10, resources: { food: 1, stone: 1 } },
  { key: 'language',  icon: '🗣️', name: 'Practice a language',  xp: 10, resources: { wood: 1, stone: 1 } },
  { key: 'instrument',icon: '🎸', name: 'Practice an instrument', xp: 10, resources: { wood: 1, food: 1 } },
  { key: 'course',    icon: '🎓', name: 'Take a course lesson', xp: 10, resources: { wood: 2 } },
  { key: 'draw',      icon: '🎨', name: 'Draw or paint',        xp: 10, resources: { wood: 1, food: 1 } },
  { key: 'plan',      icon: '🗒️', name: 'Plan your day',        xp: 10, resources: { wood: 1 } },
  { key: 'code',      icon: '⌨️', name: 'Work on a project',    xp: 10, resources: { wood: 2, stone: 1 } },

  // --- Social & connection (food) ---
  { key: 'call',      icon: '📞', name: 'Call someone',         xp: 10, resources: { food: 2 } },
  { key: 'friend',    icon: '🤝', name: 'Meet a friend',        xp: 10, resources: { food: 3 } },
  { key: 'family',    icon: '👨‍👩‍👧', name: 'Time with family',      xp: 10, resources: { food: 3 } },
  { key: 'message',   icon: '💬', name: 'Reach out to someone', xp: 10, resources: { food: 1 } },
  { key: 'gratitude', icon: '🙏', name: 'Thank someone',        xp: 10, resources: { food: 1 } },
  { key: 'help',      icon: '❤️', name: 'Help someone',         xp: 10, resources: { food: 2 } },

  // --- Wellbeing & balance (mixed) ---
  { key: 'digital_detox', icon: '📵', name: 'Take a screen break', xp: 10, resources: { food: 1, wood: 1 } },
  { key: 'fresh_air', icon: '🌬️', name: 'Get some fresh air',   xp: 10, resources: { wood: 1 } },
  { key: 'sunlight',  icon: '☀️', name: 'Get some sunlight',    xp: 10, resources: { wood: 1, food: 1 } },
  { key: 'breathe',   icon: '🌀', name: 'Breathing exercise',   xp: 10, resources: { food: 1 } },
  { key: 'declutter', icon: '♻️', name: 'Declutter something',  xp: 10, resources: { stone: 1, wood: 1 } },
  { key: 'budget',    icon: '💰', name: 'Check your budget',    xp: 10, resources: { stone: 1 } },
  { key: 'errand',    icon: '🏃‍♂️', name: 'Run an errand',        xp: 10, resources: { wood: 1, food: 1 } },
];

// Quick lookup by key, for validating rewards on the server
const TASK_BY_KEY = Object.fromEntries(TASK_CATALOG.map((t) => [t.key, t]));

module.exports = { TASK_CATALOG, TASK_BY_KEY };
