import request from 'supertest';
import express from 'express';
const app = express(); app.get('/health', (_req, res) => res.json({ status: 'ok' }));
test('GET /health returns status', async () => { const response = await request(app).get('/health').expect('Content-Type', /json/).expect(200); expect(response.body).toEqual({ status: 'ok' }); });
