const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const PlayerState = require('../models/PlayerState');

const router = express.Router();

// All state routes require a logged-in user
router.use(requireAuth);

// GET /api/state — fetch the current user's game state (creates a fresh one if none)
router.get('/', async (req, res, next) => {
  try {
    let state = await PlayerState.findOne({ clerkUserId: req.userId });
    if (!state) {
      // First time: create a default state for this user
      state = await PlayerState.create({ clerkUserId: req.userId });
    }
    res.json(state);
  } catch (err) {
    next(err);
  }
});

// PUT /api/state — save the whole game state for the current user
router.put('/', async (req, res, next) => {
  try {
    const { totalXp, resources, baseStageIndex, missions } = req.body;

    const state = await PlayerState.findOneAndUpdate(
      { clerkUserId: req.userId },
      {
        clerkUserId: req.userId,
        totalXp,
        resources,
        baseStageIndex,
        missions,
      },
      { returnDocument: 'after', upsert: true, runValidators: true }
    );

    res.json(state);
  } catch (err) {
    next(err);
  }
});

module.exports = router;