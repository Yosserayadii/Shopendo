const express = require('express');
const router = express.Router();
const Setting = require('../models/settings');

// Get current settings
router.get('/settings', async (req, res) => {
  try {
    const settings = await Setting.findOne();
    res.json(settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update settings
router.post('/settings', async (req, res) => {
  try {
    const { headerColor, sidebarColor, announcementMessage, announcementColor, uniqueColor, logoImage } = req.body;
    const setting = await Setting.findOneAndUpdate({}, { headerColor, sidebarColor, announcementMessage, announcementColor, uniqueColor, logoImage }, { new: true, upsert: true });
    res.json(setting);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;