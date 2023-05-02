const Setting = require('../models/settings');

// Get current settings
const getCurrentSettings = async (req, res) => {
  try {
    const settings = await Setting.findOne();
    res.json(settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update settings
const updateSettings = async (req, res) => {
  const { headerColor, sidebarColor, announcementMessage, announcementColor, uniqueColor, logoImage  } = req.body;

  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = new Setting({
        headerColor,
        sidebarColor,
        announcementColor,
        announcementMessage, uniqueColor: 'default',
        logoImage: 'default'
      });
    } else {
      settings.headerColor = headerColor;
      settings.sidebarColor = sidebarColor;
      settings.announcementMessage = announcementMessage;
      settings.announcementColor = announcementColor;
      settings.uniqueColor = uniqueColor;
      settings.logoImage = logoImage
    }

    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getCurrentSettings,
  updateSettings
};
