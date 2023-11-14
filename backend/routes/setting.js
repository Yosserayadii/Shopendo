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
    let setting = await Setting.findOne();

    if (!setting) {
      setting = new Setting({
        headerColor,
        sidebarColor,
        announcementColor,
        announcementMessage,
        uniqueColor: 'default',
        logoImage: 'default'
      });
    } else {
      setting.headerColor = headerColor;
      setting.sidebarColor = sidebarColor;
      setting.announcementMessage = announcementMessage;
      setting.announcementColor = announcementColor;
      setting.uniqueColor = uniqueColor;
      setting.logoImage = logoImage;
    }

    await setting.save();
    res.json(setting);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
