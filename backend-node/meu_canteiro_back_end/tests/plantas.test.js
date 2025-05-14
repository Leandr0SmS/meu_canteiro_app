import request from 'supertest';
import app from '../src/app.js';

describe('Endpoints de Plantas', () => {
  it('GET /plantas deve retornar lista de plantas', async () => {
    const res = await request(app).get('/plantas');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /plantas deve adicionar uma planta', async () => {
    const res = await request(app)
      .post('/plantas')
      .send({ nome: 'Tomate', especie: 'Solanum lycopersicum' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('PUT /plantas/:id deve atualizar uma planta', async () => {
    const res = await request(app)
      .put('/plantas/1')
      .send({ nome: 'Tomateiro', especie: 'Solanum lycopersicum' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('DELETE /plantas/:id deve remover uma planta', async () => {
    const res = await request(app).delete('/plantas/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});