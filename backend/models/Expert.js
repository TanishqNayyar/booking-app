const mongoose = require('mongoose');

const ExpertSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  experience: { type: Number, required: true },
  rating: { type: Number, required: true },
  bio: String,
});

module.exports = mongoose.model('Expert', ExpertSchema);