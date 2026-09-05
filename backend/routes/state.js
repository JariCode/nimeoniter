const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const PlayerState = require('../models/PlayerState');
const { BUILD_STAGES, levelFromXp, minXpForLevel } = require('../data/gameConfig');
const { TASK_BY_KEY } = require('../data/taskCatalog');

const router = express.Router();

// All state routes require a logged-in user
router.use(requireAuth);

async function getOrCreateState(userId) {
  let state = await PlayerState.findOne({ clerkUserId: userId });
  if (!state) {
    try {
      state = await PlayerState.create({ clerkUserId: userId });
    } catch (err) {
      // Two simultaneous first-loads can both race past the findOne above;
      // the unique index rejects the second create, so just re-read.
      if (err.code === 11000) {
        state = await PlayerState.findOne({ clerkUserId: userId });
      } else {
        throw err;
      }
    }
  }
  return state;
}

// GET /api/state — fetch the current user's game state
router.get('/', async (req, res, next) => {
  try {
    const state = await getOrCreateState(req.userId);
    res.json(state);
  } catch (err) {
    next(err);
  }
});

// A real calendar date, formatted YYYY-MM-DD. Tasks can be added for any
// day — past (catching up) or future (planning ahead), since DayNav lets
// the player browse freely. This only rejects fabricated non-date strings.
function isValidTaskDate(date) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}

// A task can only be completed once its day has actually arrived — this is
// what actually stops farming: a player can add tasks for any number of
// future days, but can't collect the rewards for them ahead of time.
// The 1-day grace absorbs the gap between the server's UTC clock and the
// player's local calendar day.
function isDateReached(date) {
  const parsed = new Date(`${date}T00:00:00Z`);
  const oneDayMs = 24 * 60 * 60 * 1000;
  return parsed.getTime() <= Date.now() + oneDayMs;
}

// POST /api/state/tasks — add a task to a day.
// Client sends only { key, date }; the server takes rewards from the catalog.
router.post('/tasks', async (req, res, next) => {
  try {
    const { key, date } = req.body;

    const catalogTask = TASK_BY_KEY[key];
    if (!catalogTask) {
      return res.status(400).json({ error: 'Unknown task' });
    }
    if (!isValidTaskDate(date)) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    // Ensure the state document exists, then atomically add the task only if
    // it isn't already present for that day — closes the race where two
    // simultaneous requests both see "not added yet" and both insert it.
    await getOrCreateState(req.userId);

    const updated = await PlayerState.findOneAndUpdate(
      {
        clerkUserId: req.userId,
        missions: { $not: { $elemMatch: { key: catalogTask.key, date } } },
      },
      {
        $push: {
          missions: {
            id: Date.now(),
            date,
            key: catalogTask.key,
            name: catalogTask.name,
            icon: catalogTask.icon,
            xp: catalogTask.xp,
            resources: catalogTask.resources,
            done: false,
          },
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(400).json({ error: 'Task already added for that day' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// POST /api/state/tasks/:id/complete — complete a task; server grants rewards
router.post('/tasks/:id/complete', async (req, res, next) => {
  try {
    const taskId = Number(req.params.id);
    const state = await getOrCreateState(req.userId);

    const mission = state.missions.find((m) => m.id === taskId);
    if (!mission) {
      return res.status(404).json({ error: 'Task not found' });
    }
    if (mission.done) {
      return res.status(400).json({ error: 'Task already completed' });
    }
    if (!isDateReached(mission.date)) {
      return res.status(400).json({ error: "Can't complete a task before its day arrives" });
    }

    // Atomic: only flip done + grant rewards if it's still not done at the
    // moment of the write. If a concurrent request already completed it,
    // this matches nothing and rewards are granted exactly once.
    const updated = await PlayerState.findOneAndUpdate(
      {
        clerkUserId: req.userId,
        missions: { $elemMatch: { id: taskId, done: false } },
      },
      {
        $set: { 'missions.$.done': true },
        $inc: {
          totalXp: mission.xp || 0,
          'resources.wood': mission.resources?.wood || 0,
          'resources.stone': mission.resources?.stone || 0,
          'resources.food': mission.resources?.food || 0,
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(400).json({ error: 'Task already completed' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/state/tasks/:id — remove a task (only if not completed)
router.delete('/tasks/:id', async (req, res, next) => {
  try {
    const taskId = Number(req.params.id);
    const state = await getOrCreateState(req.userId);

    const mission = state.missions.find((m) => m.id === taskId);
    if (!mission) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updated = await PlayerState.findOneAndUpdate(
      {
        clerkUserId: req.userId,
        missions: { $not: { $elemMatch: { id: taskId, done: true } } },
      },
      { $pull: { missions: { id: taskId } } },
      { new: true }
    );

    if (!updated) {
      return res.status(400).json({ error: 'Cannot remove a completed task' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// POST /api/state/build — build the next stage; server checks level & resources
router.post('/build', async (req, res, next) => {
  try {
    const state = await getOrCreateState(req.userId);

    const nextStage = BUILD_STAGES[state.baseStageIndex + 1];
    if (!nextStage) {
      return res.status(400).json({ error: 'Base fully built' });
    }

    const { level } = levelFromXp(state.totalXp);
    if (level < nextStage.requiredLevel) {
      return res.status(400).json({ error: 'Level too low' });
    }
    if (
      state.resources.wood < nextStage.cost.wood ||
      state.resources.stone < nextStage.cost.stone ||
      state.resources.food < nextStage.cost.food
    ) {
      return res.status(400).json({ error: 'Not enough resources' });
    }

    // Atomic: the filter re-checks stage/level/resources at write time, so a
    // second request racing this one (e.g. two parallel /build calls) can't
    // both pass — only one matches and pays the cost.
    const updated = await PlayerState.findOneAndUpdate(
      {
        clerkUserId: req.userId,
        baseStageIndex: state.baseStageIndex,
        totalXp: { $gte: minXpForLevel(nextStage.requiredLevel) },
        'resources.wood': { $gte: nextStage.cost.wood },
        'resources.stone': { $gte: nextStage.cost.stone },
        'resources.food': { $gte: nextStage.cost.food },
      },
      {
        $inc: {
          'resources.wood': -nextStage.cost.wood,
          'resources.stone': -nextStage.cost.stone,
          'resources.food': -nextStage.cost.food,
          baseStageIndex: 1,
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(400).json({ error: 'Build conditions no longer met' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

module.exports = router;