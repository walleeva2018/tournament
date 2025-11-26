const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    games: [String],
    avatarUrl: String
});

module.exports = mongoose.model('Player', PlayerSchema);
