const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  headerColor: {
    type: String,
    required: true,
  },
  sidebarColor: {
    type: String,
    required: true,
  },
  announcementMessage: {
    type: String,
    required: true,
  },
  announcementColor: {
    type: String,
    required: true,
  },
  uniqueColor: {
    type: String,
    required: true,
  },
  logoImage: {
    type: String,
    required: true,
  },
}, {
  collection: 'settings' // Specify the collection name explicitly
});

const Setting = mongoose.model('Setting', colorSchema);

module.exports = Setting;
