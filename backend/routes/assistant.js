const express = require('express');
const OpenAI = require('openai');
const requireAuth = require('../middleware/requireAuth');
const aiLimiter = require('../middleware/aiLimiter');
const PlayerState = require('../models/PlayerState');
const { BUILD_STAGES, levelFromXp } = require('../data/gameConfig');
const { TASK_CATALOG } = require('../data/taskCatalog');
const {
  ASSISTANT_MODEL,
  SYSTEM_PROMPT,
  MODE_INSTRUCTIONS,
} = require('../data/assistantConfig');

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.use(requireAuth);
router.use(aiLimiter);

// Builds a safe, read-only context for the AI from the player's saved state.
// All derived values use the same gameConfig functions as the rest of the
// game, so the AI sees exactly the same truth.
function buildContext(state) {
  const { level, xpIntoLevel, xpForNext } = levelFromXp(state.totalXp || 0);
  const nextStage = BUILD_STAGES[(state.baseStageIndex ?? -1) + 1] || null;

  // What's still missing for the next building (if anything is buildable)
  let nextBuilding = null;
  if (nextStage) {
    const r = state.resources || { wood: 0, stone: 0, food: 0 };
    nextBuilding = {
      name: nextStage.name,
      requiredLevel: nextStage.requiredLevel,
      cost: nextStage.cost,
      missing: {
        wood: Math.max(0, nextStage.cost.wood - (r.wood || 0)),
        stone: Math.max(0, nextStage.cost.stone - (r.stone || 0)),
        food: Math.max(0, nextStage.cost.food - (r.food || 0)),
      },
      levelReached: level >= nextStage.requiredLevel,
    };
  }

  return {
    level,
    xpIntoLevel,
    xpForNext,
    resources: state.resources || { wood: 0, stone: 0, food: 0 },
    streak: state.streak || 0,
    lastActiveDate: state.lastActiveDate || null,
    buildingsBuilt: (state.baseStageIndex ?? -1) + 1,
    buildingsTotal: BUILD_STAGES.length,
    nextBuilding, // null if the base is fully built
  };
}

// POST /api/assistant  { mode, question? }
router.post('/', async (req, res, next) => {
  try {
    const { mode, question } = req.body;
    const instruction = MODE_INSTRUCTIONS[mode];
    if (!instruction) {
      return res.status(400).json({ error: 'Unknown assistant mode' });
    }

    const state = await PlayerState.findOne({ clerkUserId: req.userId });
    if (!state) {
      return res.status(404).json({ error: 'No game state yet' });
    }

    const context = buildContext(state);

    // A light list of task names + keys so the AI can only suggest tasks that
    // actually exist (never invented ones).
    const taskList = TASK_CATALOG.map((t) => `${t.name} (${t.key})`).join(', ');

    const userContent = [
      `Player state: ${JSON.stringify(context)}`,
      `Available tasks: ${taskList}`,
      question ? `Player asks: ${String(question).slice(0, 300)}` : null,
      `Instruction: ${instruction}`,
    ]
      .filter(Boolean)
      .join('\n\n');

    const completion = await openai.chat.completions.create({
      model: ASSISTANT_MODEL,
      max_tokens: 150,
      temperature: 0.7,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userContent },
      ],
    });

    const message = completion.choices?.[0]?.message?.content?.trim() || '...';
    res.json({ message });
  } catch (err) {
    // OpenAI errors must not crash the game — the speech bubble just stays empty
    console.error('Assistant error', err);
    res.status(502).json({ error: 'Assistant is unavailable right now' });
  }
});

module.exports = router;