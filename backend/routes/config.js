const express = require('express');
const { BUILD_STAGES } = require('../data/gameConfig');
const { TASK_CATALOG } = require('../data/taskCatalog');

const router = express.Router();

// Public game rules the frontend needs for display.
// No auth required — same for everyone, not sensitive.
router.get('/', (req, res) => {
  res.json({
    taskCatalog: TASK_CATALOG,
    buildStages: BUILD_STAGES,
  });
});

module.exports = router;