const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const PlayerState = require('../models/PlayerState');
const { BUILD_STAGES, levelFromXp, minXpForLevel } = require('../data/gameConfig');
const { TASK_BY_KEY } = require('../data/taskCatalog');


// Compare two YYYY-MM-DD date keys: returns the difference in days (a - b).
// Uses UTC noon to avoid DST edge cases; the keys are plain calendar dates.
function daysBetween(a, b) {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  const da = Date.UTC(ay, am - 1, ad);
  const db = Date.UTC(by, bm - 1, bd);
  return Math.round((da - db) / 86400000);
}

// Cap on how many tasks can be marked done for a single day, so a user can't
// blast through a huge backlog of planned tasks in one sitting. Adding tasks
// (POST /tasks) is intentionally NOT capped — planning ahead stays free.
const MAX_COMPLETIONS_PER_DAY = 30;

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
      { returnDocument: 'after' }
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

    // Daily cap: count how many tasks for this same day are already done.
    // This is derived fresh each time (not a stored counter), so undoing a
    // completion (POST /uncomplete sets done back to false) automatically
    // frees up a slot for that day.
    const doneForDay = state.missions.filter(
      (m) => m.date === mission.date && m.done
    ).length;
    if (doneForDay >= MAX_COMPLETIONS_PER_DAY) {
      return res.status(400).json({ error: 'Daily completion limit reached' });
    }

    // Atomic: only flip done + grant rewards if it's still not done, and the
    // day's completion count is still under the cap, at the moment of the
    // write. Re-checking the cap here (via $expr) closes the race where two
    // concurrent completions both pass the pre-check above.
    const updated = await PlayerState.findOneAndUpdate(
      {
        clerkUserId: req.userId,
        missions: { $elemMatch: { id: taskId, done: false } },
        $expr: {
          $lt: [
            {
              $size: {
                $filter: {
                  input: '$missions',
                  as: 'm',
                  cond: { $and: [{ $eq: ['$$m.date', mission.date] }, { $eq: ['$$m.done', true] }] },
                },
              },
            },
            MAX_COMPLETIONS_PER_DAY,
          ],
        },
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
      { returnDocument: 'after' }
    );

    if (!updated) {
      return res.status(400).json({ error: 'Task already completed' });
    }

    // --- Streak: count consecutive days with at least one completed task ---
    // The client sends its own local date so the streak follows the user's day.
    const today = typeof req.body?.date === 'string' ? req.body.date : null;
    if (today) {
      const last = updated.lastActiveDate;
      if (last !== today) {
        // First completion of a new day: update the streak
        if (last && daysBetween(today, last) === 1) {
          updated.streak = (updated.streak || 0) + 1; // consecutive day
        } else {
          updated.streak = 1; // first ever, or the chain was broken
        }
        updated.lastActiveDate = today;
        await updated.save();
      }
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// POST /api/state/tasks/:id/uncomplete — undo a completed task; server revokes rewards
router.post('/tasks/:id/uncomplete', async (req, res, next) => {
  try {
    const taskId = Number(req.params.id);
    const state = await getOrCreateState(req.userId);

    const mission = state.missions.find((m) => m.id === taskId);
    if (!mission) {
      return res.status(404).json({ error: 'Task not found' });
    }
    if (!mission.done) {
      return res.status(400).json({ error: 'Task is not completed' });
    }

    // Revoke the task's XP/resources, then unwind (in reverse build order) any
    // built stage the player no longer qualifies for as a result — either its
    // resource cost is no longer covered or its level requirement is no
    // longer met. This mirrors /build's own checks, so undo is the exact
    // inverse of completing a task plus whatever building it paid for.
    let xp = Math.max(0, state.totalXp - (mission.xp || 0));
    const resources = {
      wood: state.resources.wood - (mission.resources?.wood || 0),
      stone: state.resources.stone - (mission.resources?.stone || 0),
      food: state.resources.food - (mission.resources?.food || 0),
    };
    let baseStageIndex = state.baseStageIndex;

    while (baseStageIndex >= 0) {
      const stage = BUILD_STAGES[baseStageIndex];
      const { level } = levelFromXp(xp);
      const noLongerQualifies =
        resources.wood < 0 ||
        resources.stone < 0 ||
        resources.food < 0 ||
        level < stage.requiredLevel;
      if (!noLongerQualifies) break;

      resources.wood += stage.cost.wood;
      resources.stone += stage.cost.stone;
      resources.food += stage.cost.food;
      baseStageIndex -= 1;
    }
    // Safety clamp — once baseStageIndex reaches -1 there's nothing left to
    // unwind, so this should already be non-negative.
    resources.wood = Math.max(0, resources.wood);
    resources.stone = Math.max(0, resources.stone);
    resources.food = Math.max(0, resources.food);

    // Atomic: only apply if the state is exactly what we read it as, so a
    // concurrent request (another undo, a build, a completion) can't race
    // this computation and leave the totals inconsistent.
    const updated = await PlayerState.findOneAndUpdate(
      {
        clerkUserId: req.userId,
        totalXp: state.totalXp,
        baseStageIndex: state.baseStageIndex,
        'resources.wood': state.resources.wood,
        'resources.stone': state.resources.stone,
        'resources.food': state.resources.food,
        missions: { $elemMatch: { id: taskId, done: true } },
      },
      {
        $set: {
          'missions.$[elem].done': false,
          totalXp: xp,
          'resources.wood': resources.wood,
          'resources.stone': resources.stone,
          'resources.food': resources.food,
          baseStageIndex,
        },
      },
      { returnDocument: 'after', arrayFilters: [{ 'elem.id': taskId }] }
    );

    if (!updated) {
      return res.status(409).json({ error: 'State changed, please retry' });
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
      { returnDocument: 'after' }
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
      { returnDocument: 'after' }
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