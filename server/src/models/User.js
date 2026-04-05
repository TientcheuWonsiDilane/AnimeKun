const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  googleId: { type: String },
  username: { type: String },
  avatar: { type: String },
  isProfileComplete: { type: Boolean, default: false },
  watchlist: [
    {
      mal_id: Number,
      title: String,
      image_url: String,
      watched:Boolean,
    }
  ],
  favorites: [
    {
      mal_id: Number,
      title: String,
      image_url: String,
    }
  ]
});

module.exports = mongoose.model('User', UserSchema);