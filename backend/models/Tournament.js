const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    player1: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    player2: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }, // Can be null for initial fixtures if waiting for winner
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }], // For Krunker battle royale style
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    winners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }], // For Krunker top 2
    round: String, // 'Group', 'Semi', 'Final'
    group: String, // 'A', 'B'
    score: String
});

const TournamentSchema = new mongoose.Schema({
    gameName: { type: String, required: true },
    groups: {
        A: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
        B: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }]
    },
    matches: [MatchSchema],
    status: { type: String, default: 'Scheduled' }
});

module.exports = mongoose.model('Tournament', TournamentSchema);
