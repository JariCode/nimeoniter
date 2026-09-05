const express = require('express');
const { verifyWebhook } = require('@clerk/express/webhooks');
const PlayerState = require('../models/PlayerState');

const router = express.Router();

// Clerk webhook endpoint.
// IMPORTANT: uses express.raw (not json) because signature verification
// needs the original unparsed body.
router.post(
  '/clerk',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    try {
      // Verify the Svix signature and parse the event
      const evt = await verifyWebhook(req);

      // When a user is deleted in Clerk, remove their game data
      if (evt.type === 'user.deleted') {
        const clerkUserId = evt.data.id;
        if (clerkUserId) {
          await PlayerState.deleteOne({ clerkUserId });
          console.log(`Deleted game data for user ${clerkUserId}`);
        }
      }

      res.status(200).json({ received: true });
    } catch (err) {
      console.error('Webhook verification failed:', err);
      res.status(400).json({ error: 'Invalid webhook' });
    }
  }
);

module.exports = router;