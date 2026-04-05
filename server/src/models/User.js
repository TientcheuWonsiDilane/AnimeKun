const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, default: "" }, // Filled via questionnaire
  avatar: { type: String, default: "" },   // URL from Google or Questionnaire
  isProfileComplete: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);