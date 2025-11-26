const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');
const Player = require('../models/Player');

// Get all tournaments with populated data
router.get('/', async (req, res) => {
    try {
        const tournaments = await Tournament.find()
            .populate('groups.A')
            .populate('groups.B')
            .populate('matches.player1')
            .populate('matches.player2')
            .populate('matches.winner')
            .populate('matches.players'); // For Krunker
        res.json(tournaments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update match result
router.put('/:tournamentId/matches/:matchId', async (req, res) => {
    try {
        const { winnerId, score } = req.body;
        const tournament = await Tournament.findById(req.params.tournamentId);
        const match = tournament.matches.id(req.params.matchId);

        if (winnerId) match.winner = winnerId;
        if (score) match.score = score;

        await tournament.save();
        res.json(tournament);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
