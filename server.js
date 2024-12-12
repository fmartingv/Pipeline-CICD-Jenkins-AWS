const express = require('express');
const fs = require('fs').promises;  // Use promise-based fs
const path = require('path');
const prometheus = require('prom-client');

const app = express();
const PORT = process.env.PORT || 3000;

// Path to the JSON file
const playersFilePath = path.join(__dirname, 'players.json');

// Middleware to parse JSON in requests
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// Get the list of players
app.get('/players', async (req, res) => {
    try {
        const data = await fs.readFile(playersFilePath, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        console.error('Error reading file:', err);
        res.status(500).json({ error: 'Error reading file' });
    }
});

// Add or update a player
app.post('/players', async (req, res) => {
    const newPlayer = req.body;

    try {
        const data = await fs.readFile(playersFilePath, 'utf8');
        let playersData = JSON.parse(data);
        const existingPlayerIndex = playersData.players.findIndex(p => p.id === newPlayer.id);

        if (existingPlayerIndex !== -1) {
            playersData.players[existingPlayerIndex] = newPlayer;
        } else {
            playersData.players.push(newPlayer);
        }

        await fs.writeFile(playersFilePath, JSON.stringify(playersData, null, 2));
        res.status(201).json({ success: true, player: newPlayer });
    } catch (err) {
        console.error('Error processing player:', err);
        res.status(500).json({ error: 'Error writing file' });
    }
});

// Delete a player
app.delete('/players/:id', async (req, res) => {
    const playerId = parseInt(req.params.id);

    try {
        const data = await fs.readFile(playersFilePath, 'utf8');
        let playersData = JSON.parse(data);
        playersData.players = playersData.players.filter(p => p.id !== playerId);

        await fs.writeFile(playersFilePath, JSON.stringify(playersData, null, 2));
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting player:', err);
        res.status(500).json({ error: 'Error writing file' });
    }
});

// Metrics 
const collectDefaultMetrics = prometheus.collectDefaultMetrics;
collectDefaultMetrics();

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', prometheus.register.contentType);
    const metrics = await prometheus.register.metrics();
    res.send(metrics);
});

// Server control
let server;

module.exports = {
    app,
    start: () => {
        return new Promise((resolve, reject) => {
            server = app.listen(PORT, '0.0.0.0', () => {
                console.log(`Server started on http://localhost:${PORT}`);
                resolve(server);
            });

            server.on('error', (err) => {
                console.error('Error starting server:', err);
                reject(err);
            });
        });
    },
    stop: () => {
        return new Promise((resolve, reject) => {
            if (server) {
                server.close((err) => {
                    if (err) {
                        return reject(err);
                    }
                    console.log('Server stopped');
                    resolve();
                });
            } else {
                resolve();
            }
        });
    },
};

// Start server if run directly
if (require.main === module) {
    module.exports.start().catch(console.error);
}