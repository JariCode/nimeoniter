// The task catalog — the backend is the source of truth for rewards.
// Tasks give XP based on effort; most give 10 XP, harder tasks give more.
//   movement / outdoors        -> wood
//   strength / hard effort     -> stone
//   food / self-care / social  -> food
//   home / mixed chores        -> a mix
const TASK_CATALOG = [
  // --- Movement & outdoors (wood) ---
  { key: 'walk',      icon: '🚶', name: 'Go for a walk',        xp: 10, resources: { wood: 2 } },
  { key: 'run',       icon: '🏃', name: 'Go for a run',         xp: 20, resources: { wood: 3 } },
  { key: 'bike',      icon: '🚴', name: 'Ride a bike',          xp: 20, resources: { wood: 3 } },
  { key: 'hike',      icon: '🥾', name: 'Go for a hike',        xp: 20, resources: { wood: 4 } },
  { key: 'outdoors',  icon: '🌲', name: 'Spend time outside',   xp: 10, resources: { wood: 2, food: 1, stone: 1 } },
  { key: 'garden',    icon: '🌱', name: 'Do some gardening',    xp: 10, resources: { wood: 2, food: 1, stone: 1 } },
  { key: 'swim',      icon: '🏊', name: 'Go swimming',          xp: 20, resources: { wood: 3 } },
  { key: 'dogwalk',   icon: '🐕', name: 'Walk the dog',         xp: 10, resources: { wood: 2 } },
  { key: 'stairs',    icon: '🧗', name: 'Take the stairs',      xp: 10, resources: { wood: 1, stone: 1 } },
  { key: 'dance',     icon: '💃', name: 'Dance',                xp: 10, resources: { wood: 2 } },

  // --- Strength & hard effort (stone) ---
  { key: 'exercise',  icon: '🏋️', name: 'Exercise',             xp: 20, resources: { stone: 2 } },
  { key: 'gym',       icon: '💪', name: 'Go to the gym',        xp: 20, resources: { stone: 3 } },
  { key: 'stretch',   icon: '🧘', name: 'Stretch or yoga',      xp: 10, resources: { stone: 1, food: 1 } },
  { key: 'chores',    icon: '🔨', name: 'Do heavy chores',      xp: 20, resources: { stone: 2, wood: 1 } },
  { key: 'pushups',   icon: '🤸', name: 'Do a workout set',     xp: 20, resources: { stone: 2 } },
  { key: 'carry',     icon: '📦', name: 'Move something heavy', xp: 20, resources: { stone: 2 } },
  { key: 'shovel',    icon: '⛏️', name: 'Yard work',            xp: 25, resources: { stone: 2, wood: 1 } },
  { key: 'firewood',  icon: '🪵', name: 'Gather firewood',      xp: 25, resources: { stone: 1, wood: 2 } },
  { key: 'building',  icon: '🏗️', name: 'Building',             xp: 25, resources: { wood: 2, stone: 2 } },

  // --- Food & self-care (food) ---
  { key: 'shop',      icon: '🛒', name: 'Buy groceries',        xp: 10, resources: { food: 1 } },
  { key: 'cook',      icon: '🍳', name: 'Cook a meal',          xp: 10, resources: { food: 1 } },
  { key: 'water',     icon: '💧', name: 'Drink water',          xp: 10, resources: { food: 1 } },
  { key: 'healthy',   icon: '🥗', name: 'Eat something healthy', xp: 10, resources: { food: 2 } },
  { key: 'breakfast', icon: '🥣', name: 'Eat breakfast',        xp: 10, resources: { food: 2 } },
  { key: 'sleep',     icon: '😴', name: 'Go to bed on time',    xp: 10, resources: { food: 2 } },
  { key: 'shower',    icon: '🚿', name: 'Take a shower',          xp: 10, resources: { food: 1 } },
  { key: 'sauna',     icon: '🧖', name: 'Take a sauna',           xp: 10, resources: { food: 1 } },
  { key: 'brush',     icon: '🪥', name: 'Brush your teeth',     xp: 10, resources: { food: 1 } },
  { key: 'vitamins',  icon: '💊', name: 'Take vitamins',        xp: 10, resources: { food: 1 } },
  { key: 'bath',      icon: '🛁', name: 'Take a relaxing bath', xp: 10, resources: { food: 1 } },
  { key: 'skincare',  icon: '🧴', name: 'Skincare routine',     xp: 10, resources: { food: 1 } },
  { key: 'meal_prep', icon: '🍱', name: 'Meal prep',            xp: 10, resources: { food: 2 } },
  { key: 'grilling',  icon: '🔥', name: 'Grilling',             xp: 10, resources: { food: 2 } },

  // --- Home & tidying (mixed) ---
  { key: 'clean',     icon: '🧹', name: 'Clean',                xp: 10, resources: { stone: 1, food: 1 } },
  { key: 'window',     icon: '🪟', name: 'Clean the windows',    xp: 10, resources: { stone: 1, wood: 1 } },
  { key: 'laundry',   icon: '🧺', name: 'Do laundry',           xp: 10, resources: { wood: 1, stone: 1 } },
  { key: 'dishes',    icon: '🍽️', name: 'Wash the dishes',      xp: 10, resources: { food: 1, stone: 1 } },
  { key: 'tidy',      icon: '🛏️', name: 'Tidy your room',       xp: 10, resources: { wood: 1, food: 1 } },
  { key: 'trash',     icon: '🗑️', name: 'Take out the trash',   xp: 10, resources: { stone: 1 } },
  { key: 'vacuum',    icon: '🧽', name: 'Vacuum',               xp: 10, resources: { stone: 1, wood: 1 } },
  { key: 'plants',    icon: '🪴', name: 'Water the plants',     xp: 10, resources: { wood: 1, food: 1 } },
  { key: 'organize',  icon: '🗂️', name: 'Organize a space',     xp: 10, resources: { wood: 1, stone: 1 } },
  { key: 'repair',    icon: '🔧', name: 'Fix something',        xp: 20, resources: { stone: 2 } },
  { key: 'makebed',   icon: '🛏️', name: 'Make the bed',         xp: 10, resources: { food: 1 } },
  { key: 'sweep',     icon: '🧹', name: 'Sweep / mop',          xp: 20, resources: { stone: 1, wood: 1 } },
  { key: 'painting',  icon: '🎨', name: 'Painting',             xp: 20, resources: { wood: 2, stone: 1 } },

  // --- Mind & growth (wood + food) ---
  { key: 'study',     icon: '📚', name: 'Study',                xp: 20, resources: { wood: 1, stone: 1 } },
  { key: 'exam',      icon: '📝', name: 'Take a test / exam',   xp: 25, resources: { wood: 2, stone: 1 } },
  { key: 'read',      icon: '📖', name: 'Read',                 xp: 10, resources: { wood: 1 } },
  { key: 'work',      icon: '💻', name: 'Focused work',         xp: 20, resources: { wood: 2, stone: 1 } },
  { key: 'journal',   icon: '📝', name: 'Write / journal',      xp: 10, resources: { wood: 1, food: 1 } },
  { key: 'meditate',  icon: '🧠', name: 'Meditate',             xp: 10, resources: { food: 1, stone: 1 } },
  { key: 'language',  icon: '🗣️', name: 'Practice a language',  xp: 10, resources: { wood: 1, stone: 1 } },
  { key: 'instrument',icon: '🎸', name: 'Practice an instrument', xp: 10, resources: { wood: 1, food: 1 } },
  { key: 'course',    icon: '🎓', name: 'Take a course lesson', xp: 20, resources: { wood: 2 } },
  { key: 'draw',      icon: '🎨', name: 'Draw or paint',        xp: 10, resources: { wood: 1, food: 1 } },
  { key: 'plan',      icon: '🗒️', name: 'Plan your day',        xp: 10, resources: { wood: 1 } },
  { key: 'code',      icon: '⌨️', name: 'Work on a project',    xp: 20, resources: { wood: 2, stone: 1 } },

  // --- Social & connection (food) ---
  { key: 'call',      icon: '📞', name: 'Call someone',         xp: 10, resources: { food: 1 } },
  { key: 'friend',    icon: '🤝', name: 'Meet a friend',        xp: 10, resources: { food: 1 } },
  { key: 'family',    icon: '👨‍👩‍👧', name: 'Time with family',      xp: 10, resources: { food: 1 } },
  { key: 'message',   icon: '💬', name: 'Reach out to someone', xp: 10, resources: { food: 1 } },
  { key: 'gratitude', icon: '🙏', name: 'Thank someone',        xp: 10, resources: { food: 1 } },
  { key: 'help',      icon: '❤️', name: 'Help someone',         xp: 20, resources: { food: 1, wood: 1, stone: 1 } },

  // --- Wellbeing & balance (mixed) ---
  { key: 'digital_detox', icon: '📵', name: 'Take a screen break', xp: 10, resources: { food: 1, wood: 1 } },
  { key: 'fresh_air', icon: '🌬️', name: 'Get some fresh air',   xp: 10, resources: { wood: 1 } },
  { key: 'sunlight',  icon: '☀️', name: 'Get some sunlight',    xp: 10, resources: { wood: 1, food: 1 } },
  { key: 'breathe',   icon: '🌀', name: 'Breathing exercise',   xp: 10, resources: { food: 1 } },
  { key: 'declutter', icon: '♻️', name: 'Declutter something',  xp: 10, resources: { stone: 1, wood: 1 } },
  { key: 'budget',    icon: '💰', name: 'Check your budget',    xp: 10, resources: { stone: 1 } },
  { key: 'errand',    icon: '🏃‍♂️', name: 'Run an errand',        xp: 10, resources: { wood: 1, food: 1 } },

  // --- Sports: ball games & racket sports (stone) ---
  { key: 'ballgame',  icon: '⚽', name: 'Play a ball game',    xp: 20, resources: { stone: 3 } },
  { key: 'racket',    icon: '🎾', name: 'Play a racket sport', xp: 20, resources: { stone: 2, wood: 1 } },
  { key: 'golf',      icon: '⛳', name: 'Play golf',           xp: 20, resources: { wood: 2, stone: 1 } },
  { key: 'bowling',   icon: '🎳', name: 'Go bowling',          xp: 20, resources: { stone: 1, food: 1 } },

  // --- Sports: martial arts & combat (stone) ---
  { key: 'martial',   icon: '🥋', name: 'Martial arts training', xp: 25, resources: { stone: 3 } },
  { key: 'boxing',    icon: '🥊', name: 'Boxing training',      xp: 25, resources: { stone: 3 } },

  // --- Sports: outdoor & endurance (wood) ---
  { key: 'wintersport', icon: '⛷️', name: 'Winter sports',      xp: 25, resources: { wood: 3, stone: 1 } },
  { key: 'skating',   icon: '⛸️', name: 'Go skating',          xp: 20, resources: { wood: 2 } },
  { key: 'climb',     icon: '🧗', name: 'Go climbing',         xp: 20, resources: { stone: 3 } },
  { key: 'watersport',icon: '🚣', name: 'Water sports',        xp: 20, resources: { wood: 3 } },
  { key: 'riding',    icon: '🐎', name: 'Go horse riding',     xp: 20, resources: { wood: 2, food: 1 } },
  { key: 'discgolf',  icon: '🥏', name: 'Play disc golf',      xp: 20, resources: { wood: 2 } },
  { key: 'team_sport',icon: '🏅', name: 'Team practice',       xp: 20, resources: { stone: 2, wood: 1 } },

  // --- Grooming & appearance (food / self-care) ---
  { key: 'shave',     icon: '🪒', name: 'Shave',               xp: 10, resources: { food: 1, stone: 1 } },
  { key: 'haircut',   icon: '💇', name: 'Get a haircut',       xp: 10, resources: { food: 1, stone: 1 } },
  { key: 'nails',     icon: '💅', name: 'Trim your nails',     xp: 10, resources: { food: 1, stone: 1 } },
  { key: 'groom',     icon: '🧑‍🦱', name: 'Style your hair',     xp: 10, resources: { food: 1, stone: 1 } },

  // --- Errands & getting around (wood / mixed) ---
  { key: 'drive',     icon: '🚗', name: 'Drive somewhere',     xp: 10, resources: { wood: 2 } },
  { key: 'fuel',      icon: '⛽', name: 'Fill up / charge the car', xp: 10, resources: { wood: 1, stone: 1 } },
  { key: 'carwash',   icon: '🧼', name: 'Wash the car',        xp: 10, resources: { stone: 1, wood: 1 } },
  { key: 'transit',   icon: '🚌', name: 'Take public transport', xp: 10, resources: { wood: 1, stone: 1 } },
  { key: 'pharmacy',  icon: '💊', name: 'Go to the pharmacy',  xp: 10, resources: { food: 1, wood: 1 } },
  { key: 'post',      icon: '📮', name: 'Post office / parcels', xp: 10, resources: { wood: 1, stone: 1 } },
  { key: 'bank',      icon: '🏦', name: 'Sort out bank stuff', xp: 10, resources: { stone: 1 } },
  { key: 'bills',     icon: '🧾', name: 'Pay the bills',       xp: 10, resources: { stone: 1 } },
  { key: 'carservice', icon: '🛠️', name: 'Car service / maintenance', xp: 20, resources: { stone: 2, wood: 1 } },
  { key: 'bikeservice', icon: '🚲', name: 'Bike service / maintenance', xp: 20, resources: { stone: 1, wood: 1 } },
  { key: 'changetires', icon: '🚙', name: 'Change car tires',    xp: 20, resources: { stone: 2, wood: 1 } },
  { key: 'carwash',   icon: '🧼', name: 'Car wash',            xp: 10, resources: { stone: 1, wood: 1 } },

  // --- Health & appointments (mixed) ---
  { key: 'dentist',   icon: '🦷', name: 'Dentist appointment', xp: 10, resources: { food: 1, stone: 1 } },
  { key: 'doctor',    icon: '🩺', name: "Doctor's appointment", xp: 10, resources: { food: 1, stone: 1 } },
  { key: 'restday',   icon: '🛋️', name: 'Take a rest day',     xp: 10, resources: { food: 1 } },
  { key: 'massage',   icon: '💆', name: 'Get a massage',        xp: 10, resources: { food: 1, stone: 1 } },
  { key: 'physio',    icon: '🧑‍⚕️', name: 'Physiotherapy',        xp: 10, resources: { food: 1, stone: 1 } },
  { key: 'vet',       icon: '🐕‍🦺', name: 'Vet appointment',       xp: 10, resources: { food: 1, wood: 1 } },

  // --- Pets (mixed) ---
  { key: 'feedpet',   icon: '🐈', name: 'Feed the pet',        xp: 10, resources: { food: 1, } },
  { key: 'petcare',   icon: '🐾', name: 'Clean up after a pet', xp: 10, resources: { stone: 1, food: 1 } },
  { key: 'petnails',  icon: '🐾', name: 'Trim pet nails',       xp: 10, resources: { food: 1, stone: 1 } },
  { key: 'petwash',   icon: '🛁', name: 'Wash the pet',         xp: 10, resources: { food: 2, stone: 1 } },

  // --- Leisure & hobbies (mixed) ---
  { key: 'videogames',icon: '🎮', name: 'Play video games',    xp: 10, resources: { food: 1, wood: 1 } },
  { key: 'boardgame', icon: '🎲', name: 'Play a board game',   xp: 10, resources: { food: 2 } },
  { key: 'movie',     icon: '🎬', name: 'Watch a movie',       xp: 10, resources: { food: 1 } },
  { key: 'music',     icon: '🎧', name: 'Listen to music',     xp: 10, resources: { food: 1 } },
  { key: 'photo',     icon: '📷', name: 'Take photos',         xp: 10, resources: { wood: 1, food: 1 } },
  { key: 'bake',      icon: '🧁', name: 'Bake something',      xp: 10, resources: { food: 3 } },
  { key: 'craft',     icon: '🧶', name: 'Do a craft',          xp: 10, resources: { wood: 1, food: 1 } },
  { key: 'fish',      icon: '🎣', name: 'Go fishing',          xp: 10, resources: { wood: 2, food: 1 } },

  // --- Relationships (food) ---
  { key: 'date',      icon: '❤️', name: 'Go on a date',        xp: 20, resources: { food: 3 } },
  { key: 'kids',      icon: '🧸', name: 'Time with the kids',  xp: 20, resources: { food: 3 } },
  { key: 'parents',   icon: '👵', name: 'Visit family / parents', xp: 20, resources: { food: 3 } },
  { key: 'neighbour', icon: '🏘️', name: 'Help a neighbour',    xp: 20, resources: { food: 2 } },

  // --- Work & productivity (wood / stone) ---
  { key: 'email',     icon: '📧', name: 'Clear your inbox',    xp: 10, resources: { wood: 1, stone: 1 } },
  { key: 'meeting',   icon: '👥', name: 'Attend a meeting',    xp: 10, resources: { wood: 1 } },
  { key: 'apply',     icon: '📄', name: 'Work on an application', xp: 20, resources: { wood: 2 } },
  { key: 'jobhunting', icon: '💼', name: 'Job hunting', xp: 20, resources: { wood: 2, stone: 1 } },

  // ---Travel & holidays (wood / food) ---
{ key: 'vacation',  icon: '🏖️', name: 'Vacation',    xp: 10, resources: { food: 2, wood: 1 } },
{ key: 'trip',      icon: '🧳', name: 'Trip',        xp: 10, resources: { wood: 2, food: 1 } },
{ key: 'train',     icon: '🚆', name: 'Travel by train', xp: 10, resources: { wood: 2 } },
{ key: 'ship',      icon: '🚢', name: 'Travel by ship',  xp: 10, resources: { wood: 2, food: 1 } },
{ key: 'plane',     icon: '✈️', name: 'Travel by plane',  xp: 10, resources: { wood: 2, food: 1 } },
];

// Quick lookup by key, for validating rewards on the server
const TASK_BY_KEY = Object.fromEntries(TASK_CATALOG.map((t) => [t.key, t]));

module.exports = { TASK_CATALOG, TASK_BY_KEY };