const mongoose = require('mongoose');

// One document per user holds their entire game state.
// clerkUserId ties the document to the authenticated Clerk user.
const playerStateSchema = new mongoose.Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    totalXp: { type: Number, default: 0 },
    resources: {
      wood: { type: Number, default: 0 },
      stone: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
    },
    baseStageIndex: { type: Number, default: -1 },
    // Tasks are stored as a flexible array; shape matches the frontend
    missions: { type: Array, default: [] },
    // Streak: consecutive days with at least one completed task
    streak: { type: Number, default: 0 },
    // The user's local date (YYYY-MM-DD) of the last completed task
    lastActiveDate: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PlayerState', playerStateSchema);