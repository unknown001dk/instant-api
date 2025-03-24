const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mongoUri: { type: String, required: true }, // Store user-provided MongoDB Atlas URI
});

module.exports = mongoose.model('User', UserSchema);
