const request = require('supertest');
const { app, start, stop } = require('../server');

let server;

beforeAll(() => {
    server = start(); // Inicia el servidor antes de las pruebas
});

afterAll(async () => {
    await stop(); // Detiene el servidor después de las pruebas
});

describe('Players API', () => {
    test('GET /players should return players list', async () => {
        const response = await request(app).get('/players');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body.players)).toBeTruthy();
    });

    test('POST /players should create new player', async () => {
        const newPlayer = {
            id: 999,
            name: "Test Player",
            position: "Delantero",
            number: 99,
            team: "Test Team",
            age: 25,
            nationality: "Test Nation",
            attributes: {
                pace: 80,
                shooting: 80,
                passing: 80,
                dribbling: 80,
                defending: 80,
                physical: 80,
                overall: 80,
            },
        };

        const response = await request(app).post('/players').send(newPlayer);
        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBeTruthy();
    });

    test('DELETE /players/:id should delete player', async () => {
        const response = await request(app).delete('/players/999');
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBeTruthy();
    });
});
