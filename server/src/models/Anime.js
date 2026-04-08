const mongoose = require('mongoose');

const AnimeSchema = new mongoose.Schema({
  id: { type: Number, required: true }, 
  name: { type: String, required: true },
  img: { type: String },
  chars: [String],
  category: { type: String, required: true }, 
  votes: { type: Number, default: 0 },
  voters: [{ 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: Date 
  }] 
});

module.exports = mongoose.model('Anime', AnimeSchema);