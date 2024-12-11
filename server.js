const express = require('express');
const fs = require('fs');
const path = require('path');
const prometheus = require('prom-client');

const app = express();
const PORT = process.env.PORT || 3000;

// Ruta del archivo JSON
const playersFilePath = path.join(__dirname, 'players.json');

// Middleware para analizar JSON en las solicitudes
app.use(express.json());

// Servir archivos estáticos
app.use(express.static('public'));

// Obtener la lista de jugadores
app.get('/players', (req, res) => {
    fs.readFile(playersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error leyendo el archivo:', err);
            return res.status(500).send('Error leyendo el archivo');
        }
        res.send(JSON.parse(data));
    });
});

// Añadir o actualizar un jugador
app.post('/players', (req, res) => {
    const newPlayer = req.body;

    fs.readFile(playersFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error leyendo el archivo' });

        let playersData = JSON.parse(data);
        const existingPlayerIndex = playersData.players.findIndex(p => p.id === newPlayer.id);

        if (existingPlayerIndex !== -1) {
            playersData.players[existingPlayerIndex] = newPlayer;
        } else {
            playersData.players.push(newPlayer);
        }

        fs.writeFile(playersFilePath, JSON.stringify(playersData, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Error escribiendo archivo' });
            res.status(201).json({ success: true, player: newPlayer });
        });
    });
});

// Eliminar un jugador
app.delete('/players/:id', (req, res) => {
    const playerId = parseInt(req.params.id);

    fs.readFile(playersFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error leyendo el archivo' });

        let playersData = JSON.parse(data);
        playersData.players = playersData.players.filter(p => p.id !== playerId);

        fs.writeFile(playersFilePath, JSON.stringify(playersData, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Error escribiendo archivo' });
            res.json({ success: true });
        });
    });
});

// Métricas y salud
const collectDefaultMetrics = prometheus.collectDefaultMetrics;
collectDefaultMetrics();

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', prometheus.register.contentType);
    const metrics = await prometheus.register.metrics();
    res.send(metrics);
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Control del servidor
let server;
if (require.main === module) {
    server = app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}

module.exports = {
    app,
    start: () => {
        server = app.listen(PORT, () => {
            console.log(`Servidor iniciado en http://localhost:${PORT}`);
        });
        return server;
    },
    stop: () => {
        return new Promise((resolve, reject) => {
            if (server) {
                server.close((err) => {
                    if (err) {
                        return reject(err);
                    }
                    console.log('Servidor detenido');
                    resolve();
                });
            } else {
                resolve();
            }
        });
    },
};
