const mongoose = require('mongoose');
const Player = require('./models/Player');
const Tournament = require('./models/Tournament');
require('dotenv').config();

const playersData = [
    { name: 'Bishworup Mollik', games: ['Krunker', 'Table Tennis'], avatar: 'bishworup.png' },
    { name: 'Sohan', games: ['Table Tennis'], avatar: 'sohanur.png' },
    { name: 'Saurov Chandra Biswas', games: ['Table Tennis'], avatar: 'saurov.jpg' },
    { name: 'Shofiqur Rahman', games: ['Krunker', 'Table Tennis'], avatar: 'shofiq.png' },
    { name: 'Imtiaz Cho', games: ['Table Tennis'], avatar: 'imtiaz.png' },
    { name: 'Hiranmoy Das Chowdhury', games: ['Krunker', 'Chess'], avatar: 'hiranmoy.jpg' },
    { name: 'Rasel Hossain', games: ['Krunker', 'Table Tennis', 'Chess'], avatar: 'rasel.png' },
    { name: 'Nihal Azmain', games: ['Krunker', 'Table Tennis', 'Chess'], avatar: 'nihal.jpg' },
    { name: 'Abdul Wahab', games: ['Chess'], avatar: 'abdul.png' },
    { name: 'Sourav Roy', games: ['Krunker', 'Table Tennis'], avatar: 'sourov.jpg' },
    { name: 'Sadi', games: ['Table Tennis', 'Chess', 'IAPC'], avatar: 'sadi.jpg' },
    { name: 'Rudro Debnath', games: ['Krunker', 'Table Tennis', 'Chess', 'IAPC'], avatar: 'rudro.png' },
    { name: 'Neaj Morshad', games: ['Table Tennis', 'IAPC'], avatar: 'Neaj.png' },
    { name: 'Sajib Kumar Chowdhury', games: ['Table Tennis', 'Chess', 'IAPC'], avatar: 'sajib.png' },
    { name: 'Md. Rafi Alam', games: ['Krunker', 'Table Tennis', 'IAPC'], avatar: 'rafi_alam.png' },
    { name: 'Samiul Haque', games: ['Krunker', 'Table Tennis', 'Chess', 'IAPC'], avatar: 'samiul.png' },
    { name: 'Zubair Ahmed Rafi', games: ['Krunker', 'Table Tennis', 'Chess', 'IAPC'], avatar: 'shuvo.jpg' },
    { name: 'Zahidul Islam', games: ['Table Tennis'], avatar: 'zahidul.png' },
    { name: 'Arnob', games: ['Table Tennis', 'Chess'], avatar: 'arnob.jpg' }
];

const gameMapping = {
    'Table Tennis': 'Table Tennis',
    'Krunker': 'Krunker',
    'Chess': 'Chess',
    'IAPC': 'Programming'
};

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        await Player.deleteMany({});
        await Tournament.deleteMany({});

        // Create Players
        const playerMap = {};
        for (const p of playersData) {
            const player = await Player.create({
                name: p.name,
                games: p.games.map(g => gameMapping[g] || g),
                avatarUrl: `/avatars/${p.avatar}`
            });
            playerMap[p.name] = player;
        }
        console.log('Players seeded');

        // Create Tournaments
        const games = ['Table Tennis', 'Krunker', 'Chess', 'Programming'];

        for (const game of games) {
            const participants = Object.values(playerMap).filter(p => p.games.includes(game));

            // Shuffle participants
            const shuffled = participants.sort(() => 0.5 - Math.random());

            // Split into 2 groups
            const mid = Math.ceil(shuffled.length / 2);
            const groupA = shuffled.slice(0, mid);
            const groupB = shuffled.slice(mid);

            const tournament = new Tournament({
                gameName: game,
                groups: {
                    A: groupA.map(p => p._id),
                    B: groupB.map(p => p._id)
                },
                matches: [], // Fixtures generation logic could go here, but keeping it simple for now
                status: 'Scheduled'
            });

            // Generate Group Stage Fixtures (Round Robin)
            // For Krunker, it's different (Battle Royale), but for others it's Round Robin
            if (game !== 'Krunker') {
                const generateRoundRobin = (group, groupName) => {
                    for (let i = 0; i < group.length; i++) {
                        for (let j = i + 1; j < group.length; j++) {
                            tournament.matches.push({
                                player1: group[i]._id,
                                player2: group[j]._id,
                                round: 'Group',
                                group: groupName
                            });
                        }
                    }
                };
                generateRoundRobin(groupA, 'A');
                generateRoundRobin(groupB, 'B');
            } else {
                // Krunker: 4 player battles. 
                // For simplicity in data structure, we might just create placeholder matches
                // But the user said "each round will happen in 4 player battle".
                // This is complex to model with simple player1 vs player2.
                // My MatchSchema has `players` array for this.

                // Let's just create one big match per group for now as a placeholder for the "Battle"
                tournament.matches.push({
                    players: groupA.map(p => p._id),
                    round: 'Group',
                    group: 'A'
                });
                tournament.matches.push({
                    players: groupB.map(p => p._id),
                    round: 'Group',
                    group: 'B'
                });
            }

            await tournament.save();
            console.log(`Tournament ${game} seeded`);
        }

        console.log('Seeding complete');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
